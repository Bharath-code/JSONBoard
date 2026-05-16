<script lang="ts">
  import { cn } from '$lib/utils';
  import type { HTMLAttributes } from 'svelte/elements';

  export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  let {
    class: className,
    tag: Tag = 'h3',
    children,
    ...rest
  }: HTMLAttributes<HTMLHeadingElement> & { tag?: HeadingLevel } = $props();
</script>

<svelte:element this={Tag} class={cn('font-semibold leading-none tracking-tight', className)} {...rest}>
  {@render children?.()}
</svelte:element>
