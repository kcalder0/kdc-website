"use client";

import type { ComparisonLabel, TrendsByMaturity } from "./types";

const WINDOWS: ReadonlyArray<ComparisonLabel> = [
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

type TrendKey = keyof TrendsByMaturity;

type TrendColumn = {
  key: TrendKey;
  label: string;
  isSpread: boolean;
};

// Column order matches the StatsBar above so the eye traces each card
// down to its trend column. `isSpread` flips the color rule (a widening
// spread is good for shape, a rising rate is bond-bearish).
const COLUMNS: ReadonlyArray<TrendColumn> = [
  { key: "bc_3m", label: "3M T-Bill", isSpread: false },
  { key: "bc_2y", label: "2Y Note", isSpread: false },
  { key: "bc_10y", label: "10Y Note", isSpread: false },
  { key: "bc_30y", label: "30Y Bond", isSpread: false },
  { key: "spread_2s10s", label: "2s10s Sprd", isSpread: true },
];

const ZERO_BP_THRESHOLD = 0.05;

function formatBp(v: number | null | undefined): string {
  if (v == null) return "—";
  const bp = v * 100;
  if (Math.abs(bp) < ZERO_BP_THRESHOLD) return "0.0bp";
  const sign = bp > 0 ? "+" : "";
  return `${sign}${bp.toFixed(1)}bp`;
}

function colorClass(v: number | null | undefined, isSpread: boolean): string {
  if (v == null) return "text-gray-600";
  const bp = v * 100;
  if (Math.abs(bp) < ZERO_BP_THRESHOLD) return "text-gray-400";
  if (isSpread) return bp > 0 ? "text-emerald-400" : "text-rose-400";
  return bp > 0 ? "text-rose-400" : "text-emerald-400";
}

function Cell({
  value,
  isSpread,
}: {
  value: number | null | undefined;
  isSpread: boolean;
}) {
  return (
    <span className={`font-mono ${colorClass(value, isSpread)}`}>
      {formatBp(value)}
    </span>
  );
}

export default function TrendsTable({
  trends,
}: {
  trends: TrendsByMaturity | null;
}) {
  if (!trends) return null;
  return (
    <div className="rounded-lg bg-ust-panel p-3">
      <div className="mb-2 text-[10px] uppercase tracking-wide text-gray-500">
        Rate Changes
      </div>

      <div className="mb-1 flex items-center px-1">
        <span className="w-7 shrink-0" />
        <div className="grid flex-1 grid-cols-5 gap-2 text-right text-[11px] text-gray-500">
          {COLUMNS.map((col) => (
            <span key={col.key}>{col.label}</span>
          ))}
        </div>
      </div>

      {WINDOWS.map((w, i) => {
        const stripe = i % 2 === 0 ? "bg-ust-panel-2" : "";
        return (
          <div
            key={w}
            className={`flex items-center rounded px-1 py-1 ${stripe}`}
          >
            <span className="w-7 shrink-0 text-[11px] text-gray-500">{w}</span>
            <div className="grid flex-1 grid-cols-5 gap-2 text-right text-xs">
              {COLUMNS.map((col) => (
                <Cell
                  key={col.key}
                  value={trends[col.key]?.[w] ?? null}
                  isSpread={col.isSpread}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
