<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import type { DashboardStat } from '$lib/jsonboard/types';

  let { stats }: { stats: DashboardStat[] } = $props();
</script>

<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
  {#each stats as stat}
    <Card.Root class="p-4">
      <p class="text-xs font-medium uppercase text-muted-foreground">{stat.label}</p>
      <p class="mt-2 text-2xl font-semibold tracking-tight">{stat.value}</p>
      <p class="mt-1 text-sm text-muted-foreground">{stat.detail}</p>
    </Card.Root>
  {/each}
</div>
