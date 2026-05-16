import { detectSensitiveFields, isSensitiveFieldName } from './sensitive';
import type { FlatRow, InferredField, JsonPrimitive } from './types';

const identifierPattern = /(^id$|_id$|\.id$|uuid|guid|code|zip|postal|phone|mobile|sku|number$)/i;
const dateNamePattern = /(date|time|_at|\.at|created|updated|timestamp|period|month|day)/i;

export function inferFields(rows: FlatRow[]): InferredField[] {
  const fieldNames = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  const sensitiveFields = new Set(detectSensitiveFields(rows));

  return fieldNames.map((name) => {
    const values = rows.map((row) => row[name]).filter((value) => value !== null && value !== undefined);
    const sample = values.slice(0, 100);
    const uniqueCount = new Set(values.map(String)).size;
    const isIdentifierLike = identifierPattern.test(name);
    const kind = inferKind(name, sample, uniqueCount, isIdentifierLike);

    return {
      name,
      kind,
      samples: sample.slice(0, 5),
      uniqueCount,
      nullCount: rows.length - values.length,
      isSensitive: sensitiveFields.has(name) || isSensitiveFieldName(name),
      isIdentifierLike
    };
  });
}

export function parseNumberish(value: JsonPrimitive): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return null;
  const cleaned = value.trim().replace(/[$,%\s]/g, '').replace(/,/g, '');
  if (!cleaned || !/^[-+]?\d*\.?\d+$/.test(cleaned)) return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

export function parseDateish(value: JsonPrimitive): number | null {
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  const time = Date.parse(String(value));
  return Number.isFinite(time) ? time : null;
}

function inferKind(
  name: string,
  values: JsonPrimitive[],
  uniqueCount: number,
  isIdentifierLike: boolean
): InferredField['kind'] {
  if (values.length === 0) return 'string';

  const booleanish = values.every(
    (value) =>
      typeof value === 'boolean' ||
      value === 'true' ||
      value === 'false' ||
      value === '1' ||
      value === '0'
  );
  if (booleanish) return 'boolean';

  const dateRatio = values.filter((value) => parseDateish(value) !== null).length / values.length;
  if (dateRatio > 0.8 && (dateNamePattern.test(name) || typeof values[0] === 'string')) return 'datetime';

  const numberRatio = values.filter((value) => parseNumberish(value) !== null).length / values.length;
  if (numberRatio > 0.9 && !isIdentifierLike) return 'number';

  if (uniqueCount <= Math.min(50, Math.max(12, values.length * 0.35))) return 'categorical';
  return 'string';
}
