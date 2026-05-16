<script lang="ts" generics="TData, TValue">
  import {
    type ColumnDef,
    type PaginationState,
    type SortingState,
    type ColumnFiltersState,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
  } from '@tanstack/table-core';
  import { createRawSnippet } from 'svelte';
  import { createSvelteTable, FlexRender, renderSnippet } from '$lib/components/ui/data-table/index.js';
  import * as Table from '$lib/components/ui/table/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
  import Search from 'lucide-svelte/icons/search';
  import type { FlatRow, InferredField } from '$lib/jsonboard/types';
  import { formatNumber } from '$lib/utils';
  import { parseNumberish } from '$lib/jsonboard/inference';

  let {
    rows,
    fields,
  }: {
    rows: FlatRow[];
    fields: InferredField[];
  } = $props();

  function isStatus(value: unknown) {
    return typeof value === 'string' && /^(active|inactive|success|failed|error|pending|paid|free|pro|team|true|false)$/i.test(value);
  }

  function formatCell(value: unknown, field: InferredField) {
    if (value === null || value === undefined || value === '') return '—';
    if (field.kind === 'number' && typeof value === 'number') return formatNumber(value);
    return String(value);
  }

  const columns = $derived(
    fields.slice(0, 32).map((field) => {
      return {
        accessorKey: field.name,
        header: ({ column }: { column: any }) => {
          const sortSnippet = createRawSnippet(() => ({
            render: () => `<div class="flex items-center gap-2 cursor-pointer select-none hover:text-foreground">
              <span class="max-w-40 truncate">${field.name}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3 text-muted-foreground/60"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
            </div>`,
            setup: (element: HTMLElement) => {
              const handler = column.getToggleSortingHandler();
              if (handler) element.addEventListener('click', handler);
              return () => {
                if (handler) element.removeEventListener('click', handler);
              };
            }
          }));
          return renderSnippet(sortSnippet);
        },
        cell: ({ row }: { row: any }) => {
          const value = row.original[field.name];
          const formatted = formatCell(value, field);
          const isNum = field.kind === 'number';
          const isStat = isStatus(value);
          
          if (isStat) {
            const badgeSnippet = createRawSnippet(() => ({
              render: () => `<div class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 text-[10px]">${formatted}</div>`
            }));
            return renderSnippet(badgeSnippet);
          }
          
          if (value === null || value === undefined || value === '') {
            const emptySnippet = createRawSnippet(() => ({
              render: () => `<span class="text-muted-foreground/50">—</span>`
            }));
            return renderSnippet(emptySnippet);
          }

          const cellSnippet = createRawSnippet(() => ({
            render: () => `<div class="max-w-64 truncate ${isNum ? 'text-right tabular-nums' : ''}" title="${formatted}">${formatted}</div>`
          }));
          return renderSnippet(cellSnippet);
        },
        sortingFn: (rowA: any, rowB: any, columnId: string) => {
          const left = rowA.original[columnId];
          const right = rowB.original[columnId];
          if (field.kind === 'number') {
            return (parseNumberish(left) ?? 0) - (parseNumberish(right) ?? 0);
          }
          return String(left ?? '').localeCompare(String(right ?? ''));
        }
      } as ColumnDef<FlatRow, unknown>;
    })
  );

  let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 20 });
  let sorting = $state<SortingState>([]);
  let globalFilter = $state('');

  const table = createSvelteTable({
    get data() { return rows; },
    get columns() { return columns; },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        pagination = updater(pagination);
      } else {
        pagination = updater;
      }
    },
    onSortingChange: (updater) => {
      if (typeof updater === 'function') {
        sorting = updater(sorting);
      } else {
        sorting = updater;
      }
    },
    onGlobalFilterChange: (updater) => {
      if (typeof updater === 'function') {
        globalFilter = updater(globalFilter);
      } else {
        globalFilter = updater;
      }
    },
    state: {
      get pagination() { return pagination; },
      get sorting() { return sorting; },
      get globalFilter() { return globalFilter; },
    },
  });
</script>

<section class="rounded-xl border border-border bg-card shadow-sm">
  <div class="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 class="font-semibold">Data table</h2>
      <p class="text-sm text-muted-foreground">
        {formatNumber(table.getFilteredRowModel().rows.length, 0)} matching rows · {formatNumber(fields.length, 0)} fields
      </p>
    </div>
    <label class="relative w-full sm:max-w-xs">
      <Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input 
        value={globalFilter} 
        oninput={(e) => table.setGlobalFilter(e.currentTarget.value)}
        class="pl-9" 
        placeholder="Search all columns" 
      />
    </label>
  </div>

  <div class="max-h-[600px] overflow-auto">
    <Table.Root>
      <Table.Header class="sticky top-0 z-10 bg-muted/50 backdrop-blur-sm">
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <Table.Row>
            {#each headerGroup.headers as header, index (header.id)}
              <Table.Head class="{index === 0 ? 'sticky left-0 z-20 bg-muted/50 backdrop-blur-sm' : ''}">
                {#if !header.isPlaceholder}
                  <FlexRender
                    content={header.column.columnDef.header}
                    context={header.getContext()}
                  />
                {/if}
              </Table.Head>
            {/each}
          </Table.Row>
        {/each}
      </Table.Header>
      <Table.Body>
        {#each table.getRowModel().rows as row (row.id)}
          <Table.Row>
            {#each row.getVisibleCells() as cell, index (cell.id)}
              <Table.Cell class="{index === 0 ? 'sticky left-0 bg-card font-medium' : ''}">
                <FlexRender
                  content={cell.column.columnDef.cell}
                  context={cell.getContext()}
                />
              </Table.Cell>
            {/each}
          </Table.Row>
        {:else}
          <Table.Row>
            <Table.Cell colspan={columns.length} class="h-24 text-center">
              No results.
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>

  <div class="flex items-center justify-between border-t border-border px-4 py-3">
    <p class="text-sm text-muted-foreground">
      Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
    </p>
    <div class="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onclick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onclick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next
      </Button>
    </div>
  </div>
</section>
