<script lang="ts">
  import { cn } from '$lib/utils';
  import type { HTMLAttributes } from 'svelte/elements';

  type Indicator = 'dot' | 'line' | 'dashed';

  let {
    class: className,
    label,
    hideLabel = false,
    hideIndicator = false,
    indicator = 'dot' as Indicator,
    labelKey,
    nameKey,
    payload = [],
    ...rest
  }: HTMLAttributes<HTMLDivElement> & {
    label?: string;
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: Indicator;
    labelKey?: string;
    nameKey?: string;
    payload?: Array<{
      name?: string;
      value?: number | string;
      color?: string;
      label?: string;
    }>;
  } = $props();
</script>

<div
  class={cn(
    'rounded-lg border border-border bg-card px-3 py-1.5 text-sm shadow-md',
    className
  )}
  {...rest}
>
  {#if !hideLabel && label}
    <div class="mb-1 text-muted-foreground">{label}</div>
  {/if}
  {#each payload as item}
    <div class="flex items-center gap-2 py-0.5">
      {#if !hideIndicator && indicator}
        <span
          class={cn(
            'shrink-0 rounded-full',
            indicator === 'dot' && 'h-2.5 w-2.5',
            indicator === 'line' && 'h-0.5 w-4',
            indicator === 'dashed' && 'h-0.5 w-4 border-0 border-t border-dashed'
          )}
          style="background: {item.color ?? 'var(--chart-1)'}"
        ></span>
      {/if}
      <span class="text-muted-foreground">{item.name ?? item.label ?? ''}:</span>
      <span class="font-medium tabular-nums">{item.value ?? ''}</span>
    </div>
  {/each}
</div>
