"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchCurve,
  fetchDates,
  fetchLatestDate,
  postRefreshWithPassword,
} from "./api";
import DateSelector from "./DateSelector";
import MarketCommentary from "./MarketCommentary";
import RefreshModal from "./RefreshModal";
import SimilarDates from "./SimilarDates";
import StatsBar from "./StatsBar";
import TrendsTable from "./TrendsTable";
import YieldCurveChart from "./YieldCurveChart";
import type { CurveResponse, ToastState } from "./types";

const TOAST_DURATION_MS = 3000;

function Spinner() {
  return (
    <svg
      className="h-3.5 w-3.5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        opacity="0.25"
      />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      className="h-3 w-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function Toast({
  toast,
  onDone,
}: {
  toast: ToastState;
  onDone: () => void;
}) {
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(onDone, TOAST_DURATION_MS);
    return () => window.clearTimeout(t);
  }, [toast, onDone]);
  if (!toast) return null;
  const colorClass =
    toast.type === "error"
      ? "border-rose-500/40 bg-rose-500/15 text-rose-200"
      : "border-emerald-500/40 bg-emerald-500/15 text-emerald-200";
  return (
    <div
      role="status"
      className={`fixed bottom-4 right-4 z-50 rounded border px-3 py-2 text-xs shadow-lg ${colorClass}`}
    >
      {toast.message}
    </div>
  );
}

export default function UstApp() {
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [curveData, setCurveData] = useState<CurveResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  // Bump on successful manual refresh so child effects re-fire even when
  // the selected date hasn't changed.
  const [refreshTick, setRefreshTick] = useState(0);
  const [toast, setToast] = useState<ToastState>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // On mount: fetch the date index + latest date, then the curve for that date.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [datesResp, latestResp] = await Promise.all([
          fetchDates(),
          fetchLatestDate(),
        ]);
        if (cancelled) return;
        const list = datesResp?.dates ?? [];
        setDates(list);
        const initial = latestResp?.date || list[list.length - 1] || null;
        setSelectedDate(initial);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch the curve whenever the selected date changes or after a manual refresh.
  useEffect(() => {
    if (!selectedDate) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const data = await fetchCurve(selectedDate);
        if (!cancelled) setCurveData(data);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load curve.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedDate, refreshTick]);

  const handleSelect = useCallback((d: string) => setSelectedDate(d), []);
  const dismissToast = useCallback(() => setToast(null), []);

  const handleRefreshSubmit = useCallback(
    async (password: string) => {
      if (refreshing) return;
      setRefreshing(true);
      try {
        const result = await postRefreshWithPassword(password);
        // Pull a fresh dates list — the refresh may have added today's row.
        try {
          const datesResp = await fetchDates();
          const list = datesResp?.dates ?? [];
          setDates(list);
          if (list.length > 0) {
            const latest = list[list.length - 1];
            // If the user had the previous "today" pinned, hop them forward.
            setSelectedDate((prev) =>
              !prev || prev <= latest ? latest : prev,
            );
          }
        } catch {
          // Non-fatal — the curve refresh below still runs via refreshTick.
        }
        setRefreshTick((x) => x + 1);
        const added = result?.rows_added ?? 0;
        setToast({
          type: "success",
          message:
            added > 0
              ? `Data updated — ${added} row${added === 1 ? "" : "s"}`
              : "Data updated",
        });
        setModalOpen(false);
      } catch (e) {
        // Re-throw so the modal can display the error inline.
        throw e;
      } finally {
        setRefreshing(false);
      }
    },
    [refreshing],
  );

  const selected = curveData?.selected ?? null;
  const comparisons = curveData?.comparisons ?? {};
  const trends = curveData?.trends ?? null;

  return (
    <div className="rounded-xl bg-ust-bg text-gray-100 ring-1 ring-white/5">
      <div className="space-y-4 px-4 py-6 sm:px-6">
        <header className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-white">
            US Treasury Yield Curve
          </h2>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            disabled={refreshing}
            aria-busy={refreshing}
            className="flex items-center gap-2 rounded bg-accent/15 px-3 py-1.5 text-xs text-accent ring-1 ring-accent/30 transition hover:bg-accent/25 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing ? <Spinner /> : <LockIcon />}
            <span>{refreshing ? "Refreshing…" : "Refresh data"}</span>
          </button>
        </header>

        <DateSelector
          dates={dates}
          value={selectedDate}
          onChange={handleSelect}
        />

        {error && (
          <div className="rounded border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        <div className="relative">
          <YieldCurveChart selected={selected} comparisons={comparisons} />
          {loading && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="rounded bg-black/40 px-3 py-1 text-xs text-gray-200">
                Loading…
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <StatsBar curve={selected?.curve} />
          <TrendsTable trends={trends} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <SimilarDates targetDate={selectedDate} onDateSelect={handleSelect} />
          <MarketCommentary date={selectedDate} refreshTick={refreshTick} />
        </div>
      </div>

      <RefreshModal
        open={modalOpen}
        onClose={() => {
          if (!refreshing) setModalOpen(false);
        }}
        onSubmit={handleRefreshSubmit}
      />

      <Toast toast={toast} onDone={dismissToast} />
    </div>
  );
}
