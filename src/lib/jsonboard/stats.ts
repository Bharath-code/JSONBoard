import { formatNumber, titleize } from '$lib/utils';
import { parseNumberish } from './inference';
import type { DashboardStat, FlatRow, InferredField } from './types';

export function buildStats(rows: FlatRow[], fields: InferredField[]): DashboardStat[] {
  const numericFields = fields.filter((field) => field.kind === 'number');
  const stats: DashboardStat[] = [
    { label: 'Rows', value: formatNumber(rows.length, 0), detail: 'Parsed locally' },
    { label: 'Fields', value: formatNumber(fields.length, 0), detail: 'Flattened columns' }
  ];

  for (const field of numericFields.slice(0, 2)) {
    const values = rows
      .map((row) => parseNumberish(row[field.name]))
      .filter((value): value is number => value !== null);
    const total = values.reduce((sum, value) => sum + value, 0);
    stats.push({
      label: titleize(field.name),
      value: formatNumber(total),
      detail: `${formatNumber(total / Math.max(values.length, 1))} avg`
    });
  }

  return stats;
}
