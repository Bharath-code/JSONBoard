<script lang="ts">
  import { cn } from '$lib/utils';
  import type { HTMLAttributes } from 'svelte/elements';

  let { class: className, children, ...rest }: HTMLAttributes<HTMLElement> = $props();
</script>

<div class={cn('p-6 pt-0', className)} {...rest}>
  {@render children?.()}
</div>
