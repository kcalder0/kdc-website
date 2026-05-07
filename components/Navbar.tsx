"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SocialLinks from "@/components/SocialLinks";

type SubLink = { href: string; label: string; description?: string };
type NavItem =
  | { href: string; label: string; children?: undefined }
  | { label: string; children: SubLink[]; href?: string };

const NAV_ITEMS: NavItem[] = [
  { href: "/about", label: "About" },
  {
    label: "Research",
    href: "/research",
    children: [
      { href: "/research/publications", label: "Publications", description: "Peer-reviewed and working papers" },
      { href: "/research/notes", label: "Notes", description: "Informal notes and writing" },
    ],
  },
  { href: "/cv", label: "CV" },
  {
    label: "Apps",
    href: "/apps",
    children: [
      { href: "/apps/ust", label: "UST Yield Curve", description: "Interactive Treasury curve explorer" },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120);
  };
  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-base/95 backdrop-blur supports-[backdrop-filter]:bg-base/85">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-white transition-colors hover:text-accent-hover"
        >
          Home
        </Link>

        <div className="hidden items-center gap-3 md:flex">
        <ul className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            if (item.children) {
              const open = openDropdown === item.label;
              const active = isActive(pathname, item.href ?? `/${item.label.toLowerCase()}`);
              return (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => {
                    cancelClose();
                    setOpenDropdown(item.label);
                  }}
                  onMouseLeave={scheduleClose}
                >
                  <Link
                    href={item.href ?? "#"}
                    className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "text-accent border-b-2 border-accent rounded-b-none pb-1.5"
                        : "text-white/70 hover:text-white"
                    }`}
                    aria-haspopup="true"
                    aria-expanded={open}
                  >
                    {item.label}
                    <svg
                      className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M3 4.5L6 7.5L9 4.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                  {open && (
                    <div
                      className="absolute left-0 top-full pt-2"
                      onMouseEnter={cancelClose}
                      onMouseLeave={scheduleClose}
                    >
                      <div className="w-72 overflow-hidden rounded-lg border border-border bg-background shadow-xl ring-1 ring-black/5">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block border-b border-border/60 px-4 py-3 last:border-b-0 transition-colors hover:bg-surface"
                          >
                            <div className="text-sm font-medium text-primary">{child.label}</div>
                            {child.description && (
                              <div className="mt-0.5 text-xs text-muted">{child.description}</div>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              );
            }
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "text-accent border-b-2 border-accent rounded-b-none pb-1.5"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="ml-2 flex items-center gap-1 border-l border-white/15 pl-3">
          <SocialLinks variant="nav" />
        </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-white md:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M6 6L18 18M18 6L6 18" strokeLinecap="round" />
            </svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M4 7H20M4 12H20M4 17H20" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-base md:hidden">
          <ul className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-6 py-4">
            {NAV_ITEMS.map((item) => {
              if (item.children) {
                const active = isActive(pathname, item.href ?? "");
                return (
                  <li key={item.label} className="py-1">
                    <Link
                      href={item.href ?? "#"}
                      className={`block py-2 text-sm font-semibold ${active ? "text-accent" : "text-white"}`}
                    >
                      {item.label}
                    </Link>
                    <ul className="ml-3 border-l border-white/10">
                      {item.children.map((child) => {
                        const childActive = isActive(pathname, child.href);
                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className={`block py-2 pl-4 text-sm transition-colors ${
                                childActive ? "text-accent" : "text-white/60 hover:text-white"
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              }
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block py-2 text-sm font-semibold ${active ? "text-accent" : "text-white"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mx-auto w-full max-w-6xl border-t border-white/10 px-6 py-3">
            <SocialLinks variant="nav" />
          </div>
        </div>
      )}
    </header>
  );
}
