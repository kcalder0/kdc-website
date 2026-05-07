import Link from "next/link";
import { Lock } from "lucide-react";
import type { AppEntry } from "@/lib/data";

const STATUS_STYLES: Record<AppEntry["status"], string> = {
  Live: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "In Development": "bg-accent/10 text-accent ring-accent/30",
  Planned: "bg-surface text-muted ring-border",
};

function CardBody({ app }: { app: AppEntry }) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold leading-snug text-primary">{app.title}</h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${STATUS_STYLES[app.status]}`}
        >
          {app.status}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">{app.description}</p>
      {app.passwordProtectedRefresh && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-2">
          <Lock className="h-3 w-3" aria-hidden="true" />
          <span>Manual refresh password protected</span>
        </p>
      )}
      <div className="flex-1" />
      {app.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {app.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md bg-surface px-2 py-0.5 text-xs font-medium text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function AppCard({ app }: { app: AppEntry }) {
  const baseClasses = "flex h-full flex-col rounded-lg border border-border bg-background p-6 transition-all";

  if (app.status === "Planned") {
    return (
      <div className={`${baseClasses} opacity-70`}>
        <CardBody app={app} />
      </div>
    );
  }

  return (
    <Link
      href={app.href}
      className={`${baseClasses} hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-sm`}
    >
      <CardBody app={app} />
    </Link>
  );
}
