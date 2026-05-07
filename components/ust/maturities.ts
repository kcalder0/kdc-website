import type { ComparisonLabel, MaturityKey } from "./types";

// Display order + canonical labels for the chart x-axis. The keys must
// match the column names produced by the backend's MATURITIES list.
export const MATURITY_ORDER: ReadonlyArray<{
  key: MaturityKey;
  label: string;
}> = [
  { key: "bc_1m", label: "1M" },
  { key: "bc_2m", label: "2M" },
  { key: "bc_3m", label: "3M" },
  { key: "bc_6m", label: "6M" },
  { key: "bc_1y", label: "1Y" },
  { key: "bc_2y", label: "2Y" },
  { key: "bc_3y", label: "3Y" },
  { key: "bc_5y", label: "5Y" },
  { key: "bc_7y", label: "7Y" },
  { key: "bc_10y", label: "10Y" },
  { key: "bc_20y", label: "20Y" },
  { key: "bc_30y", label: "30Y" },
];

export const COMPARISON_LABELS: ReadonlyArray<ComparisonLabel> = [
  "1D",
  "1W",
  "1M",
  "3M",
  "6M",
  "1Y",
  "2Y",
  "3Y",
  "5Y",
];

export const COMPARISON_COLORS: Record<ComparisonLabel, string> = {
  "1D": "#666666",
  "1W": "#888888",
  "1M": "#4CAF50",
  "3M": "#FF9800",
  "6M": "#E91E63",
  "1Y": "#9C27B0",
  "2Y": "#FF5722",
  "3Y": "#795548",
  "5Y": "#00BCD4",
};

// Site accent — the "Selected" curve is the primary highlight.
export const SELECTED_COLOR = "#ed8a63";
