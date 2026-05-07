import type { Metadata } from "next";
import MusingCard from "@/components/MusingCard";
import { musings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Musings",
  description: "Informal notes on finance, machine learning, and research practice.",
};

export default function MusingsPage() {
  const sorted = [...musings].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16 md:py-20">
      <header className="mb-10">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
          Research
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
          Musings
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          Shorter, informal pieces — open questions, methodological notes, and
          things that aren&apos;t papers (yet, or ever).
        </p>
      </header>

      <ul className="grid gap-5 sm:grid-cols-2">
        {sorted.map((m) => (
          <li key={m.slug} id={m.slug}>
            <MusingCard musing={m} />
          </li>
        ))}
      </ul>
    </div>
  );
}
