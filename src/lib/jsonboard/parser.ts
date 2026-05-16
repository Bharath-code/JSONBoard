import type { FlatRow, JsonPrimitive, JsonValue } from './types';

export function parseInput(input: string): { value: JsonValue[]; warnings: string[] } {
  const trimmed = input.trim();
  if (!trimmed) throw new Error('Paste a JSON array, a single JSON object, or JSONL rows.');

  if (looksLikeJsonl(trimmed)) {
    const rows = trimmed
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line, index) => {
        try {
          return JSON.parse(line) as JsonValue;
        } catch {
          throw new Error(`JSONL line ${index + 1} is not valid JSON.`);
        }
      });
    return normalizeRows(rows, ['Parsed JSONL locally.']);
  }

  try {
    return normalizeRows(JSON.parse(trimmed) as JsonValue, []);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown parse error';
    throw new Error(`Invalid JSON: ${message}`);
  }
}

export function flattenRows(values: JsonValue[]): FlatRow[] {
  return values.map((value) => flattenValue(value));
}

function normalizeRows(value: JsonValue | JsonValue[], warnings: string[]) {
  if (Array.isArray(value)) return { value, warnings };
  if (value && typeof value === 'object') {
    return { value: [value], warnings: [...warnings, 'Single object wrapped into one dashboard row.'] };
  }
  throw new Error('Top-level JSON must be an object, an array of objects, or JSONL objects.');
}

function looksLikeJsonl(value: string) {
  const lines = value.split(/\r?\n/).filter(Boolean);
  return lines.length > 1 && lines.every((line) => line.trim().startsWith('{'));
}

function flattenValue(value: JsonValue, prefix = '', depth = 0): FlatRow {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { value: toPrimitive(value) };
  }

  const row: FlatRow = {};
  for (const [key, nested] of Object.entries(value)) {
    const nextKey = prefix ? `${prefix}.${key}` : key;
    if (nested && typeof nested === 'object' && !Array.isArray(nested) && depth < 3) {
      Object.assign(row, flattenValue(nested, nextKey, depth + 1));
    } else {
      row[nextKey] = toPrimitive(nested);
    }
  }
  return row;
}

function toPrimitive(value: JsonValue): JsonPrimitive {
  if (value === undefined || value === null) return null;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
  return JSON.stringify(value);
}
