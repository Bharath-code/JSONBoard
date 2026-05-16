<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import * as Chart from '$lib/components/ui/chart';
  import { Badge } from '$lib/components/ui/badge';
  import { formatNumber } from '$lib/utils';
  import { scaleBand, scalePoint, scaleTime } from 'd3-scale';
  import { BarChart, LineChart, ScatterChart } from 'layerchart';
  import type { ChartRecommendation } from '$lib/jsonboard/types';

  let { chart }: { chart: ChartRecommendation } = $props();

  // Build chart data in the shape LayerChart v1 expects
  const chartData = $derived(
    chart.data.map((d) => {
      const labelStr = String(d.label ?? d.x ?? '');
      // Try parsing as ISO date (e.g. YYYY-MM-DD or full timestamp)
      const parsedDate = new Date(labelStr);
      const isDate = !isNaN(parsedDate.getTime()) && labelStr.includes('-');

      return {
        label: isDate ? parsedDate : labelStr,
        value: Number.isNaN(Number(d.value)) ? 0 : Number(d.value),
        x: Number.isNaN(Number(d.x)) ? 0 : Number(d.x),
        y: Number.isNaN(Number(d.y ?? d.value)) ? 0 : Number(d.y ?? d.value),
      };
    })
  );

  // Chart config for shadcn-svelte container
  const chartConfig = $derived<Chart.ChartConfig>({
    value: { label: chart.title, color: 'var(--chart-1)' },
    secondary: { label: chart.title, color: 'var(--chart-2)' },
  });

  const maxValue = $derived(Math.max(...chart.data.map((d) => Math.abs(d.value)), 1));

  const xTickValues = $derived(
    chartData.length > 6
      ? chartData.filter((_, i) => i % Math.ceil(chartData.length / 6) === 0).map((d) => d.label)
      : undefined
  );

  const isTimeSeries = $derived(chartData.length > 0 && chartData[0].label instanceof Date);

  function getLineScale() {
    return isTimeSeries ? scaleTime() : scalePoint();
  }

  function getBarScale() {
    return isTimeSeries ? scaleTime() : scaleBand().padding(0.25);
  }

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
    <Chart.Container config={chartConfig} class="h-[220px] w-full">
      {#if chart.kind === 'line'}
        <LineChart
          data={chartData}
          xScale={getLineScale()}
          x="label"
          y="value"
          series={[{ key: 'value', label: chart.title, color: chartConfig.value.color }]}
          axis={true}
          grid={true}
          points={{ r: 3, fill: chartConfig.value.color }}
          props={{
            xAxis: { 
              tickValues: xTickValues,
              format: isTimeSeries ? (d) => d.toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : (d: string) => d?.length > 10 ? d.slice(0, 10) + '…' : d 
            },
          }}
        >
        </LineChart>

      {:else if chart.kind === 'scatter'}
        <ScatterChart
          data={chartData}
          xScale={getLineScale()}
          x="label"
          y="value"
          series={[{ key: 'default', data: chartData, color: chartConfig.secondary.color }]}
          axis={true}
          grid={true}
          props={{
            points: { r: 4, fill: chartConfig.secondary.color, fillOpacity: 0.6 },
            xAxis: { 
              tickValues: xTickValues,
              format: isTimeSeries ? (d) => d.toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : (d: string) => d?.length > 10 ? d.slice(0, 10) + '…' : d 
            },
          }}
        >
        </ScatterChart>

      {:else if chart.kind === 'bar' || chart.kind === 'histogram'}
        <BarChart
          data={chartData}
          xScale={getBarScale()}
          x="label"
          y="value"
          series={[{ key: 'value', label: chart.title, color: chartConfig.value.color }]}
          axis={true}
          grid={true}
          props={{
            xAxis: { 
              tickValues: xTickValues,
              format: isTimeSeries ? (d) => d.toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : (d: string) => d?.length > 12 ? d.slice(0, 12) + '…' : d 
            },
            bars: { radius: 4 },
          }}
        >
        </BarChart>

      {:else}
        <!-- Breakdown / horizontal bar fallback -->
        <div class="w-full space-y-3 px-1">
          {#each chart.data as datum}
            <div class="grid grid-cols-[minmax(6rem,1fr)_minmax(6rem,2fr)_4.5rem] items-center gap-3 text-sm">
              <div class="truncate text-muted-foreground" title={datum.label}>{datum.label}</div>
              <div class="h-3 rounded-full bg-muted">
                <div
                  class="h-3 rounded-full"
                  style="width: {barWidth(datum.value)}; background: {chart.data.indexOf(datum) % 2 === 0 ? chartConfig.value.color : chartConfig.secondary.color}"
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
