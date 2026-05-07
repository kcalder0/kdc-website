import Link from "next/link";
import { Mail } from "lucide-react";
// NOTE: lucide-react v1 removed brand icons (no Github icon).
// Using react-icons for GitHub and LinkedIn (both brand marks).
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SOCIAL } from "@/lib/data";

type Variant = "nav" | "profile";

type Item = {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  external: boolean;
};

const ITEMS: Item[] = [
  
  { label: "LinkedIn", href: SOCIAL.linkedin, icon: FaLinkedin, external: true },
  { label: "Email", href: `mailto:${SOCIAL.email}`, icon: Mail, external: false },
  { label: "GitHub", href: SOCIAL.github, icon: FaGithub, external: true },

];

export default function SocialLinks({
  variant,
  className = "",
}: {
  variant: Variant;
  className?: string;
}) {
  if (variant === "nav") {
    return (
      <ul className={`flex items-center gap-1 ${className}`}>
        {ITEMS.map(({ label, href, icon: Icon, external }) => (
          <li key={label}>
            <Link
              href={href}
              title={label}
              aria-label={label}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white/80 transition-colors hover:text-accent"
            >
              <Icon size={20} />
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  // profile variant
  return (
    <ul className={`flex items-center gap-3 ${className}`}>
      {ITEMS.map(({ label, href, icon: Icon, external }) => (
        <li key={label}>
          <Link
            href={href}
            title={label}
            aria-label={label}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white shadow-sm shadow-accent/30 transition-all hover:bg-accent-hover hover:shadow-md hover:shadow-accent/40 hover:-translate-y-0.5"
          >
            <Icon size={24} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
