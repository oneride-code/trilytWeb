"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutGrid, ReceiptText, CalendarDays, Users, Package, Globe, Wallet, Settings, Search, Menu, X, Play, ChevronLeft, Handshake, ShieldCheck, ChevronDown,
} from "lucide-react";
import { ThemeToggle, Avatar, useNav } from "./ui";
import { TrilytLogo } from "./Brand";
import { useDemo } from "@/lib/demo/store";
import { ROLE_LABEL, ROLE_ORDER, type Role } from "@/lib/demo/data";

const NAV = [
  { group: "Run", items: [
    { key: "overview", href: "/demo/app", label: "Overview", icon: LayoutGrid },
    { key: "bookings", href: "/demo/app/orders", label: "Bookings", icon: ReceiptText, count: true },
    { key: "departures", href: "/demo/app/departures", label: "Departures", icon: CalendarDays },
    { key: "travellers", href: "/demo/app/travellers", label: "Travellers", icon: Users },
  ] },
  { group: "Sell", items: [
    { key: "packages", href: "/demo/app/packages", label: "Packages", icon: Package },
    { key: "agents", href: "/demo/app/agents", label: "Agents", icon: Handshake },
    { key: "bookingpage", href: "/demo/book/spiti-valley-circuit", label: "Booking page", icon: Globe },
  ] },
  { group: "Money and team", items: [
    { key: "payments", href: "/demo/app/payments", label: "Payments", icon: Wallet },
    { key: "team", href: "/demo/app/team", label: "Team and roles", icon: ShieldCheck },
    { key: "settings", href: "/demo/app/settings", label: "Settings", icon: Settings },
  ] },
];

const WHO: Record<Role, string> = { owner: "Ramesh Lotey", ops: "Kavita Shah", guide: "Tenzin Norbu", accounts: "Suresh Pillai", agent: "Hilltop Travels" };

export function Shell({ children, title, crumb, actions, wide = false }: { children: React.ReactNode; title: string; crumb?: { href: string; label: string }; actions?: React.ReactNode; wide?: boolean }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { orders, role, setRole } = useDemo();
  const allowed = useNav();
  const live = orders.filter((o) => o.status !== "cancelled").length;
  const isActive = (href: string) => (href === "/demo/app" ? path === href : path.startsWith(href));

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[232px_1fr]">
      {/* Rail */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-[232px] border-r border-[var(--d-line)] bg-[var(--d-surface)] transition-transform duration-200 lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <TrilytLogo height={26} />
            <span className="lg:hidden"><button type="button" className="btn btn-ghost btn-sm !h-7 !w-7 !px-0" aria-label="Close menu" onClick={() => setOpen(false)}><X size={15} /></button></span>
          </div>

          <div className="mx-3 rounded-lg border border-[var(--d-line)] px-3 py-2.5">
            <p className="truncate text-[13px] font-semibold">Himalayan Trails Co.</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-[var(--d-ink-3)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--d-accent)]" />Razorpay connected · settles T+2</p>
          </div>

          <nav className="mt-3 flex flex-1 flex-col gap-4 overflow-auto px-3" aria-label="Console">
            {NAV.map((g) => {
              const items = g.items.filter((it) => it.key === "bookingpage" ? role !== "guide" && role !== "accounts" : allowed.includes(it.key));
              if (!items.length) return null;
              return (
                <div key={g.group}>
                  <p className="eyebrow px-2 pb-1.5">{g.group}</p>
                  <ul className="flex flex-col gap-px">
                    {items.map((it) => {
                      const Icon = it.icon; const active = isActive(it.href);
                      return (
                        <li key={it.key}>
                          <Link href={it.href} onClick={() => setOpen(false)} aria-current={active ? "page" : undefined}
                            className={`flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13.5px] transition-colors ${active ? "bg-[var(--d-surface-2)] font-medium text-[var(--d-ink)]" : "text-[var(--d-ink-2)] hover:bg-[var(--d-surface-2)] hover:text-[var(--d-ink)]"}`}>
                            <Icon size={15} strokeWidth={1.8} className={active ? "text-[var(--d-accent-ink)]" : ""} />
                            <span className="flex-1">{it.label}</span>
                            {it.count && <span className="tnum text-[11.5px] text-[var(--d-ink-3)]">{live}</span>}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </nav>

          <div className="flex flex-col gap-2 border-t border-[var(--d-line)] p-3">
            <Link href="/demo/app?tour=1" className="btn btn-accent justify-center"><Play size={13} fill="currentColor" /> Walk through a week</Link>
            <p className="px-1 text-[11px] leading-snug text-[var(--d-ink-3)]">Sample data for a fictional operator. Nothing is sent anywhere.</p>
          </div>
        </div>
      </aside>
      {open && <button aria-label="Close menu" className="fixed inset-0 z-30 bg-[rgba(10,12,16,0.3)] lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-[var(--d-line)] bg-[var(--d-bg)]">
          <div className="flex h-12 items-center gap-2 px-4 lg:px-6">
            <span className="lg:hidden"><button type="button" className="btn btn-ghost btn-sm !h-8 !w-8 !px-0" aria-label="Open menu" onClick={() => setOpen(true)}><Menu size={17} /></button></span>
            <div className="flex min-w-0 items-center gap-1 text-[13.5px] font-medium">
              {crumb && <Link href={crumb.href} className="hidden items-center gap-0.5 text-[var(--d-ink-3)] hover:text-[var(--d-ink)] sm:inline-flex"><ChevronLeft size={14} />{crumb.label}<span className="mx-1.5 text-[var(--d-line-strong)]">/</span></Link>}
              <span className="truncate">{title}</span>
            </div>
            <div className="ml-auto hidden h-8 min-w-[240px] items-center gap-2 rounded-md border border-[var(--d-line)] bg-[var(--d-surface)] px-2.5 text-[12.5px] text-[var(--d-ink-3)] md:flex">
              <Search size={13} /> <span className="truncate">Search bookings, travellers, departures</span><kbd className="ml-auto">⌘K</kbd>
            </div>
            <div className="ml-auto flex items-center gap-1.5 md:ml-3">
              {actions}
              <label className="relative hidden items-center sm:flex" title="Switch the viewer to see what each role can do">
                <span className="sr-only">Viewing as</span>
                <select className="select !h-8 !w-auto appearance-none !pr-7 !text-[12.5px]" value={role} onChange={(e) => setRole(e.target.value as Role)}>
                  {ROLE_ORDER.map((r) => <option key={r} value={r}>Viewing as {ROLE_LABEL[r]}</option>)}
                </select>
                <ChevronDown size={13} className="pointer-events-none absolute right-2 text-[var(--d-ink-3)]" />
              </label>
              <ThemeToggle />
              <Avatar name={WHO[role]} size={28} />
            </div>
          </div>
        </header>
        <main className="px-4 py-5 lg:px-6">
          <div className={`mx-auto flex flex-col gap-5 ${wide ? "max-w-[1400px]" : "max-w-[1180px]"}`}>{children}</div>
        </main>
      </div>
    </div>
  );
}

export function PageTitle({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><h1 className="text-[22px] font-semibold leading-tight">{title}</h1>{sub && <p className="mt-0.5 text-[13.5px] text-[var(--d-ink-2)]">{sub}</p>}</div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}
