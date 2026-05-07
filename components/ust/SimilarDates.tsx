"use client";

import { useEffect, useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
import { fetchSimilar } from "./api";
import { MATURITY_ORDER } from "./maturities";
import type { CurvePoint, MaturityKey, SimilarMatch } from "./types";

const ANNOTATION_FALLBACKS = new Set([
  "Historical context unavailable for this period.",
  "No description available — ANTHROPIC_API_KEY not configured.",
]);

function formatLong(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatRange(start?: string, end?: string): string {
  if (!start) return "";
  if (!end || start === end) return formatLong(start);
  return `${formatLong(start)} – ${formatLong(end)}`;
}

function Sparkline({ curve }: { curve?: CurvePoint }) {
  const data = useMemo(
    () =>
      MATURITY_ORDER.map(({ key, label }) => ({
        x: label,
        y: (curve?.[key as MaturityKey] ?? null) as number | null,
      })),
    [curve],
  );
  // Recharts doesn't render lines containing all-null data; guard against
  // sparse historical curves so the card still renders cleanly.
  const nonNull = data.filter((d) => typeof d.y === "number");
  if (nonNull.length < 2) {
    return (
      <div className="h-[60px] text-[10px] text-gray-600">
        (insufficient curve data)
      </div>
    );
  }
  return (
    <div className="h-[60px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 4, right: 4, left: 4, bottom: 4 }}
        >
          <YAxis hide domain={["auto", "auto"]} />
          <Line
            type="monotone"
            dataKey="y"
            stroke="#888"
            strokeWidth={1.25}
            dot={false}
            connectNulls
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function MatchCard({
  match,
  onPin,
}: {
  match: SimilarMatch;
  onPin: (date: string) => void;
}) {
  const dateRange = formatRange(match.bucket_start, match.bucket_end);
  const days = match.constituent_dates?.length ?? 0;
  const isAnnotationFallback =
    typeof match.annotation === "string" &&
    ANNOTATION_FALLBACKS.has(match.annotation.trim());
  const sim = typeof match.similarity === "number" ? match.similarity : 0;
  return (
    <div className="rounded border border-white/5 bg-ust-bg p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-semibold text-gray-100">{dateRange}</div>
          <div className="text-[10px] uppercase tracking-wide text-gray-500">
            {days} trading day{days === 1 ? "" : "s"}
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[11px] text-accent ring-1 ring-accent/30">
          {sim.toFixed(3)}
        </span>
      </div>

      {match.annotation ? (
        <p
          className={[
            "mt-1.5 text-xs italic leading-relaxed",
            isAnnotationFallback ? "text-gray-600" : "text-gray-400",
          ].join(" ")}
        >
          {match.annotation}
        </p>
      ) : null}

      <div className="mt-2">
        <Sparkline curve={match.curve} />
      </div>

      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={() => onPin(match.best_match_date)}
          className="rounded bg-white/5 px-2 py-1 text-[11px] text-gray-300 hover:bg-accent/20 hover:text-accent"
          title={`Jump main chart to ${match.best_match_date}`}
        >
          Pin to chart
        </button>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded border border-white/5 bg-ust-bg p-3">
      <div className="h-4 w-1/3 animate-pulse rounded bg-white/10" />
      <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-white/5" />
      <div className="mt-3 h-[60px] w-full animate-pulse rounded bg-white/5" />
    </div>
  );
}

type Props = {
  targetDate: string | null;
  onDateSelect: (date: string) => void;
};

export default function SimilarDates({ targetDate, onDateSelect }: Props) {
  const [matches, setMatches] = useState<SimilarMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!targetDate) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const data = await fetchSimilar(targetDate, 10);
        if (cancelled) return;
        setMatches(Array.isArray(data?.similar) ? data.similar : []);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to fetch matches.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [targetDate]);

  return (
    <div className="rounded-lg bg-ust-panel p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-200">
        Similar historical periods
      </h3>
      <div className="max-h-[640px] space-y-2 overflow-y-auto pr-1">
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
        {!loading && error && (
          <div className="rounded border border-rose-500/30 bg-rose-500/5 p-3 text-xs text-rose-300">
            {error}
          </div>
        )}
        {!loading && !error && matches.length === 0 && (
          <div className="rounded border border-white/5 bg-ust-bg p-4 text-center text-xs text-gray-500">
            No similar periods found.
          </div>
        )}
        {!loading &&
          !error &&
          matches.map((m) => (
            <MatchCard key={m.bucket_start} match={m} onPin={onDateSelect} />
          ))}
      </div>
    </div>
  );
}
