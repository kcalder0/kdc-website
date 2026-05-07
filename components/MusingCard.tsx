import Link from "next/link";
import type { Musing } from "@/lib/data";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function MusingCard({ musing }: { musing: Musing }) {
  return (
    <Link
      // TODO: link to MDX post once posts are added
      href={`/research/musings#${musing.slug}`}
      className="group block rounded-lg border border-border bg-background p-6 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-sm"
    >
      <time dateTime={musing.date} className="text-xs uppercase tracking-wide text-muted">
        {formatDate(musing.date)}
      </time>
      <h3 className="mt-2 text-lg font-semibold leading-snug text-primary group-hover:text-accent transition-colors">
        {musing.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{musing.description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
        Read more
        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 6h6M6 3l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}
