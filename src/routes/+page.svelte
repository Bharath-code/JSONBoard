<script lang="ts">
  import AlertCircle from 'lucide-svelte/icons/alert-circle';
  import CheckCircle2 from 'lucide-svelte/icons/check-circle-2';
  import FileJson2 from 'lucide-svelte/icons/file-json-2';
  import Link2 from 'lucide-svelte/icons/link-2';
  import LockKeyhole from 'lucide-svelte/icons/lock-keyhole';
  import RefreshCw from 'lucide-svelte/icons/refresh-cw';
  import ShieldAlert from 'lucide-svelte/icons/shield-alert';
  import Sparkles from 'lucide-svelte/icons/sparkles';
  import { Alert } from '$lib/components/ui/alert';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Textarea } from '$lib/components/ui/textarea';
  import ChartCard from '$lib/components/jsonboard/ChartCard.svelte';
  import DataTable from '$lib/components/jsonboard/DataTable.svelte';
  import StatCards from '$lib/components/jsonboard/StatCards.svelte';
  import { examples } from '$lib/jsonboard/examples';
  import { createDashboardStore } from '$lib/stores/dashboard-store.svelte';

  const board = createDashboardStore();
  let fileInput: HTMLInputElement | null = $state(null);

  $effect(() => {
    board.generate();
  });

  async function loadFile(event: Event) {
    const file = (event.currentTarget as HTMLInputElement).files?.[0];
    if (!file) return;
    board.input = await file.text();
    board.generate();
  }
</script>

<svelte:head>
  <title>JSONBoard - Paste JSON. Get a dashboard.</title>
</svelte:head>

<main class="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
  <!-- Header -->
  <header class="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-center lg:justify-between">
    <div>
      <div class="flex flex-wrap items-center gap-2">
        <div class="flex size-9 items-center justify-center rounded-md bg-foreground text-background">
          <FileJson2 class="size-5" />
        </div>
        <h1 class="text-2xl font-semibold tracking-tight">JSONBoard</h1>
        <Badge variant="outline"><LockKeyhole class="mr-1 size-3" /> Local-first</Badge>
      </div>
      <p class="mt-2 max-w-2xl text-sm text-muted-foreground">
        Paste JSON. Get a useful, beautiful, shareable dashboard in seconds.
      </p>
    </div>
    <div class="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onclick={() => fileInput?.click()}>
        <FileJson2 class="size-4" />
        Upload JSON/JSONL
      </Button>
      <input bind:this={fileInput} class="hidden" type="file" accept=".json,.jsonl,application/json" onchange={loadFile} />
      <Button size="sm" onclick={board.generate}>
        <Sparkles class="size-4" />
        Generate dashboard
      </Button>
    </div>
  </header>

  <div class="grid gap-5 xl:grid-cols-[minmax(360px,0.82fr)_minmax(0,1.18fr)]">
    <!-- Left: JSON Input -->
    <Card.Root class="h-fit">
      <Card.Header class="pb-3">
        <div class="flex items-center justify-between gap-3">
          <div class="min-w-0">
            <Card.Title>Source JSON</Card.Title>
            <Card.Description>JSON array, single object, or JSONL.</Card.Description>
          </div>
          <Button variant="ghost" size="icon" aria-label="Reset to API example" onclick={() => board.loadExample('api')}>
            <RefreshCw class="size-4" />
          </Button>
        </div>
      </Card.Header>

      <Card.Content class="pt-0">
        <div class="mb-3 flex flex-wrap gap-2">
          {#each Object.entries(examples) as [key, example]}
            <Button variant="secondary" size="sm" onclick={() => board.loadExample(key as keyof typeof examples)}>
              {example.label}
            </Button>
          {/each}
        </div>

        <Textarea bind:value={board.input} spellcheck="false" oninput={() => (board.error ? board.generate() : undefined)} />

        {#if board.error}
          <Alert variant="destructive" class="mt-3">
            <AlertCircle class="size-4" />
            <span>{board.error}</span>
          </Alert>
        {:else}
          <Alert class="mt-3 border-green-200 bg-green-50 text-green-800">
            <CheckCircle2 class="size-4 text-green-600" />
            <span>Data stays in this browser until you explicitly share or save.</span>
          </Alert>
        {/if}
      </Card.Content>
    </Card.Root>

    <!-- Right: Dashboard Output -->
    <section class="space-y-5">
      {#if board.dashboard}
        <!-- Dashboard status bar -->
        <div class="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="font-semibold">Dashboard ready</h2>
              <Badge variant="secondary">{board.dashboard.parseMs.toFixed(0)}ms</Badge>
              <Badge variant={board.dashboard.sensitiveFields.length ? 'destructive' : 'secondary'}>
                {board.dashboard.sensitiveFields.length
                  ? `${board.dashboard.sensitiveFields.length} sensitive fields`
                  : 'No obvious secrets'}
              </Badge>
            </div>
            <p class="mt-1 text-sm text-muted-foreground">
              {board.dashboard.rows.length.toLocaleString()} rows · {board.dashboard.fields.length} fields
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            {#if board.dashboard.sensitiveFields.length}
              <Button variant="outline" size="sm" onclick={board.redactSensitive}>
                <ShieldAlert class="size-4" />
                Redact
              </Button>
            {/if}
            <Button variant="outline" size="sm" onclick={board.prepareShare}>
              <Link2 class="size-4" />
              Share
            </Button>
          </div>
        </div>

        <!-- Warnings -->
        {#if board.dashboard.warnings.length}
          <div class="grid gap-2">
            {#each board.dashboard.warnings as warning}
              <Alert>{warning}</Alert>
            {/each}
          </div>
        {/if}

        <!-- Stat cards -->
        <StatCards stats={board.dashboard.stats} />

        <!-- Charts -->
        {#if board.dashboard.charts.length}
          <div class="grid gap-4 2xl:grid-cols-2">
            {#each board.dashboard.charts as chart}
              <ChartCard {chart} />
            {/each}
          </div>
        {:else}
          <Alert>
            Chart confidence was low for this payload, so JSONBoard is leading with stats and the table.
          </Alert>
        {/if}

        <!-- Data table -->
        <DataTable
          rows={board.dashboard.rows}
          fields={board.dashboard.fields}
          bind:query={board.query}
          bind:sort={board.sort}
        />
      {/if}
    </section>
  </div>

  <!-- Share modal -->
  {#if board.isSharing && board.dashboard}
    <div class="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="presentation" onclick={board.closeShare}>
      <Card.Root class="w-full max-w-lg" onclick={(event) => event.stopPropagation()}>
        <Card.Header>
          <div class="flex items-start gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
              <Link2 class="size-5" />
            </div>
            <div class="min-w-0 flex-1">
              <Card.Title>Share backend is next</Card.Title>
              <Card.Description class="mt-2 leading-relaxed">
                The production app now has local parsing, chart recommendations, redaction, and the dashboard shell.
                The <code class="rounded bg-muted px-1 py-0.5 text-xs">/api/share</code> and <code class="rounded bg-muted px-1 py-0.5 text-xs">/d/:slug</code> routes will persist sanitized dashboards through Cloudflare KV/R2.
              </Card.Description>
            </div>
          </div>
        </Card.Header>

        {#if board.dashboard.sensitiveFields.length}
          <Card.Content class="pt-0">
            <Alert variant="destructive">
              <ShieldAlert class="size-4" />
              <span>Redact detected fields before creating a public link: {board.dashboard.sensitiveFields.join(', ')}</span>
            </Alert>
          </Card.Content>
        {/if}

        <Card.Footer class="justify-end gap-2">
          {#if board.dashboard.sensitiveFields.length}
            <Button variant="outline" onclick={board.redactSensitive}>Redact now</Button>
          {/if}
          <Button onclick={board.closeShare}>Done</Button>
        </Card.Footer>
      </Card.Root>
    </div>
  {/if}
</main>
