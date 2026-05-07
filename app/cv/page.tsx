import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV",
  description: "Curriculum vitae for Kyle Calder.",
};

// TODO: drop the real CV at public/cv.pdf
const CV_PATH = "/cv.pdf";

export default function CVPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16 md:py-20">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
            Curriculum Vitae
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
            CV
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            A full PDF copy is embedded below. Last updated periodically — for
            the most recent version, please use the download link.
          </p>
        </div>
        <a
          href={CV_PATH}
          download
          className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 2v9M4 7l4 4 4-4M3 13.5h10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Download CV
        </a>
      </header>

      <p className="mb-3 text-xs text-muted">
        If the PDF doesn&apos;t load below, click the download button above.
      </p>

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <iframe
          src={CV_PATH}
          title="Kyle Calder — CV"
          className="h-[80vh] w-full"
        />
      </div>
    </div>
  );
}
