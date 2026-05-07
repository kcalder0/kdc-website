import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "UST Yield Curve Explorer",
  description:
    "Interactive visualization of the US Treasury par yield curve, with historical comparison and similar-period detection.",
};

export default function UstAppPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16 md:py-20">
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
          <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent ring-1 ring-accent/30">
            In Development
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
          US Treasury Yield Curve Explorer
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          {/* TODO: refine description as features land */}
          An interactive visualization of the US Treasury par yield curve — with
          time-travel through historical curves, similar-period detection
          based on shape distance, and a curated feed of fixed-income news
          aligned to the same dates.
        </p>
      </header>

      <div className="rounded-lg border border-dashed border-border bg-surface p-10 text-center">
        <h2 className="text-lg font-semibold text-primary">Coming soon</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
          The app is being built in a separate repo and will be embedded here
          once deployed. Until then, this page is a placeholder. Check back
          soon.
        </p>
      </div>

      <section className="mt-12">
        <h2 className="border-l-2 border-accent pl-3 text-base font-semibold text-primary">
          What it will include
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-foreground/85">
          <li className="flex gap-3">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
            Interactive par yield curve with daily granularity back to 1990.
          </li>
          <li className="flex gap-3">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
            Side-by-side historical comparison: pin two dates and overlay them.
          </li>
          <li className="flex gap-3">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
            Similar-period detection — find the historical dates where the
            curve most closely resembles the one selected today.
          </li>
          <li className="flex gap-3">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
            A fixed-income news panel for the selected date, when available.
          </li>
        </ul>
      </section>
    </div>
  );
}
