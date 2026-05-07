import type { Metadata } from "next";
import Link from "next/link";
import { publications, notes } from "@/lib/data";

export const metadata: Metadata = {
  title: "Research",
  description: "Publications and informal research notes by Kyle Calder.",
};

const SECTIONS = [
  {
    href: "/research/publications",
    label: "Publications",
    description:
      "Working papers, peer-reviewed articles, and technical reports. Most include abstracts, PDFs, and DOIs.",
    counter: () => publications.length,
    counterLabel: "papers",
  },
  {
    href: "/research/notes",
    label: "Notes",
    description:
      "Shorter, less formal notes — open questions, reading reactions, and occasional opinions on finance and methods.",
    counter: () => notes.length,
    counterLabel: "posts",
  },
];

export default function ResearchPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16 md:py-20">
      <header className="mb-12">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
          Research
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
          Two flavors: formal, and otherwise.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          The papers below cover empirical work in finance and machine learning.
          The notes are where ideas go before — and sometimes instead of —
          becoming papers.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group flex flex-col rounded-lg border border-border bg-background p-6 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-semibold text-primary group-hover:text-accent transition-colors">
                {section.label}
              </h2>
              <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-muted">
                {section.counter()} {section.counterLabel}
              </span>
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
              {section.description}
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent">
              Browse
              <svg
                className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 6h6M6 3l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
