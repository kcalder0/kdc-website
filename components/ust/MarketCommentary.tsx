"use client";

import { useEffect, useState } from "react";
import { fetchNews } from "./api";
import type { NewsItem } from "./types";

const LOOKBACKS = ["day", "week", "month"] as const;
type Lookback = (typeof LOOKBACKS)[number];

const TAG_COLORS = {
  fed: "bg-blue-500/15 text-blue-300 ring-blue-500/30",
  inflation: "bg-orange-500/15 text-orange-300 ring-orange-500/30",
  treasuries: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  spreads: "bg-purple-500/15 text-purple-300 ring-purple-500/30",
} as const;

const DEFAULT_TAG = "bg-white/5 text-gray-300 ring-white/10";

// Sonar emits granular tags (e.g. "fed-policy", "fomc", "credit-spreads",
// "inflation-expectations") rather than exact matches to our color keys,
// so we match by substring against the canonical category names.
const TAG_MATCHERS: ReadonlyArray<{ keys: string[]; color: string }> = [
  { keys: ["fed", "fomc", "rate"], color: TAG_COLORS.fed },
  {
    keys: ["inflation", "cpi", "pce", "ppi", "breakeven"],
    color: TAG_COLORS.inflation,
  },
  {
    keys: ["treasur", "auction", "issuance", "yield"],
    color: TAG_COLORS.treasuries,
  },
  { keys: ["spread", "credit"], color: TAG_COLORS.spreads },
];

function tagClass(tag: string): string {
  const lower = tag.toLowerCase().trim();
  if (lower in TAG_COLORS) return TAG_COLORS[lower as keyof typeof TAG_COLORS];
  for (const m of TAG_MATCHERS) {
    if (m.keys.some((k) => lower.includes(k))) return m.color;
  }
  return DEFAULT_TAG;
}

function Skeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded border border-white/5 bg-ust-bg p-3"
        >
          <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
          <div className="mt-2 h-3 w-full animate-pulse rounded bg-white/5" />
          <div className="mt-1 h-3 w-5/6 animate-pulse rounded bg-white/5" />
        </div>
      ))}
    </div>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  const tags = Array.isArray(item.relevance_tags) ? item.relevance_tags : [];
  return (
    <div className="rounded border border-white/5 bg-ust-bg p-3">
      <div className="flex items-start justify-between gap-2">
        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-gray-100 hover:text-accent"
          >
            {item.title || item.url}
          </a>
        ) : (
          <div className="text-sm font-semibold text-gray-100">
            {item.title || "(untitled)"}
          </div>
        )}
        {item.published_at && (
          <span className="shrink-0 text-[10px] uppercase tracking-wide text-gray-500">
            {item.published_at}
          </span>
        )}
      </div>
      {item.summary && (
        <p className="mt-1.5 text-xs leading-relaxed text-gray-400">
          {item.summary}
        </p>
      )}
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {tags.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className={`rounded-full px-2 py-0.5 text-[10px] ring-1 ${tagClass(t)}`}
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

type Props = {
  date: string | null;
  refreshTick?: number;
};

export default function MarketCommentary({ date, refreshTick = 0 }: Props) {
  const [lookback, setLookback] = useState<Lookback>("week");
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cached, setCached] = useState(false);

  useEffect(() => {
    if (!date) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const data = await fetchNews(date, lookback);
        if (cancelled) return;
        setItems(Array.isArray(data?.items) ? data.items : []);
        setCached(!!data?.cached);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to fetch news.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [date, lookback, refreshTick]);

  return (
    <div className="rounded-lg bg-ust-panel p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-gray-200">
          Market news
          {cached && (
            <span className="ml-2 text-[10px] font-normal uppercase text-gray-500">
              cached
            </span>
          )}
        </h3>
        <div className="flex gap-1 rounded bg-white/5 p-0.5 text-xs">
          {LOOKBACKS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setLookback(opt)}
              className={[
                "rounded px-2 py-0.5 capitalize transition",
                lookback === opt
                  ? "bg-accent/20 text-accent"
                  : "text-gray-400 hover:text-gray-200",
              ].join(" ")}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[480px] space-y-2 overflow-y-auto pr-1">
        {loading && <Skeleton />}
        {!loading && error && (
          <div className="rounded border border-rose-500/30 bg-rose-500/5 p-3 text-xs text-rose-300">
            {error}
          </div>
        )}
        {!loading && !error && items.length === 0 && (
          <div className="rounded border border-white/5 bg-ust-bg p-4 text-center text-xs text-gray-500">
            No news available.
          </div>
        )}
        {!loading &&
          !error &&
          items.map((item, i) => <NewsCard key={i} item={item} />)}
      </div>
    </div>
  );
}
