import { describe, expect, it } from 'vitest';
import { buildDashboard } from './dashboard';

describe('JSONBoard dashboard engine', () => {
  it('wraps a single object and flattens nested fields', () => {
    const dashboard = buildDashboard(
      JSON.stringify({
        id: 'evt_1',
        user: { plan: 'pro', email: 'person@example.com' },
        metrics: { latency_ms: 240 }
      })
    );

    expect(dashboard.rows).toHaveLength(1);
    expect(dashboard.rows[0]['user.plan']).toBe('pro');
    expect(dashboard.fields.find((field) => field.name === 'metrics.latency_ms')?.kind).toBe('number');
    expect(dashboard.sensitiveFields).toContain('user.email');
  });

  it('parses JSONL rows', () => {
    const dashboard = buildDashboard('{"status":200,"latency_ms":90}\n{"status":500,"latency_ms":410}');

    expect(dashboard.rows).toHaveLength(2);
    expect(dashboard.warnings).toContain('Parsed JSONL locally.');
  });

  it('does not treat ids and codes as measures', () => {
    const dashboard = buildDashboard(
      JSON.stringify([
        { user_id: 1001, zip_code: '94107', revenue: 120 },
        { user_id: 1002, zip_code: '10001', revenue: 180 }
      ])
    );

    expect(dashboard.fields.find((field) => field.name === 'user_id')?.kind).not.toBe('number');
    expect(dashboard.fields.find((field) => field.name === 'zip_code')?.kind).not.toBe('number');
    expect(dashboard.fields.find((field) => field.name === 'revenue')?.kind).toBe('number');
  });

  it('generates useful chart recommendations for category and numeric data', () => {
    const dashboard = buildDashboard(
      JSON.stringify([
        { region: 'India', revenue: 1200, created_at: '2026-05-01' },
        { region: 'India', revenue: 1400, created_at: '2026-05-02' },
        { region: 'Europe', revenue: 900, created_at: '2026-05-01' },
        { region: 'US', revenue: 1800, created_at: '2026-05-03' }
      ])
    );

    expect(dashboard.charts.some((chart) => chart.kind === 'bar')).toBe(true);
    expect(dashboard.charts.some((chart) => chart.kind === 'line')).toBe(true);
  });
});
