"use client";

import { useState } from "react";
import type { Publication } from "@/lib/data";

export default function PublicationCard({ publication }: { publication: Publication }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="group rounded-lg border border-border bg-background p-6 transition-colors hover:border-accent/40">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <h3 className="text-lg font-semibold leading-snug text-primary">
          {publication.title}
        </h3>
        <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-muted">
          {publication.year}
        </span>
      </header>

      <p className="mt-2 text-sm text-muted">
        {publication.authors.join(", ")}
      </p>
      <p className="mt-1 text-sm italic text-muted-2">{publication.venue}</p>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
        aria-expanded={open}
      >
        <svg
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 4.5L6 7.5L9 4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {open ? "Hide abstract" : "Read abstract"}
      </button>

      {open && (
        <p className="mt-3 border-l-2 border-accent/40 pl-4 text-sm leading-relaxed text-foreground/80">
          {publication.abstract}
        </p>
      )}

      {(publication.pdfUrl || publication.doiUrl) && (
        <div className="mt-5 flex flex-wrap gap-3 border-t border-border pt-4 text-sm">
          {publication.pdfUrl && (
            <a
              href={publication.pdfUrl}
              className="rounded-md border border-border px-3 py-1.5 font-medium text-primary transition-colors hover:border-accent hover:text-accent"
              target="_blank"
              rel="noopener noreferrer"
            >
              PDF
            </a>
          )}
          {publication.doiUrl && (
            <a
              href={publication.doiUrl}
              className="rounded-md border border-border px-3 py-1.5 font-medium text-primary transition-colors hover:border-accent hover:text-accent"
              target="_blank"
              rel="noopener noreferrer"
            >
              DOI
            </a>
          )}
        </div>
      )}
    </article>
  );
}
