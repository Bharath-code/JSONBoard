import { formatNumber, titleize } from '$lib/utils';
import { parseDateish, parseNumberish } from './inference';
import type { ChartDatum, ChartRecommendation, FlatRow, InferredField } from './types';

export function recommendCharts(rows: FlatRow[], fields: InferredField[]): ChartRecommendation[] {
  if (rows.length === 0) return [];

  const numeric = fields.filter((field) => field.kind === 'number' && !field.isSensitive);
  const categorical = fields.filter((field) => field.kind === 'categorical' && !field.isSensitive);
  const datetimes = fields.filter((field) => field.kind === 'datetime' && !field.isSensitive);
  const booleans = fields.filter((field) => field.kind === 'boolean' && !field.isSensitive);

  const candidates: ChartRecommendation[] = [];

  for (const time of datetimes.slice(0, 2)) {
    for (const measure of numeric.slice(0, 4)) {
      candidates.push(timeSeries(rows, time.name, measure.name));
    }
  }

  for (const dimension of categorical.slice(0, 6)) {
    for (const measure of numeric.slice(0, 4)) {
      candidates.push(categoryMeasure(rows, dimension.name, measure.name, dimension.uniqueCount));
    }
    if (dimension.uniqueCount <= 12) candidates.push(breakdown(rows, dimension.name));
  }

  for (const field of booleans.slice(0, 3)) candidates.push(breakdown(rows, field.name));

  for (let i = 0; i < numeric.length; i += 1) {
    for (let j = i + 1; j < numeric.length; j += 1) {
      const chart = scatter(rows, numeric[i].name, numeric[j].name);
      if (chart.score >= 62) candidates.push(chart);
    }
  }

  for (const field of numeric.slice(0, 3)) candidates.push(histogram(rows, field.name));

  return candidates
    .filter((candidate) => candidate.score >= 42 && candidate.data.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

function categoryMeasure(
  rows: FlatRow[],
  categoryField: string,
  numberField: string,
  uniqueCount: number
): ChartRecommendation {
  const grouped = new Map<string, number>();
  for (const row of rows) {
    const label = String(row[categoryField] ?? 'Empty');
    const value = parseNumberish(row[numberField]);
    if (value !== null) grouped.set(label, (grouped.get(label) ?? 0) + value);
  }
  const data = topValues(grouped, 12);
  const cardinalityScore = uniqueCount >= 3 && uniqueCount <= 12 ? 15 : uniqueCount > 20 ? -18 : 2;
  return {
    id: `bar:${categoryField}:${numberField}`,
    kind: data.length > 8 ? 'bar' : 'bar',
    title: `${titleize(numberField)} by ${titleize(categoryField)}`,
    description: `Top ${data.length} groups by total ${titleize(numberField).toLowerCase()}.`,
    score: 70 + cardinalityScore + nameSignal(numberField),
    xField: categoryField,
    yField: numberField,
    data
  };
}

function timeSeries(rows: FlatRow[], timeField: string, numberField: string): ChartRecommendation {
  const grouped = new Map<string, number>();
  for (const row of rows) {
    const time = parseDateish(row[timeField]);
    const value = parseNumberish(row[numberField]);
    if (time === null || value === null) continue;
    const label = new Date(time).toISOString().slice(0, 10);
    grouped.set(label, (grouped.get(label) ?? 0) + value);
  }
  const data = [...grouped.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, value]) => ({ label, value }));
  return {
    id: `line:${timeField}:${numberField}`,
    kind: 'line',
    title: `${titleize(numberField)} over time`,
    description: `Daily trend from ${titleize(timeField)}.`,
    score: 92 + nameSignal(numberField),
    xField: timeField,
    yField: numberField,
    data: downsample(data, 80)
  };
}

function breakdown(rows: FlatRow[], field: string): ChartRecommendation {
  const grouped = new Map<string, number>();
  for (const row of rows) {
    const label = String(row[field] ?? 'Empty');
    grouped.set(label, (grouped.get(label) ?? 0) + 1);
  }
  const data = topValues(grouped, 10);
  return {
    id: `breakdown:${field}`,
    kind: 'breakdown',
    title: `${titleize(field)} breakdown`,
    description: `${formatNumber(rows.length, 0)} rows grouped by ${titleize(field).toLowerCase()}.`,
    score: data.length >= 2 && data.length <= 10 ? 68 : 44,
    groupField: field,
    data
  };
}

function scatter(rows: FlatRow[], xField: string, yField: string): ChartRecommendation {
  const pairs = rows
    .map((row) => ({ x: parseNumberish(row[xField]), y: parseNumberish(row[yField]) }))
    .filter((point): point is { x: number; y: number } => point.x !== null && point.y !== null);
  const correlation = Math.abs(pearson(pairs));
  const data = downsample(
    pairs.map((point, index) => ({ label: String(index + 1), value: point.y, x: point.x, y: point.y })),
    250
  );
  return {
    id: `scatter:${xField}:${yField}`,
    kind: 'scatter',
    title: `${titleize(yField)} vs ${titleize(xField)}`,
    description: correlation > 0.5 ? `Visible relationship, r=${correlation.toFixed(2)}.` : 'Comparison between two numeric fields.',
    score: 58 + (correlation > 0.5 ? 22 : 0) + nameSignal(yField),
    xField,
    yField,
    data
  };
}

function histogram(rows: FlatRow[], field: string): ChartRecommendation {
  const values = rows.map((row) => parseNumberish(row[field])).filter((value): value is number => value !== null);
  if (values.length === 0) {
    return { id: `histogram:${field}`, kind: 'histogram', title: titleize(field), description: '', score: 0, data: [] };
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const bucketCount = Math.min(12, Math.max(5, Math.ceil(Math.sqrt(values.length))));
  const width = (max - min || 1) / bucketCount;
  const buckets = Array.from({ length: bucketCount }, (_, index) => ({
    label: `${formatNumber(min + index * width)}-${formatNumber(min + (index + 1) * width)}`,
    value: 0
  }));
  for (const value of values) {
    const index = Math.min(bucketCount - 1, Math.floor((value - min) / width));
    buckets[index].value += 1;
  }
  return {
    id: `histogram:${field}`,
    kind: 'histogram',
    title: `${titleize(field)} distribution`,
    description: `Spread across ${bucketCount} buckets.`,
    score: 48 + nameSignal(field),
    xField: field,
    data: buckets
  };
}

function topValues(grouped: Map<string, number>, limit: number): ChartDatum[] {
  return [...grouped.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, value]) => ({ label, value }));
}

function downsample<T>(values: T[], limit: number): T[] {
  if (values.length <= limit) return values;
  const step = Math.ceil(values.length / limit);
  return values.filter((_, index) => index % step === 0).slice(0, limit);
}

function pearson(pairs: { x: number; y: number }[]) {
  if (pairs.length < 3) return 0;
  const avgX = pairs.reduce((sum, point) => sum + point.x, 0) / pairs.length;
  const avgY = pairs.reduce((sum, point) => sum + point.y, 0) / pairs.length;
  let numerator = 0;
  let denomX = 0;
  let denomY = 0;
  for (const point of pairs) {
    const dx = point.x - avgX;
    const dy = point.y - avgY;
    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }
  return numerator / Math.sqrt(denomX * denomY || 1);
}

function nameSignal(name: string) {
  return /(revenue|amount|total|count|latency|duration|error|score|price|cost|sales|requests)/i.test(name) ? 10 : 0;
}
