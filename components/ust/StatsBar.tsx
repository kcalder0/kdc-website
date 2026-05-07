"use client";

import type { CurvePoint } from "./types";

const formatPct = (v: number | null | undefined) =>
  v == null ? "—" : `${v.toFixed(2)}%`;
const formatBp = (v: number | null | undefined) =>
  v == null ? "—" : `${v >= 0 ? "+" : ""}${(v * 100).toFixed(0)} bp`;

function Stat({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex flex-col rounded bg-white/5 px-4 py-2">
      <span className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <span className={`mt-1 font-mono text-lg ${valueClass}`}>{value}</span>
    </div>
  );
}

export default function StatsBar({ curve }: { curve?: CurvePoint }) {
  const c: CurvePoint = curve || {};
  const y3m = c.bc_3m;
  const y2 = c.bc_2y;
  const y10 = c.bc_10y;
  const y30 = c.bc_30y;
  const spread = y2 != null && y10 != null ? y10 - y2 : null;
  const spreadColor =
    spread == null
      ? "text-gray-300"
      : spread >= 0
        ? "text-emerald-400"
        : "text-rose-400";

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      <Stat label="3M" value={formatPct(y3m)} />
      <Stat label="2Y" value={formatPct(y2)} />
      <Stat label="10Y" value={formatPct(y10)} />
      <Stat label="30Y" value={formatPct(y30)} />
      <Stat label="2s10s" value={formatBp(spread)} valueClass={spreadColor} />
    </div>
  );
}
