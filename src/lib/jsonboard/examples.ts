export const examples = {
  api: {
    label: 'API logs',
    value: JSON.stringify(
      Array.from({ length: 84 }, (_, index) => {
        const endpoints = ['/api/users', '/api/search', '/api/checkout', '/api/reports'];
        const status = index % 13 === 0 ? 500 : index % 7 === 0 ? 429 : index % 3 === 0 ? 404 : 200;
        return {
          timestamp: new Date(Date.UTC(2026, 4, 1 + (index % 14), index % 24)).toISOString(),
          endpoint: endpoints[index % endpoints.length],
          status,
          latency_ms: Math.round(80 + Math.random() * 260 + (status >= 500 ? 420 : 0)),
          cache_hit: index % 4 === 0,
          user: {
            plan: ['free', 'pro', 'team'][index % 3],
            email: `user${index}@example.com`
          },
          request_id: `req_${index.toString().padStart(4, '0')}`
        };
      }),
      null,
      2
    )
  },
  sales: {
    label: 'Sales',
    value: JSON.stringify(
      Array.from({ length: 72 }, (_, index) => ({
        month: `2026-${String((index % 12) + 1).padStart(2, '0')}-01`,
        region: ['North America', 'Europe', 'India', 'APAC'][index % 4],
        channel: ['self-serve', 'partner', 'enterprise'][index % 3],
        revenue: Math.round(1200 + (index % 12) * 180 + Math.random() * 900),
        customers: 8 + (index % 10),
        plan: ['Free', 'Pro', 'Team'][index % 3]
      })),
      null,
      2
    )
  },
  nested: {
    label: 'Nested',
    value: JSON.stringify(
      Array.from({ length: 36 }, (_, index) => ({
        id: `evt_${index}`,
        created_at: new Date(Date.UTC(2026, 3, index + 1)).toISOString(),
        account: {
          tier: ['startup', 'growth', 'enterprise'][index % 3],
          owner: { email: `owner${index}@company.dev` }
        },
        metrics: {
          active_users: 40 + index * 3,
          p95_latency: 120 + (index % 8) * 18,
          error_rate: Number((Math.random() * 2.5).toFixed(2))
        },
        tags: ['api', 'weekly', index % 2 ? 'paid' : 'free']
      })),
      null,
      2
    )
  }
} as const;
