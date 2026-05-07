"use client";

import { useCallback, useEffect, useMemo } from "react";

type Props = {
  dates: string[];
  value: string | null;
  onChange: (date: string) => void;
};

// `dates` is the sorted-ascending list returned from `/api/dates`.
// `value` is the currently selected date (YYYY-MM-DD).
export default function DateSelector({ dates, value, onChange }: Props) {
  const indexByDate = useMemo(() => {
    const m = new Map<string, number>();
    dates.forEach((d, i) => m.set(d, i));
    return m;
  }, [dates]);

  const currentIdx =
    value != null && indexByDate.has(value)
      ? (indexByDate.get(value) as number)
      : -1;

  const goPrev = useCallback(() => {
    if (currentIdx > 0) onChange(dates[currentIdx - 1]);
  }, [currentIdx, dates, onChange]);

  const goNext = useCallback(() => {
    if (currentIdx >= 0 && currentIdx < dates.length - 1) {
      onChange(dates[currentIdx + 1]);
    }
  }, [currentIdx, dates, onChange]);

  const goLatest = useCallback(() => {
    if (dates.length > 0) onChange(dates[dates.length - 1]);
  }, [dates, onChange]);

  // Snap free-form date input to the nearest available trading date.
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target.value;
    if (!target) return;
    if (indexByDate.has(target)) {
      onChange(target);
      return;
    }
    let best: string | undefined = dates[0];
    let bestDiff = Infinity;
    const t = new Date(target).getTime();
    for (const d of dates) {
      const diff = Math.abs(new Date(d).getTime() - t);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = d;
      }
    }
    if (best) onChange(best);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT") return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  const minDate = dates[0];
  const maxDate = dates[dates.length - 1];

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg bg-ust-panel p-3">
      <button
        onClick={goPrev}
        disabled={currentIdx <= 0}
        className="rounded bg-white/5 px-3 py-1.5 text-sm text-gray-200 hover:bg-white/10 disabled:opacity-30"
        aria-label="Previous trading day"
      >
        ←
      </button>
      <input
        type="date"
        value={value || ""}
        min={minDate}
        max={maxDate}
        onChange={handleInput}
        className="rounded bg-white/5 px-3 py-1.5 text-sm text-gray-100 outline-none focus:ring-2 focus:ring-accent"
      />
      <button
        onClick={goNext}
        disabled={currentIdx < 0 || currentIdx >= dates.length - 1}
        className="rounded bg-white/5 px-3 py-1.5 text-sm text-gray-200 hover:bg-white/10 disabled:opacity-30"
        aria-label="Next trading day"
      >
        →
      </button>
      <button
        onClick={goLatest}
        className="rounded bg-accent/20 px-3 py-1.5 text-sm text-accent hover:bg-accent/30"
      >
        Today
      </button>
      <span className="ml-auto text-xs text-gray-500">
        {dates.length > 0 && `${dates.length.toLocaleString()} trading days`}
      </span>
    </div>
  );
}
