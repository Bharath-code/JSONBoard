import type { FlatRow, JsonPrimitive } from './types';

const sensitiveNamePattern =
  /(password|passwd|pwd|secret|token|api[_-]?key|access[_-]?key|auth|authorization|bearer|email|phone|mobile|ssn|session|cookie|private[_-]?key|client[_-]?secret)/i;

const sensitiveValuePatterns = [
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  /\b(?:sk|pk|rk|ghp|github_pat|xox[baprs])-?[A-Za-z0-9_./=-]{16,}\b/i,
  /\bBearer\s+[A-Za-z0-9_./=-]{12,}\b/i,
  /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/
];

export function isSensitiveFieldName(name: string) {
  return sensitiveNamePattern.test(name);
}

export function isSensitiveValue(value: JsonPrimitive) {
  if (typeof value !== 'string') return false;
  return sensitiveValuePatterns.some((pattern) => pattern.test(value)) || looksLikePhoneNumber(value);
}

export function detectSensitiveFields(rows: FlatRow[]) {
  const fields = new Set<string>();

  for (const row of rows.slice(0, 200)) {
    for (const [key, value] of Object.entries(row)) {
      if (isSensitiveFieldName(key) || isSensitiveValue(value)) fields.add(key);
    }
  }

  return [...fields];
}

export function redactRows(rows: FlatRow[], fields: string[]) {
  const redacted = new Set(fields);

  return rows.map((row) => {
    const next: FlatRow = {};
    for (const [key, value] of Object.entries(row)) {
      next[key] = redacted.has(key) || isSensitiveValue(value) ? '[redacted]' : value;
    }
    return next;
  });
}

function looksLikePhoneNumber(value: string) {
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return false;
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15 && /^[+()\d .-]+$/.test(value);
}
