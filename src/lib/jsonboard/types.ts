export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export type FlatRow = Record<string, JsonPrimitive>;

export type FieldKind = 'number' | 'datetime' | 'boolean' | 'categorical' | 'string';

export type InferredField = {
  name: string;
  kind: FieldKind;
  samples: JsonPrimitive[];
  uniqueCount: number;
  nullCount: number;
  isSensitive: boolean;
  isIdentifierLike: boolean;
};

export type ChartKind = 'bar' | 'line' | 'scatter' | 'histogram' | 'breakdown';

export type ChartRecommendation = {
  id: string;
  kind: ChartKind;
  title: string;
  description: string;
  score: number;
  xField?: string;
  yField?: string;
  groupField?: string;
  data: ChartDatum[];
};

export type ChartDatum = {
  label: string;
  value: number;
  x?: number | string;
  y?: number;
};

export type DashboardModel = {
  rawInput: string;
  rows: FlatRow[];
  fields: InferredField[];
  charts: ChartRecommendation[];
  stats: DashboardStat[];
  warnings: string[];
  parseMs: number;
  sensitiveFields: string[];
};

export type DashboardStat = {
  label: string;
  value: string;
  detail: string;
};

export type SortState = {
  key: string;
  direction: 'asc' | 'desc';
} | null;
