<script lang="ts">
  import { cn } from '$lib/utils';
  import type { HTMLAttributes } from 'svelte/elements';

  export type ChartConfig = Record<string, { label?: string; color?: string }>;

  let {
    class: className,
    config = {},
    children,
    ...rest
  }: HTMLAttributes<HTMLDivElement> & { config?: ChartConfig } = $props();

  const style = $derived(
    Object.entries(config)
      .map(([key, value]) => `--color-${key}: ${value.color ?? 'var(--chart-1)'}`)
      .join(';')
  );
</script>

<div
  class={cn('flex w-full items-center justify-center', className)}
  {style}
  {...rest}
>
  {@render children?.()}
</div>
