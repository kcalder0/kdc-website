"use client";

import { useCallback, useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  COMPARISON_COLORS,
  COMPARISON_LABELS,
  MATURITY_ORDER,
  SELECTED_COLOR,
} from "./maturities";
import type {
  ComparisonLabel,
  Comparisons,
  CurveSnapshot,
  MaturityKey,
} from "./types";

const formatPct = (v: number | null | undefined) =>
  v == null ? "—" : `${v.toFixed(2)}%`;

type ChartRow = { maturity: string } & Partial<
  Record<"selected" | ComparisonLabel, number | null>
>;

function buildChartData(
  selected: CurveSnapshot | null,
  comparisons: Comparisons,
): ChartRow[] {
  return MATURITY_ORDER.map(({ key, label }) => {
    const point: ChartRow = { maturity: label };
    if (selected) {
      point.selected = (selected.curve?.[key as MaturityKey] ?? null) as
        | number
        | null;
    }
    for (const compLabel of COMPARISON_LABELS) {
      const comp = comparisons?.[compLabel];
      point[compLabel] = comp
        ? ((comp.curve?.[key as MaturityKey] ?? null) as number | null)
        : null;
    }
    return point;
  });
}

function computeYDomain(
  data: ChartRow[],
  activeKeys: ReadonlyArray<"selected" | ComparisonLabel>,
): [number, number] {
  const values: number[] = [];
  for (const row of data) {
    for (const k of activeKeys) {
      const v = row[k];
      if (typeof v === "number") values.push(v);
    }
  }
  if (values.length === 0) return [0, 5];
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const pad = Math.max((hi - lo) * 0.15, 0.25);
  return [Math.max(0, lo - pad), hi + pad];
}

type TooltipPayloadEntry = {
  dataKey?: string | number;
  value?: number | string | null;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
  selectedDate?: string | null;
  comparisons?: Comparisons;
  visible: Record<ComparisonLabel, boolean>;
};

function CustomTooltip({
  active,
  payload,
  label,
  selectedDate,
  comparisons,
  visible,
}: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const order: ReadonlyArray<"selected" | ComparisonLabel> = [
    "selected",
    ...COMPARISON_LABELS,
  ];
  const byKey = new Map<string | number, TooltipPayloadEntry>(
    payload.map((p) => [p.dataKey ?? "", p]),
  );
  return (
    <div className="rounded border border-white/10 bg-ust-bg/95 p-3 text-xs shadow-lg">
      <div className="mb-1 font-semibold text-white">{label}</div>
      {order.map((key) => {
        if (key !== "selected" && !visible[key]) return null;
        const p = byKey.get(key);
        if (!p) return null;
        const isSelected = key === "selected";
        const dateLabel = isSelected ? selectedDate : comparisons?.[key]?.date;
        const color = isSelected
          ? SELECTED_COLOR
          : COMPARISON_COLORS[key as ComparisonLabel];
        const tag = isSelected ? "Selected" : key;
        const numericValue =
          typeof p.value === "number"
            ? p.value
            : p.value == null
              ? null
              : Number(p.value);
        return (
          <div key={key} className="flex items-center gap-2 py-0.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-gray-300">{tag}</span>
            <span className="text-gray-500">{dateLabel || ""}</span>
            <span className="ml-auto font-mono text-white">
              {formatPct(numericValue)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

type LegendChipsProps = {
  selectedDate?: string | null;
  comparisons?: Comparisons;
  visible: Record<ComparisonLabel, boolean>;
  onToggle: (label: ComparisonLabel) => void;
  onShowAll: () => void;
  onHideAll: () => void;
};

function LegendChips({
  selectedDate,
  comparisons,
  visible,
  onToggle,
  onShowAll,
  onHideAll,
}: LegendChipsProps) {
  type ChipItem = {
    key: "selected" | ComparisonLabel;
    label: string;
    color: string;
    toggleable: boolean;
  };
  const items: ChipItem[] = [
    {
      key: "selected",
      label: `Selected — ${selectedDate || "—"}`,
      color: SELECTED_COLOR,
      toggleable: false,
    },
    ...COMPARISON_LABELS.filter((l) => comparisons?.[l]).map((l) => ({
      key: l,
      label: `${l} ago — ${comparisons?.[l]?.date ?? ""}`,
      color: COMPARISON_COLORS[l],
      toggleable: true,
    })),
  ];

  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
      {items.map((it) => {
        const on =
          it.toggleable && it.key !== "selected"
            ? !!visible[it.key as ComparisonLabel]
            : true;
        const interactive = it.toggleable;
        return (
          <button
            key={it.key}
            type="button"
            onClick={
              interactive && it.key !== "selected"
                ? () => onToggle(it.key as ComparisonLabel)
                : undefined
            }
            disabled={!interactive}
            className={[
              "flex items-center gap-1.5 rounded px-2 py-1 transition",
              interactive
                ? "cursor-pointer hover:bg-white/5"
                : "cursor-default",
              on ? "text-gray-200" : "text-gray-500",
            ].join(" ")}
            aria-pressed={on}
            title={interactive ? (on ? "Click to hide" : "Click to show") : ""}
          >
            <span
              className="inline-block h-2 w-3 rounded-sm"
              style={{
                backgroundColor: on ? it.color : "transparent",
                outline: `1.5px solid ${it.color}`,
              }}
            />
            <span className={on ? "" : "line-through decoration-gray-600"}>
              {it.label}
            </span>
          </button>
        );
      })}
      {items.length > 1 && (
        <div className="ml-auto flex gap-1">
          <button
            type="button"
            onClick={onShowAll}
            className="rounded px-2 py-1 text-gray-400 hover:bg-white/5 hover:text-gray-200"
          >
            Show all
          </button>
          <button
            type="button"
            onClick={onHideAll}
            className="rounded px-2 py-1 text-gray-400 hover:bg-white/5 hover:text-gray-200"
          >
            Hide all
          </button>
        </div>
      )}
    </div>
  );
}

type Props = {
  selected: CurveSnapshot | null;
  comparisons: Comparisons;
};

export default function YieldCurveChart({ selected, comparisons }: Props) {
  // Default: every available comparison series is on. Toggling one off
  // hides its line, drops it from the tooltip, and rescales the y-axis.
  const [hidden, setHidden] = useState<Set<ComparisonLabel>>(
    () => new Set<ComparisonLabel>(),
  );

  const data = useMemo(
    () => buildChartData(selected, comparisons),
    [selected, comparisons],
  );

  const visible = useMemo(() => {
    const out = {} as Record<ComparisonLabel, boolean>;
    for (const l of COMPARISON_LABELS) {
      out[l] = !!comparisons?.[l] && !hidden.has(l);
    }
    return out;
  }, [comparisons, hidden]);

  const activeKeys = useMemo<
    ReadonlyArray<"selected" | ComparisonLabel>
  >(() => {
    const keys: Array<"selected" | ComparisonLabel> = ["selected"];
    for (const l of COMPARISON_LABELS) if (visible[l]) keys.push(l);
    return keys;
  }, [visible]);

  const yDomain = useMemo(
    () => computeYDomain(data, activeKeys),
    [data, activeKeys],
  );

  const handleToggle = useCallback((label: ComparisonLabel) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }, []);

  const handleShowAll = useCallback(
    () => setHidden(new Set<ComparisonLabel>()),
    [],
  );
  const handleHideAll = useCallback(
    () => setHidden(new Set<ComparisonLabel>(COMPARISON_LABELS)),
    [],
  );

  return (
    <div className="rounded-lg bg-ust-panel p-4">
      <div className="h-[440px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 16, right: 24, left: 8, bottom: 8 }}
          >
            <CartesianGrid stroke="#2a2f3a" strokeDasharray="3 3" />
            <XAxis
              dataKey="maturity"
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
              domain={yDomain}
              tickFormatter={(v: number) => `${v.toFixed(2)}%`}
              width={60}
            />
            <Tooltip
              content={
                <CustomTooltip
                  selectedDate={selected?.date}
                  comparisons={comparisons}
                  visible={visible}
                />
              }
            />
            <Legend
              verticalAlign="bottom"
              align="left"
              content={
                <LegendChips
                  selectedDate={selected?.date}
                  comparisons={comparisons}
                  visible={visible}
                  onToggle={handleToggle}
                  onShowAll={handleShowAll}
                  onHideAll={handleHideAll}
                />
              }
            />

            {COMPARISON_LABELS.map((label) => {
              if (!visible[label]) return null;
              const dashed = label === "1Y" || label === "5Y";
              return (
                <Line
                  key={label}
                  type="monotone"
                  dataKey={label}
                  stroke={COMPARISON_COLORS[label]}
                  strokeWidth={1.5}
                  strokeDasharray={dashed ? "5 3" : undefined}
                  dot={false}
                  connectNulls
                  isAnimationActive={false}
                />
              );
            })}

            <Line
              type="monotone"
              dataKey="selected"
              stroke={SELECTED_COLOR}
              strokeWidth={2.5}
              dot={{ r: 4, fill: SELECTED_COLOR }}
              activeDot={{ r: 6 }}
              connectNulls
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
