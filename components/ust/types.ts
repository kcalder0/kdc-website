// Shape of a single yield curve row keyed by maturity.
export type CurvePoint = {
  bc_1m?: number | null;
  bc_2m?: number | null;
  bc_3m?: number | null;
  bc_6m?: number | null;
  bc_1y?: number | null;
  bc_2y?: number | null;
  bc_3y?: number | null;
  bc_5y?: number | null;
  bc_7y?: number | null;
  bc_10y?: number | null;
  bc_20y?: number | null;
  bc_30y?: number | null;
};

export type MaturityKey = keyof CurvePoint;

export type CurveSnapshot = {
  date: string;
  curve: CurvePoint;
};

export type ComparisonLabel =
  | "1D"
  | "1W"
  | "1M"
  | "3M"
  | "6M"
  | "1Y"
  | "2Y"
  | "3Y"
  | "5Y";

export type Comparisons = Partial<Record<ComparisonLabel, CurveSnapshot>>;

export type TrendsByMaturity = Partial<
  Record<
    MaturityKey | "spread_2s10s",
    Partial<Record<ComparisonLabel, number | null>>
  >
>;

export type CurveResponse = {
  selected: CurveSnapshot | null;
  comparisons: Comparisons;
  trends: TrendsByMaturity | null;
};

export type DatesResponse = {
  dates: string[];
};

export type LatestDateResponse = {
  date: string | null;
};

export type RefreshResponse = {
  rows_added?: number;
};

export type SimilarMatch = {
  bucket_start: string;
  bucket_end: string;
  constituent_dates?: string[];
  similarity?: number;
  annotation?: string | null;
  curve?: CurvePoint;
  best_match_date: string;
};

export type SimilarResponse = {
  similar: SimilarMatch[];
};

export type NewsItem = {
  title?: string;
  url?: string;
  summary?: string;
  published_at?: string;
  relevance_tags?: string[];
};

export type NewsResponse = {
  items: NewsItem[];
  cached?: boolean;
};

export type ToastState = {
  type: "success" | "error";
  message: string;
} | null;
