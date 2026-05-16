import { recommendCharts } from './chart-engine';
import { inferFields } from './inference';
import { parseInput, flattenRows } from './parser';
import { detectSensitiveFields, redactRows } from './sensitive';
import { buildStats } from './stats';
import type { DashboardModel, FlatRow } from './types';

export function buildDashboard(rawInput: string): DashboardModel {
  const started = performance.now();
  const parsed = parseInput(rawInput);
  const rows = flattenRows(parsed.value);
  return buildDashboardFromRows(rawInput, rows, parsed.warnings, performance.now() - started);
}

export function buildDashboardFromRows(
  rawInput: string,
  rows: FlatRow[],
  warnings: string[] = [],
  parseMs = 0
): DashboardModel {
  const fields = inferFields(rows);
  const sensitiveFields = detectSensitiveFields(rows);
  const charts = recommendCharts(rows, fields);
  const stats = buildStats(rows, fields);

  return {
    rawInput,
    rows,
    fields,
    charts,
    stats,
    warnings,
    parseMs,
    sensitiveFields
  };
}

export function redactDashboard(model: DashboardModel) {
  const rows = redactRows(model.rows, model.sensitiveFields);
  return buildDashboardFromRows(JSON.stringify(rows, null, 2), rows, ['Sensitive values redacted locally.'], model.parseMs);
}
