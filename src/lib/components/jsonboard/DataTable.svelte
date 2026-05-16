<script lang="ts">
  import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
  import Search from 'lucide-svelte/icons/search';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Badge } from '$lib/components/ui/badge';
  import { formatNumber } from '$lib/utils';
  import type { FlatRow, InferredField, SortState } from '$lib/jsonboard/types';

  let {
    rows,
    fields,
    query = $bindable(''),
    sort = $bindable(null)
  }: {
    rows: FlatRow[];
    fields: InferredField[];
    query: string;
    sort: SortState;
  } = $props();

  const visibleFields = $derived(fields.slice(0, 32));
  const filteredRows = $derived(filterRows(rows, visibleFields.map((field) => field.name), query));
  const sortedRows = $derived(sortRows(filteredRows, sort, fields));
  const capRows = $derived(rows.length > 500 ? 500 : sortedRows.length);
  const visibleRows = $derived(sortedRows.slice(0, capRows));

  function toggleSort(key: string) {
    if (!sort || sort.key !== key) sort = { key, direction: 'asc' };
    else if (sort.direction === 'asc') sort = { key, direction: 'desc' };
    else sort = null;
  }

  function formatCell(value: unknown, field: InferredField) {
    if (value === null || value === undefined || value === '') return '—';
    if (field.kind === 'number' && typeof value === 'number') return formatNumber(value);
    return String(value);
  }

  function isStatus(value: unknown) {
    return typeof value === 'string' && /^(active|inactive|success|failed|error|pending|paid|free|pro|team|true|false)$/i.test(value);
  }

  function sortIcon(key: string) {
    if (!sort || sort.key !== key) return '';
    return sort.direction === 'asc' ? '↑' : '↓';
  }
</script>

<section class="rounded-xl border border-border bg-card shadow-sm">
  <!-- Table header -->
  <div class="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 class="font-semibold">Data table</h2>
      <p class="text-sm text-muted-foreground">
        {formatNumber(filteredRows.length, 0)} matching rows · {formatNumber(fields.length, 0)} fields
      </p>
    </div>
    <label class="relative w-full sm:max-w-xs">
      <Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input bind:value={query} class="pl-9" placeholder="Search visible columns" />
    </label>
  </div>

  <!-- Scrollable table -->
  <div class="max-h-[600px] overflow-auto">
    <table class="w-full min-w-[800px] border-collapse text-sm">
      <thead class="sticky top-0 z-10 bg-muted/50 backdrop-blur-sm">
        <tr>
          {#each visibleFields as field, index}
            <th class="border-b border-border px-3 py-2.5 text-left font-medium text-muted-foreground {index === 0 ? 'sticky left-0 z-20 bg-muted/50 backdrop-blur-sm' : ''}">
              <Button variant="ghost" size="sm" class="h-7 px-1.5 font-medium" onclick={() => toggleSort(field.name)}>
                <span class="max-w-40 truncate">{field.name}</span>
                <span class="text-xs text-muted-foreground">{sortIcon(field.name)}</span>
                <ArrowUpDown class="size-3 text-muted-foreground/60" />
              </Button>
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each visibleRows as row}
          <tr class="border-b border-border/50 transition-colors hover:bg-muted/30">
            {#each visibleFields as field, index}
              <td
                class="max-w-64 truncate px-3 py-2.5 {field.kind === 'number' ? 'text-right tabular-nums' : ''} {index === 0 ? 'sticky left-0 bg-card font-medium' : ''}"
                title={formatCell(row[field.name], field)}
              >
                {#if isStatus(row[field.name])}
                  <Badge variant="secondary" class="text-[10px]">{formatCell(row[field.name], field)}</Badge>
                {:else if row[field.name] === null || row[field.name] === undefined || row[field.name] === ''}
                  <span class="text-muted-foreground/50">—</span>
                {:else}
                  {formatCell(row[field.name], field)}
                {/if}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  {#if sortedRows.length > visibleRows.length}
    <p class="border-t border-border px-4 py-3 text-sm text-muted-foreground">
      Showing first {visibleRows.length} rows. Search or sort to narrow the dataset.
    </p>
  {/if}
</section>

<script lang="ts" module>
  import { parseNumberish } from '$lib/jsonboard/inference';

  function filterRows(rows: FlatRow[], fieldNames: string[], query: string) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return rows;
    return rows.filter((row) =>
      fieldNames.some((field) => String(row[field] ?? '').toLowerCase().includes(normalized))
    );
  }

  function sortRows(rows: FlatRow[], sort: SortState, fields: InferredField[]) {
    if (!sort) return rows;
    const field = fields.find((item) => item.name === sort.key);
    const direction = sort.direction === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const left = a[sort.key];
      const right = b[sort.key];
      if (field?.kind === 'number') {
        return ((parseNumberish(left) ?? 0) - (parseNumberish(right) ?? 0)) * direction;
      }
      return String(left ?? '').localeCompare(String(right ?? '')) * direction;
    });
  }
</script>
