import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col bg-base">
      <section className="text-white">
        <div className="mx-auto w-full max-w-5xl px-6 pt-20 pb-20 md:pt-28 md:pb-28">
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">
            Kyle Calder
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
            
            Currently pursuing a master's degree in data science. I am always interested in hearing about or contributing to research in ML, NLP, and applications to economics and finance.

            <br /><br />
            Available @ <a href="mailto:kylecalder@g.harvard.edu" className="text-accent">kylecalder@g.harvard.edu</a> or <a href="mailto:kyledcalder@gmail.com" className="text-accent">kyledcalder@gmail.com</a>

            <br /><br />
            This site collects my publications, random memos, and apps I host here for my own use.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/research"
              className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              View Research
            </Link>
            <Link
              href="/apps"
              className="inline-flex items-center justify-center rounded-md border border-accent px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white"
            >
              See Apps
            </Link>
            <Link
              href="/cv"
              className="inline-flex items-center justify-center rounded-md border border-accent px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white"
            >
              Download CV
            </Link>
            
          </div>
          <div className="mt-6">
            <Link
              href="/about"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
            >
              More about me
              <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 6h6M6 3l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
