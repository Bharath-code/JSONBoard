<script lang="ts">
  import { cn } from '$lib/utils';
  import type { HTMLAttributes } from 'svelte/elements';

  type Variant = 'default' | 'secondary' | 'outline' | 'destructive';
  let {
    class: className,
    variant = 'default',
    children,
    ...rest
  }: HTMLAttributes<HTMLSpanElement> & { variant?: Variant } = $props();

  const variants: Record<Variant, string> = {
    default: 'border-transparent bg-primary text-primary-foreground shadow',
    secondary: 'border-transparent bg-secondary text-secondary-foreground',
    outline: 'text-foreground border border-border',
    destructive: 'border-transparent bg-destructive text-destructive-foreground shadow'
  };
</script>

<span
  class={cn(
    'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    variants[variant],
    className
  )}
  {...rest}
>
  {@render children?.()}
</span>
