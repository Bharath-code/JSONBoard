<script lang="ts">
  import { cn } from '$lib/utils';
  import type { HTMLAttributes } from 'svelte/elements';

  type Primitive = HTMLAttributes<HTMLElement>;

  let { class: className, children, ...rest }: Primitive = $props();
</script>

<section
  class={cn('rounded-xl border border-border bg-card text-card-foreground shadow-sm', className)}
  {...rest}
>
  {@render children?.()}
</section>
