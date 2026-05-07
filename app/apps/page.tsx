import type { Metadata } from "next";
import AppCard from "@/components/AppCard";
import { apps } from "@/lib/data";

export const metadata: Metadata = {
  title: "Apps",
  description: "Small interactive tools and visualizations by Kyle Calder.",
};

export default function AppsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16 md:py-20">
      <header className="mb-10">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
          Apps
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
          Tools and visualizations
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          Small applications I&apos;ve built — mostly to think through a
          research question, occasionally just because the data was interesting.
          More on the way.
        </p>
      </header>

      <ul className="grid gap-5 sm:grid-cols-2">
        {apps.map((app, i) => (
          <li key={`${app.title}-${i}`}>
            <AppCard app={app} />
          </li>
        ))}
      </ul>
    </div>
  );
}
