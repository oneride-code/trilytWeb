"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

// Absolute so they resolve from the standalone pages too, not just the home page.
const NAV = [
  { label: "About", href: "/#about" },
  { label: "Why Trilyt", href: "/#why" },
  { label: "Rides", href: "/rides/kolli-hills" },
  { label: "Contact us", href: "/contact" },
];

function AppleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="currentColor" aria-hidden="true">
      <path d="M16.37 12.77c-.02-2.2 1.79-3.25 1.87-3.3-1.02-1.49-2.6-1.7-3.17-1.72-1.35-.14-2.63.79-3.31.79-.69 0-1.74-.77-2.86-.75-1.47.02-2.83.85-3.59 2.16-1.53 2.65-.39 6.58 1.1 8.73.73 1.05 1.6 2.23 2.74 2.19 1.1-.04 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.07 2.65-2.13.84-1.22 1.18-2.4 1.2-2.46-.03-.01-2.3-.88-2.33-3.49ZM14.2 6.3c.6-.74 1.01-1.75.9-2.76-.87.04-1.93.58-2.55 1.3-.56.64-1.05 1.68-.92 2.67.97.08 1.96-.49 2.57-1.21Z" />
    </svg>
  );
}

function AndroidGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="currentColor" aria-hidden="true">
      <path d="M17.1 9.6H6.9a.6.6 0 0 0-.6.6v6.9c0 .5.4.9.9.9h.9v2.4a1.2 1.2 0 1 0 2.4 0v-2.4h2.8v2.4a1.2 1.2 0 1 0 2.4 0v-2.4h.9c.5 0 .9-.4.9-.9v-6.9a.6.6 0 0 0-.6-.6ZM4.4 9.5a1.2 1.2 0 0 0-1.2 1.2v4.6a1.2 1.2 0 1 0 2.4 0v-4.6a1.2 1.2 0 0 0-1.2-1.2Zm15.2 0a1.2 1.2 0 0 0-1.2 1.2v4.6a1.2 1.2 0 1 0 2.4 0v-4.6a1.2 1.2 0 0 0-1.2-1.2ZM15.1 4.5l.8-1.4a.25.25 0 0 0-.43-.25l-.83 1.44a5.6 5.6 0 0 0-4.3 0L9.5 2.85a.25.25 0 1 0-.43.25l.81 1.4A4.75 4.75 0 0 0 7.2 8.4h9.6a4.75 4.75 0 0 0-1.7-3.9ZM9.9 6.8a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1Zm4.2 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1Z" />
    </svg>
  );
}

function DownloadButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/#download"
      className={`text-label-md inline-flex items-center gap-sm rounded-half bg-brand px-xl py-md text-text-on-brand transition-opacity hover:opacity-90 ${className}`}
    >
      <AppleGlyph />
      <AndroidGlyph />
      <span className="ml-xs">Download</span>
    </Link>
  );
}

export function Header({ sticky = true }: { sticky?: boolean } = {}) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={`${sticky ? "sticky top-0 z-50" : ""} border-b border-border-subtle bg-page/80 backdrop-blur-md`}
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-lg py-md lg:px-xl">
        <Link href="/" className="text-text-primary">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-xl lg:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-body-lg text-text-secondary transition-colors hover:text-text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <DownloadButton />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex h-[40px] w-[40px] items-center justify-center rounded-lg border border-border-default text-text-primary lg:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-[20px] w-[20px]" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-border-subtle bg-page lg:hidden"
      >
        <nav className="mx-auto flex max-w-[1240px] flex-col gap-lg px-lg py-lg" aria-label="Mobile">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-body-lg text-text-secondary"
            >
              {item.label}
            </Link>
          ))}
          <DownloadButton className="self-start" />
        </nav>
      </div>
    </header>
  );
}
