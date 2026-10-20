"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "./ui";
import { TrilytMark } from "./Brand";

/** Frame for the traveller-facing pages: the operator's name, not Trilyt's. */
export function PublicShell({ children, step, title }: { children: React.ReactNode; step?: 1 | 2 | 3; title?: string }) {
  const steps = ["Choose", "Pay booking amount", "Confirmed"];
  return (
    <div className="min-h-dvh bg-[var(--d-surface)]">
      <header className="sticky top-0 z-30 border-b border-[var(--d-line)] bg-[var(--d-surface)]">
        <div className="mx-auto flex h-14 max-w-[1080px] items-center gap-3 px-4 lg:px-6">
          <Link href="/demo/app" className="hidden items-center gap-1 text-[12.5px] text-[var(--d-ink-3)] hover:text-[var(--d-ink)] sm:inline-flex"><ArrowLeft size={13} /> Console</Link>
          <span className="hidden h-4 w-px bg-[var(--d-line)] sm:block" />
          <span className="flex items-center gap-2.5"><span className="grid h-7 w-7 place-items-center rounded-md bg-[var(--d-ink)] text-[12px] font-bold text-[var(--d-bg)]">H</span><span className="text-[15px] font-semibold">Himalayan Trails Co.</span></span>
          {title && <span className="hidden text-[13px] text-[var(--d-ink-3)] md:inline">· {title}</span>}
          {step && (
            <ol className="ml-auto hidden items-center gap-2 text-[12px] font-medium md:flex" aria-label="Booking steps">
              {steps.map((s, i) => <li key={s} className={`flex items-center gap-2 ${i + 1 === step ? "text-[var(--d-ink)]" : "text-[var(--d-ink-3)]"}`}><span className={`grid h-5 w-5 place-items-center rounded-full text-[11px] ${i + 1 <= step ? "bg-[var(--d-ink)] text-[var(--d-bg)]" : "border border-[var(--d-line-strong)]"}`}>{i + 1}</span>{s}{i < 2 && <span className="mx-1 h-px w-6 bg-[var(--d-line)]" />}</li>)}
            </ol>
          )}
          <div className={step ? "ml-2" : "ml-auto"}><ThemeToggle /></div>
        </div>
      </header>
      <main className="px-4 py-6 lg:px-6 lg:py-8"><div className="mx-auto max-w-[1080px]">{children}</div></main>
      <footer className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-[var(--d-line)] px-4 py-6 text-center text-[12px] text-[var(--d-ink-3)]"><span className="inline-flex items-center gap-1.5">Bookings and payments run on <Link href="/demo" className="inline-flex"><TrilytMark height={16} /></Link></span><span>· money settles to Himalayan Trails Co.&apos;s own account · demo, nothing is charged</span></footer>
    </div>
  );
}
