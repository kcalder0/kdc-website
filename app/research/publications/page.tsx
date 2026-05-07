import type { Metadata } from "next";
import PublicationCard from "@/components/PublicationCard";
import { publications } from "@/lib/data";

export const metadata: Metadata = {
  title: "Publications",
  description: "Peer-reviewed papers, working papers, and technical reports.",
};

export default function PublicationsPage() {
  const sorted = [...publications].sort((a, b) => b.year - a.year);

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16 md:py-20">
      <header className="mb-10">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
          Research
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
          Publications
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          Peer-reviewed articles and working papers. Click a title to expand the
          abstract; PDF and DOI links are at the bottom of each entry.
        </p>
      </header>

      <ul className="space-y-5">
        {sorted.map((pub) => (
          <li key={pub.title}>
            <PublicationCard publication={pub} />
          </li>
        ))}
      </ul>
    </div>
  );
}
