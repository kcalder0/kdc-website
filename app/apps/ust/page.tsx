"use client";

// NOTE: Backend APScheduler should be configured for 6AM and 6PM ET daily refreshes
// This is set in treasury-yield-app/backend/scheduler.py (or equivalent) before Fly.io deployment

import Link from "next/link";
import UstApp from "@/components/ust/UstApp";

export default function UstAppPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16 md:py-20">
      <nav className="mb-8 text-sm text-muted">
        <Link href="/apps" className="transition-colors hover:text-accent">
          ← Back to Apps
        </Link>
      </nav>

      <header className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
            App
          </p>
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
            Live
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
          US Treasury Yield Curve Explorer
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          Time-travel through the par yield curve, compare any selected day
          against rolling lookbacks (1D / 1W / 1M / 3M / 6M / 1Y / 2Y / 3Y /
          5Y), surface historical periods with the most similar curve shape,
          and read a curated fixed-income news feed for the chosen date.
          Backend data refreshes automatically; the manual Refresh button is
          password protected.
        </p>
      </header>

      <UstApp />
    </div>
  );
}
