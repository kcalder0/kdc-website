// TODO: verify these match your active accounts before launch
export const SOCIAL = {
  github: "https://github.com/kcalder0",
  linkedin: "https://www.linkedin.com/in/kyle-calder-489409142/",
  email: "kyledcalder@gmail.com",
} as const;

export type Publication = {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  abstract: string;
  pdfUrl?: string;
  doiUrl?: string;
};

export type Note = {
  title: string;
  date: string; // ISO date string
  description: string;
  slug: string;
};

export type AppEntry = {
  title: string;
  description: string;
  href: string;
  status: "Live" | "In Development" | "Planned";
  tags: string[];
};

// Publications
export const publications: Publication[] = [
  {
    title:
      "Bias in Securities Litigation Event Studies When Volatility and Beta Shift", 
    authors: ["Kyle Calder", "Rahul Chhabra", "Aaron Dolgoff"],
    venue: "Journal of Forensic Economics (Ahead of Print)",
    year: 2026,
    abstract:
      "Traditional event study methodology can lead to erroneous conclusions—incorrect identification of an insignificant price change as statistically significant (and vice versa)—when there are volatility shifts, and the model is estimated from a prior low volatility period. Earlier studies have used the empirical distribution of the test statistic to adjust for the fatter tails created due to volatility shifts. We show that the empirical distribution approach (EDA) can only account for a shift in volatility and leads to biased results when there is a simultaneous shift in the beta. We propose using a regime switching (RS) model to estimate beta and volatility for different regimes. We show that using regime-specific beta and volatility removes the bias in excess returns caused by estimating the parameters from a prior period, with different beta and volatility. Our findings have practical implications for securities litigation, where event studies serve as key evidence. We highlight the need for re-evaluating excess return methodologies in high volatility environments and provide a framework for improving event study robustness in legal and regulatory contexts.",
    // pdfUrl: "#",
    doiUrl: "https://jfe.kglmeridian.com/view/journals/foen/aop/article-10.5085-JFE-512/article-10.5085-JFE-512.xml",
  },
  
];


// TODO: replace with real notes (will eventually become MDX posts)
export const notes: Note[] = [
  {
    title: "Placeholder",
    date: "2026-03-12",
    description:
      "Placeholder note.",
    slug: "placeholder-note",
  },
  

];

// TODO: add additional apps as they ship
export const apps: AppEntry[] = [
  {
    title: "US Treasury Yield Curve Explorer",
    description:
      "Interactive visualization of the US Treasury par yield curve with historical comparison, similar period detection, and a curated fixed income news feed.",
    href: "/apps/ust",
    status: "In Development",
    tags: ["Fixed Income", "Visualization", "D3"],
  },
  {
    title: "Coming soon",
    description:
      "Another app is in the works. Check back later — or get in touch if you want to know what.",
    href: "/apps",
    status: "Planned",
    tags: [],
  },
];
