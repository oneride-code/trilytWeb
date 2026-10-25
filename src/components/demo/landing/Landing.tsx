"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Play, Send, Sparkles } from "lucide-react";
import { ThemeToggle, PermMark } from "../ui";
import { Preview } from "./Preview";
import { TrilytLogo } from "../Brand";
import { TripCard, useAgent } from "../Agent";
import { TRIP_PROMPT, reply } from "@/lib/demo/agent";
import { PERMS, ROLE_LABEL, ROLE_ORDER, TRILYT, USD_INR, fmt, initialOrders, planCost, plans, travellers } from "@/lib/demo/data";

const MOMENTS = [
  { h: "A booking arrives", t: "Website, WhatsApp, Instagram, walk-in or an agent. One booking record whichever way it came. Seats held while they pay.", href: "/demo/app/orders", cta: "Bookings" },
  { h: "Deposit now, balance later", t: "Booking amount at order, balance 14 days before. Reminders go out on WhatsApp on their own; what is still owed sits in one list.", href: "/demo/app/payments", cta: "Due and overdue" },
  { h: "The booking card", t: "Who, what they paid, what is due, documents, and a log of everything anyone did. Every action is on the card.", href: "/demo/app/orders/TR-1042", cta: "Open a booking" },
  { h: "Changes without a phone call", t: "Move a date, add a traveller, record cash. Travellers do the same from their own page, inside the policy they accepted.", href: "/demo/book/manage/TR-1041", cta: "Traveller's page" },
  { h: "The day of departure", t: "The manifest on the guide's phone: pickup, medical notes, emergency contact, check-in. The office sees balances and no-shows live.", href: "/demo/app/departures/dp1", cta: "Manifest" },
  { h: "When you have to cancel", t: "Close a departure. Everyone is refunded in full automatically and offered other dates. The policy decides traveller cancellations, not a phone call.", href: "/demo/app/departures/dp8", cta: "Close a departure" },
  { h: "Money and books", t: "Settlements to your own bank, refunds netted, a GST invoice per booking, agent commissions, and one Trilyt invoice a month.", href: "/demo/app/payments?tab=invoices", cta: "Invoices" },
];

function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--d-line)] bg-[var(--d-bg)]">
      <div className="mx-auto flex h-14 max-w-[1120px] items-center gap-6 px-4 lg:px-6">
        <TrilytLogo height={28} sub="for operators" />
        <nav className="ml-auto hidden items-center gap-5 text-[13.5px] text-[var(--d-ink-2)] md:flex"><a href="#ai" className="hover:text-[var(--d-ink)]">Trilyt AI</a><a href="#week" className="hover:text-[var(--d-ink)]">A week</a><a href="#roles" className="hover:text-[var(--d-ink)]">Roles</a><a href="#pricing" className="hover:text-[var(--d-ink)]">Pricing</a><Link href="/demo/enquiry" className="hover:text-[var(--d-ink)]">Enquire</Link></nav>
        <div className="ml-auto flex items-center gap-2 md:ml-0"><ThemeToggle /><span className="hidden sm:block"><Link href="/demo/app" className="btn btn-primary">Open the console</Link></span></div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-[1120px] px-4 pt-14 lg:px-6 lg:pt-20">
      <div className="max-w-[760px]">
        <Link href="#pricing" className="mb-5 inline-block rounded-full bg-[var(--d-surface-2)] px-3 py-1 text-[12.5px] font-medium text-[var(--d-accent-ink)]">Free website · first {TRILYT.freeMonths} months of bookings free</Link>
        <h1 className="text-[36px] font-semibold leading-[1.05] tracking-[-0.025em] sm:text-[48px] lg:text-[56px]">Run every departure. Get paid to your own account.</h1>
        <p className="mt-5 max-w-[600px] text-[17px] leading-relaxed text-[var(--d-ink-2)]">Bookings, deposits and balances, manifests, refunds and GST for Indian travel operators. Travellers pay you directly through your own Razorpay account. Trilyt keeps the books and does the chasing, and Trilyt AI turns one line of chat into a trip on your website.</p>
        <div className="mt-7 flex flex-wrap gap-2">
          <Link href="/demo/app?tour=1" className="btn btn-primary btn-lg"><Play size={14} fill="currentColor" /> Walk through a week</Link>
          <Link href="/demo/app" className="btn btn-lg">Open the console <ArrowRight size={14} /></Link>
          <Link href="/demo/enquiry" className="btn btn-ghost btn-lg">Send an enquiry</Link>
        </div>
        <p className="mt-3 text-[12.5px] text-[var(--d-ink-3)]">Sample data for a fictional operator, Himalayan Trails Co. Nothing is sent anywhere.</p>
      </div>
      <div className="mt-12 hidden md:block"><Preview /></div>
      <div className="mt-10 md:hidden"><Link href="/demo/app" className="card block p-4 text-[14px]">Open the console on a laptop to see the full product. The booking pages work on a phone.</Link></div>
    </section>
  );
}

/** The trip from the ad prompt, drafted once on the pristine sample data so server and browser agree. */
const SAMPLE = (() => {
  const t = reply(TRIP_PROMPT, { role: "owner", orders: initialOrders, people: travellers, closed: [], draft: null });
  return t.card?.kind === "trip" ? t.card.draft : null;
})();

const CAN = [
  { h: "Build a trip from one line", t: "Days, seats, price options, departures and a day-by-day itinerary, drafted from what you typed. Change it by replying, then publish to your website.", say: "price 26,999 kar do" },
  { h: "Chase what's owed", t: "Who owes what, overdue first. One tap sends each traveller a WhatsApp reminder with a payment link for exactly their balance.", say: "Kis kis ka balance baaki hai?" },
  { h: "Close a departure", t: "Name the batch and why. It shows who is booked and what goes back, and refunds everyone in full only after you confirm.", say: "Rishikesh rafting 25 Oct cancel karo, river band hai." },
  { h: "Answers from your own numbers", t: "Collections this month, seats left on Saturday's batch, what needs you today. Read from your bookings, not guessed.", say: "Aaj kya pending hai?" },
];

function AI() {
  const { openAgent } = useAgent();
  const router = useRouter();
  const tryIt = () => { openAgent(TRIP_PROMPT); router.push("/demo/app/packages"); };
  return (
    <section id="ai" className="border-y border-[var(--d-line)] bg-[var(--d-surface)]">
      <div className="mx-auto grid max-w-[1120px] gap-10 px-4 py-20 lg:grid-cols-[1fr_420px] lg:px-6">
        <div>
          <p className="eyebrow flex items-center gap-1.5 !text-[var(--d-accent-ink)]"><Sparkles size={12} /> Trilyt AI</p>
          <h2 className="mt-2 max-w-[600px] text-[28px] font-semibold leading-tight tracking-[-0.02em] sm:text-[34px]">Chat karke nayi trip banao. Then let it run the desk.</h2>
          <p className="mt-3 max-w-[600px] text-[15px] leading-relaxed text-[var(--d-ink-2)]">Type the trip the way you&apos;d tell your team, in Hindi, English or both. Trilyt AI drafts the itinerary, price options, departures and seats from that one line, and publishes it to your website when you tap. After that it works from your own bookings: who still owes you, which batch is filling, what happens when the river closes.</p>
          <ul className="mt-7 grid gap-px overflow-hidden rounded-lg border border-[var(--d-line)] bg-[var(--d-line)] sm:grid-cols-2">
            {CAN.map((c) => (
              <li key={c.h} className="flex flex-col bg-[var(--d-surface)] p-4">
                <h3 className="text-[15px] font-semibold">{c.h}</h3>
                <p className="mt-1 flex-1 text-[13.5px] leading-relaxed text-[var(--d-ink-2)]">{c.t}</p>
                <p className="mt-3 text-[12.5px] text-[var(--d-ink-3)]">&ldquo;{c.say}&rdquo;</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-[600px] text-[13.5px] leading-relaxed text-[var(--d-ink-2)]">It never acts on its own. Publishing, reminders and refunds wait for your tap, and each login can only ask for what its role allows: your guide can&apos;t refund anyone, your CA can&apos;t publish a trip.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" onClick={tryIt} className="btn btn-primary btn-lg"><Sparkles size={14} /> Try Trilyt AI</button>
            <Link href="/demo/app" className="btn btn-lg">Open the console <ArrowRight size={14} /></Link>
          </div>
          <p className="mt-3 text-[12.5px] text-[var(--d-ink-3)]">In this demo Trilyt AI works on the sample data and understands requests like the ones above. Nothing is sent anywhere.</p>
        </div>
        {SAMPLE && (
          <div className="frame pointer-events-none select-none self-start" aria-hidden="true">
            <div className="frame-bar"><Sparkles size={13} className="text-[var(--d-accent)]" /><span className="text-[12px] font-medium">Trilyt AI</span></div>
            <div className="flex flex-col gap-3 bg-[var(--d-surface)] p-4">
              <p className="ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-[var(--d-ink)] px-3.5 py-2.5 text-[14px] leading-snug text-[var(--d-bg)]">{TRIP_PROMPT}</p>
              <TripCard draft={SAMPLE} state="draft" preview />
              <div className="flex items-center gap-2 rounded-xl border border-[var(--d-line-strong)] py-1.5 pl-3 pr-1.5 text-[14px] text-[var(--d-ink-3)]">Message Trilyt AI…<span className="ml-auto grid h-9 w-9 place-items-center rounded-lg bg-[var(--d-ink)] text-[var(--d-bg)]"><Send size={15} /></span></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Week() {
  return (
    <section id="week" className="mx-auto max-w-[1120px] px-4 py-20 lg:px-6">
      <p className="eyebrow">A week in the console</p>
      <h2 className="mt-2 max-w-[640px] text-[28px] font-semibold leading-tight tracking-[-0.02em] sm:text-[34px]">Seven things every operator does every week. One screen for each.</h2>
      <ol className="mt-8 grid gap-px overflow-hidden rounded-lg border border-[var(--d-line)] bg-[var(--d-line)] md:grid-cols-2 lg:grid-cols-3">
        {MOMENTS.map((m, i) => (
          <li key={m.h} className="flex flex-col bg-[var(--d-surface)] p-5">
            <span className="tnum text-[12px] text-[var(--d-ink-3)]">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-2 text-[16px] font-semibold">{m.h}</h3>
            <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-[var(--d-ink-2)]">{m.t}</p>
            <Link href={m.href} className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-[var(--d-accent-ink)]">{m.cta} <ArrowRight size={13} /></Link>
          </li>
        ))}
        <li className="flex flex-col justify-center bg-[var(--d-surface-2)] p-5 lg:col-span-2">
          <p className="text-[14px] text-[var(--d-ink-2)]">Built for India: Razorpay and UPI, WhatsApp Business API for every message, DLT SMS, GST at 5% on every invoice, agent net rates and credit limits. The things the imported tools skip.</p>
        </li>
      </ol>
    </section>
  );
}

function Roles() {
  return (
    <section id="roles" className="border-y border-[var(--d-line)] bg-[var(--d-surface)]">
      <div className="mx-auto max-w-[1120px] px-4 py-20 lg:px-6">
        <p className="eyebrow">Who sees what</p>
        <h2 className="mt-2 max-w-[640px] text-[28px] font-semibold leading-tight tracking-[-0.02em] sm:text-[34px]">Five logins. Your guide never sees the money; your CA never touches a booking.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {ROLE_ORDER.map((r) => {
            const yes = PERMS.flatMap((a) => a.rows).filter((row) => row[r] !== false);
            return (
              <div key={r} className="card p-4">
                <p className="text-[15px] font-semibold">{ROLE_LABEL[r]}</p>
                <p className="mt-0.5 text-[12px] text-[var(--d-ink-3)]">{r === "owner" ? "founder" : r === "ops" ? "runs the desk" : r === "guide" ? "on the road, on a phone" : r === "accounts" ? "CA, usually external" : "sells for you at net rate"}</p>
                <ul className="mt-3 flex flex-col gap-1.5 text-[12.5px] text-[var(--d-ink-2)]">
                  {yes.slice(0, 6).map((row) => <li key={row.action} className="flex items-start gap-2"><span className="mt-0.5 shrink-0"><PermMark v={row[r]} /></span><span className="min-w-0">{row.action}</span></li>)}
                  {yes.length > 6 && <li className="text-[var(--d-ink-3)]">and {yes.length - 6} more</li>}
                </ul>
              </div>
            );
          })}
        </div>
        <p className="mt-5 text-[13.5px] text-[var(--d-ink-2)]">The full matrix is on the <Link href="/demo/app/team" className="underline underline-offset-2">Team and roles</Link> page, and you can switch the viewer at the top of the console to see each role&apos;s screens.</p>
      </div>
    </section>
  );
}

function Pricing() {
  const [bookings, setBookings] = useState(40);
  const [avg, setAvg] = useState(38000);
  const [offline, setOffline] = useState(30);
  const [mkt, setMkt] = useState(30);
  const trilyt = plans[0];
  const cost = (id: string) => { const p = plans.find((x) => x.id === id)!; return id === "marketplace" ? planCost(p, Math.round(bookings * mkt / 100), avg, 0) : planCost(p, bookings, avg, offline / 100); };
  const tc = cost("trilyt");
  const perOrder = Math.min(TRILYT.cap, Math.round((avg * TRILYT.pct) / 100));
  const perOffline = Math.min(TRILYT.offlineCap, Math.round((avg * TRILYT.pct) / 100));
  return (
    <section id="pricing" className="mx-auto max-w-[1120px] px-4 py-20 lg:px-6">
      <p className="eyebrow">What it costs</p>
      <h2 className="mt-2 max-w-[700px] text-[28px] font-semibold leading-tight tracking-[-0.02em] sm:text-[34px]">A free website, and your first {TRILYT.freeMonths} months of bookings free. Then 1.75% of each order, never more than ₹999.</h2>
      <p className="mt-3 max-w-[640px] text-[15px] text-[var(--d-ink-2)]">The website carries your packages, departure dates and online booking. After the free months: no monthly fee, no setup fee, no fee on the traveller. Offline bookings pay 1.75% or ₹99, whichever is less, because the console still runs them. Razorpay&apos;s gateway charge is separate and the same on any software. One invoice a month, paid by UPI mandate.</p>

      <div className="mt-8 grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="card flex flex-col gap-4 p-5">
          <p className="text-[13px] font-semibold">Your numbers</p>
          {([["Bookings a month", bookings, setBookings, 5, 200, 5, (v: number) => String(v)], ["Average order", avg, setAvg, 3000, 120000, 1000, (v: number) => fmt(v)], ["Sold offline or by phone", offline, setOffline, 0, 100, 5, (v: number) => `${v}%`], ["Sold through a marketplace today", mkt, setMkt, 0, 100, 5, (v: number) => `${v}%`]] as const).map(([l, v, set, min, max, step, f]) => (
            <label key={l} className="flex flex-col gap-1.5 text-[12.5px]"><span className="flex justify-between"><span className="text-[var(--d-ink-2)]">{l}</span><b className="tnum">{f(v)}</b></span><input type="range" min={min} max={max} step={step} value={v} onChange={(e) => set(Number(e.target.value))} className="accent-[var(--d-ink)]" /></label>
          ))}
          <div className="border-t border-[var(--d-line)] pt-3 text-[13px]"><p className="text-[var(--d-ink-2)]">Trilyt per order</p><p className="tnum text-[24px] font-semibold leading-none">{fmt(perOrder)}<span className="text-[12px] font-normal text-[var(--d-ink-3)]"> online{perOrder === TRILYT.cap ? ", capped" : ""} · {fmt(perOffline)} offline</span></p><p className="mt-1 text-[12.5px] text-[var(--d-ink-3)]">₹0 for your first {TRILYT.freeMonths} months, then {fmt(tc)} a month on these numbers</p></div>
        </div>
        <div className="card scroll-x">
          <table className="tbl">
            <thead><tr><th>Software</th><th>Fee</th><th className="num">A month</th><th className="num">A year</th><th className="num">vs Trilyt</th></tr></thead>
            <tbody>
              {plans.map((p) => { const c = cost(p.id); const diff = c - tc; return (
                <tr key={p.id} className={p.id === "trilyt" ? "bg-[var(--d-surface-2)] font-medium" : ""}>
                  <td>{p.name}{p.source && <a href={p.source} target="_blank" rel="noreferrer" className="ml-1.5 text-[11px] font-normal text-[var(--d-ink-3)] underline">source</a>}<span className="block max-w-[360px] text-[12px] font-normal text-[var(--d-ink-3)]">{p.note}</span></td>
                  <td className="whitespace-nowrap text-[var(--d-ink-2)]">{p.monthly ? `$${p.monthly}/mo + ` : ""}{p.pct}%{p.cap ? `, cap ${fmt(p.cap)}` : ""}{p.offlineCap ? <span className="block text-[11.5px] text-[var(--d-ink-3)]">offline: cap {fmt(p.offlineCap)}</span> : null}{p.guestPays ? " (traveller pays)" : ""}</td>
                  <td className="num">{fmt(c)}</td>
                  <td className="num">{fmt(c * 12)}</td>
                  <td className={`num ${p.id === "trilyt" ? "text-[var(--d-ink-3)]" : diff > 0 ? "text-[var(--d-ink)]" : "text-[var(--d-bad)]"}`}>{p.id === "trilyt" ? "—" : diff > 0 ? `you keep ${fmt(diff * 12)}/yr` : `${fmt(-diff * 12)}/yr cheaper`}</td>
                </tr>
              ); })}
            </tbody>
          </table>
          <p className="border-t border-[var(--d-line)] px-4 py-2.5 text-[12px] text-[var(--d-ink-3)]">USD at ₹{USD_INR}. Marketplace row applies its commission to the share of bookings you sell there today; the others to all your bookings. Pricing pages read on 21 October 2026; FareHarbor and marketplace rates are from third-party sources and vary by contract. Every row excludes the payment gateway&apos;s own charge, which you pay on any software. Trilyt&apos;s figures are after the {TRILYT.freeMonths} free months, so your first year costs half of what the row shows. {trilyt.name} charges on offline orders too, capped at {fmt(TRILYT.offlineCap)} each.</p>
        </div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="border-t border-[var(--d-line)] bg-[var(--d-surface)]">
      <div className="mx-auto flex max-w-[1120px] flex-col items-start gap-5 px-4 py-20 lg:px-6">
        <h2 className="max-w-[640px] text-[28px] font-semibold leading-tight tracking-[-0.02em] sm:text-[34px]">See it with your own departures.</h2>
        <p className="max-w-[560px] text-[15px] text-[var(--d-ink-2)]">Connect your Razorpay account, add a package, and send your next traveller a real payment link in an afternoon. Your website comes free, and you pay nothing for the first {TRILYT.freeMonths} months. We set up the first five operators ourselves.</p>
        <div className="flex flex-wrap gap-2"><Link href="/demo/enquiry" className="btn btn-accent btn-lg">Send an enquiry</Link><Link href="/demo/app?tour=1" className="btn btn-lg"><Play size={14} fill="currentColor" /> Walk through a week</Link><Link href="/demo/book/spiti-valley-circuit" className="btn btn-lg">Try the booking page</Link></div>
        <p className="text-[12.5px] text-[var(--d-ink-3)]">Trilyt is built by AccelRyde Technologies LLP, Bengaluru · contact@accelryde.com</p>
      </div>
    </section>
  );
}

export function Landing() {
  return (
    <div className="min-h-dvh">
      <Nav />
      <Hero />
      <AI />
      <Week />
      <Roles />
      <Pricing />
      <Closing />
    </div>
  );
}
