<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import * as Chart from '$lib/components/ui/chart';
  import { Badge } from '$lib/components/ui/badge';
  import { formatNumber } from '$lib/utils';
  import { BarChart, LineChart, ScatterChart } from 'layerchart';
  import type { ChartRecommendation } from '$lib/jsonboard/types';

  let { chart }: { chart: ChartRecommendation } = $props();

  // Build chart data in the shape LayerChart v1 expects
  const chartData = $derived(
    chart.data.map((d) => ({
      label: d.label,
      value: d.value,
      x: Number(d.x ?? 0),
      y: Number(d.y ?? d.value),
    }))
  );

  // Preferred chart colors by kind, cycling through chart-1..chart-5
  const colorCycle = $derived<string[]>([
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
  ]);

  // Chart config for shadcn-svelte container
  const chartConfig = $derived<Chart.ChartConfig>({
    value: { label: chart.title, color: colorCycle[0] },
    secondary: { label: chart.title, color: colorCycle[1] },
  });

  const maxValue = $derived(Math.max(...chart.data.map((d) => Math.abs(d.value)), 1));

  function barWidth(value: number) {
    return `${Math.max(4, (Math.abs(value) / maxValue) * 100)}%`;
  }
</script>

<Card.Root class="overflow-hidden">
  <Card.Header class="pb-3">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0 flex-1">
        <Card.Title class="text-sm">{chart.title}</Card.Title>
        <Card.Description class="mt-1">{chart.description}</Card.Description>
      </div>
      <Badge variant="secondary" class="shrink-0">{chart.score}</Badge>
    </div>
  </Card.Header>

  <Card.Content class="pt-0">
    <Chart.Container config={chartConfig} class="min-h-[220px] w-full">
      {#if chart.kind === 'line'}
        <LineChart
          data={chartData}
          x="label"
          y="value"
          series={[{ key: 'value', label: chart.title, color: colorCycle[0] }]}
          axis={true}
          grid={true}
          tooltip={true}
          points={{ r: 3, fill: colorCycle[0] }}
          props={{
            xAxis: { format: (d: string) => d?.length > 10 ? d.slice(0, 10) + '…' : d },
          }}
        />

      {:else if chart.kind === 'scatter'}
        <ScatterChart
          data={chartData}
          x="x"
          y="y"
          series={[{ key: 'default', data: chartData, color: colorCycle[1] }]}
          axis={true}
          grid={true}
          tooltip={true}
          props={{
            points: { r: 4, fill: colorCycle[1], fillOpacity: 0.6 },
          }}
        />

      {:else if chart.kind === 'bar' || chart.kind === 'histogram'}
        <BarChart
          data={chartData}
          x="label"
          y="value"
          bandPadding={0.25}
          series={[{ key: 'value', label: chart.title, color: colorCycle[0] }]}
          axis={true}
          grid={true}
          tooltip={true}
          props={{
            xAxis: { format: (d: string) => d?.length > 12 ? d.slice(0, 12) + '…' : d },
            bars: { radius: 4 },
          }}
        />

      {:else}
        <!-- Breakdown / horizontal bar fallback -->
        <div class="w-full space-y-3 px-1">
          {#each chart.data as datum}
            <div class="grid grid-cols-[minmax(6rem,1fr)_minmax(6rem,2fr)_4.5rem] items-center gap-3 text-sm">
              <div class="truncate text-muted-foreground" title={datum.label}>{datum.label}</div>
              <div class="h-3 rounded-full bg-muted">
                <div
                  class="h-3 rounded-full"
                  style="width: {barWidth(datum.value)}; background: {colorCycle[chart.data.indexOf(datum) % colorCycle.length]}"
                ></div>
              </div>
              <div class="text-right font-medium tabular-nums">{formatNumber(datum.value)}</div>
            </div>
          {/each}
        </div>
      {/if}
    </Chart.Container>
  </Card.Content>
</Card.Root>
