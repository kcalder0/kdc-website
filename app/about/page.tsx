import type { Metadata } from "next";
import Image from "next/image";
import SocialLinks from "@/components/SocialLinks";

export const metadata: Metadata = {
  title: "About",
  description: "About Kyle Calder — Harvard master's student, quantitative researcher.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16 md:py-20">
      <header className="mb-10">
        <h2 className="text-4xl font-semibold uppercase tracking-[0.18em] text-accent">
          About
        </h2>
        
      </header>

      <div className="grid gap-10 md:grid-cols-[200px_1fr] md:gap-12">
        <div>
          <div className="w-full max-w-[200px]">
            <Image
              src="/headshot.jpeg"
              alt="Kyle Calder"
              width={906}
              height={1444}
              sizes="(min-width: 768px) 200px, 100vw"
              className="h-auto w-full rounded-lg border border-border bg-surface"
              priority
            />
          </div>
          <div className="mt-4 border-t border-border pt-4">
   
   
        <SocialLinks variant="profile" />
      </div>

        </div>

        <div className="space-y-5 text-base leading-relaxed text-foreground/85">
          
          <p>
             
            I&apos;m a master's student at Harvard studying Data Science.
            <br /><br />
            My current research is on stablecoins and blockchain markets, with Wenxin Du, Gita Gopinath, and Jeremy Stein.
            <br /><br />
            Over summer 2026, I will be working as a quantitative research intern at Fidelity Investments on the Fixed Income team in Boston, MA and Merrimack, NH.
            <br /><br />
            I am always interested in contributing to research in ML, NLP and applications to economics and finance. 
            Please reach out at <a href="mailto:kylecalder@g.harvard.edu" className="text-accent">kylecalder@g.harvard.edu</a> or 
            <a href="mailto:kyledcalder@gmail.com" className="text-accent">kyledcalder@gmail.com</a> if you are interested in collaborating.
            <br /><br />
            I worked as an economic consultant at Charles River Associates, an economic consulting firm in Boston for 6 years. My work and research focused on market microstructure and manipulation, cryptocurrency and securities laws, and economic valuations.
            <br /><br />
            My first published work on regime change models in securities litigation was published this year in the Journal of Forensic Economics. 
            <br /><br />
            Outside of research, I am interested in lifting heavy weights, video games, and bodies of water. I also enjoy looking at maps.
         
            </p>
          <div className="grid gap-4 pt-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted">
                Research areas
              </div>
              <ul className="mt-2 text-sm text-foreground/85">
                <li>· Economics and fixed income</li>
                <li>· Stablecoins</li>
                <li>· Natural Language Processing (NLP)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
