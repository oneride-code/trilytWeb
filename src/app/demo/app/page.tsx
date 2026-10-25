"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Shell } from "@/components/demo/Shell";
import { Avatar, Btn, Meter, Stat, StatusPill } from "@/components/demo/ui";
import { NewBookingButton } from "@/components/demo/actions";
import { AskBar } from "@/components/demo/Agent";
import { useDemo } from "@/lib/demo/store";
import { TODAY, byId, d, dayOf, daysUntil, departures, dstr, dueItems, fee, fmt, fmtDate, fmtDay, monthShort, orderDue, orderPaid, orderTotal, packages, seatsLeft, weeklyBookings } from "@/lib/demo/data";

function Chart({ data }: { data: number[] }) {
  const w = 560, h = 120, pad = 6, max = Math.max(...data);
  const pts = data.map((v, i) => [pad + (i * (w - pad * 2)) / (data.length - 1), h - pad - (v / max) * (h - pad * 2)] as const);
  const path = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-[120px] w-full" role="img" aria-label="Bookings per week, last 12 weeks">
      {[0.25, 0.5, 0.75].map((f) => <line key={f} x1={pad} x2={w - pad} y1={h - pad - f * (h - pad * 2)} y2={h - pad - f * (h - pad * 2)} stroke="var(--d-line)" strokeWidth="1" />)}
      <path d={path} fill="none" stroke="var(--d-ink)" strokeWidth="1.5" />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 3.5 : 2} fill={i === pts.length - 1 ? "var(--d-accent)" : "var(--d-ink)"} />)}
    </svg>
  );
}

export default function Overview() {
  const { orders, people, role, closed } = useDemo();
  const live = orders.filter((o) => o.status !== "cancelled");
  const month = (dt: string) => dt.startsWith("2026-10");
  const collected = orders.flatMap((o) => o.payments).filter((p) => month(p.d)).reduce((s, p) => s + p.amt, 0);
  const due = live.reduce((s, o) => s + orderDue(o), 0);
  const refunded = orders.filter((o) => o.refund && month(o.refund.d)).reduce((s, o) => s + (o.refund?.amt ?? 0), 0);
  const fees = orders.filter((o) => o.payments.some((p) => month(p.d))).reduce((s, o) => s + fee(o), 0);
  const upcoming = departures.filter((x) => d(x.start) >= TODAY && !closed.includes(x.id)).slice(0, 5);
  const dues = dueItems(orders);
  const overdue = dues.filter((x) => x.overdue);
  const pending = live.filter((o) => o.status === "pending");
  const missingDocs = live.filter((o) => o.docs.some((x) => x.status === "missing") && daysUntil(byId(departures, o.dep)!.start) <= 14);
  const name = role === "owner" ? "Ramesh" : role === "ops" ? "Kavita" : role === "accounts" ? "Suresh" : role === "guide" ? "Tenzin" : "Hilltop";

  return (
    <Shell title="Overview" actions={(role === "owner" || role === "ops") && <NewBookingButton primary />}>
      <div>
        <p className="eyebrow">{fmtDay(TODAY)}</p>
        <h1 className="mt-1 text-[22px] font-semibold leading-tight">Good morning, {name}.</h1>
        <p className="mt-0.5 text-[13.5px] text-[var(--d-ink-2)]">{upcoming.filter((x) => daysUntil(x.start) <= 7).length} departures this week. {overdue.length ? `${overdue.length} balance${overdue.length > 1 ? "s" : ""} overdue.` : "No balances overdue."} {pending.length ? `${pending.length} agent order waiting.` : ""}</p>
      </div>

      <AskBar />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Collected this month" value={fmt(collected)} note="to your Razorpay account and in cash" href="/demo/app/payments" />
        <Stat label="Balance due" value={fmt(due)} accent note={`across ${live.filter((o) => orderDue(o) > 0).length} bookings · ${overdue.length} overdue`} href="/demo/app/payments" />
        <Stat label="Refunded" value={fmt(refunded)} note="by policy, sent automatically" href="/demo/app/payments?tab=refunds" />
        <Stat label="Trilyt fee, October" value={fmt(fees)} note="1.75% per order, cap ₹999 · ₹99 cap offline · invoiced 1 Nov" href="/demo/app/payments?tab=invoices" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <section className="card">
          <div className="flex items-center justify-between border-b border-[var(--d-line)] px-4 py-3"><h2 className="text-[14px] font-semibold">Needs you today</h2><span className="tnum text-[12.5px] text-[var(--d-ink-3)]">{overdue.length + pending.length + missingDocs.length} items</span></div>
          <ul className="rows">
            {pending.map((o) => (
              <li key={o.id}><Link href={`/demo/app/orders/${o.id}`} className="row-hover flex items-center gap-3 px-4 py-3">
                <StatusPill s="pending" /><span className="min-w-0 flex-1 truncate text-[13.5px]"><b className="mono font-medium">{o.id}</b> · {o.sourceNote} wants {o.lines.length} seats on {dstr(byId(departures, o.dep)!.start)}</span><ArrowRight size={14} className="text-[var(--d-ink-3)]" /></Link></li>
            ))}
            {overdue.map(({ o, amt, due: dd }) => (
              <li key={o.id}><Link href={`/demo/app/orders/${o.id}`} className="row-hover flex items-center gap-3 px-4 py-3">
                <span className="pill p-bad">Overdue</span><span className="min-w-0 flex-1 truncate text-[13.5px]">{byId(people, o.lines[0].t)?.name} owes <b className="tnum">{fmt(amt)}</b> since {fmtDate(dd)} · {byId(packages, byId(departures, o.dep)!.pkg)!.name}</span><ArrowRight size={14} className="text-[var(--d-ink-3)]" /></Link></li>
            ))}
            {missingDocs.map((o) => (
              <li key={o.id + "d"}><Link href={`/demo/app/orders/${o.id}`} className="row-hover flex items-center gap-3 px-4 py-3">
                <span className="pill p-warn">Documents</span><span className="min-w-0 flex-1 truncate text-[13.5px]">{byId(people, o.lines[0].t)?.name} has not signed the consent form · departs {dstr(byId(departures, o.dep)!.start)}</span><ArrowRight size={14} className="text-[var(--d-ink-3)]" /></Link></li>
            ))}
            {!overdue.length && !pending.length && !missingDocs.length && <li className="px-4 py-6 text-center text-[13px] text-[var(--d-ink-3)]">Nothing waiting on you.</li>}
          </ul>
        </section>

        <section className="card">
          <div className="flex items-center justify-between border-b border-[var(--d-line)] px-4 py-3"><h2 className="text-[14px] font-semibold">Bookings per week</h2><span className="text-[12.5px] text-[var(--d-ink-3)]">last 12 weeks</span></div>
          <div className="px-4 pb-2 pt-3"><Chart data={weeklyBookings} /></div>
          <div className="flex items-center justify-between border-t border-[var(--d-line)] px-4 py-2.5 text-[12.5px] text-[var(--d-ink-2)]"><span>This week so far</span><span className="tnum font-medium text-[var(--d-ink)]">{weeklyBookings[weeklyBookings.length - 1]} bookings · {fmt(live.filter((o) => o.created >= "2026-10-19").reduce((s, o) => s + orderTotal(o), 0))}</span></div>
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card">
          <div className="flex items-center justify-between border-b border-[var(--d-line)] px-4 py-3"><h2 className="text-[14px] font-semibold">Upcoming departures</h2><Btn href="/demo/app/departures" size="sm" variant="ghost">All <ArrowRight size={12} /></Btn></div>
          <ul className="rows">
            {upcoming.map((x) => { const p = byId(packages, x.pkg)!; const left = seatsLeft(x); return (
              <li key={x.id}><Link href={`/demo/app/departures/${x.id}`} className="row-hover grid grid-cols-[52px_1fr_auto] items-center gap-3 px-4 py-2.5">
                <span className="leading-tight"><span className="block text-[18px] font-semibold tnum">{dayOf(x.start)}</span><span className="block text-[11px] uppercase text-[var(--d-ink-3)]">{monthShort(x.start)}</span></span>
                <span className="min-w-0"><span className="block truncate text-[13.5px] font-medium">{p.name}</span><span className="mt-1 block"><Meter value={x.booked} max={x.seats} /></span></span>
                <span className="text-right text-[12.5px] text-[var(--d-ink-2)]"><span className="tnum block font-medium text-[var(--d-ink)]">{x.booked}/{x.seats}</span>{left === 0 ? "full" : left <= 3 ? `${left} left` : `${left} open`}</span>
              </Link></li>
            ); })}
          </ul>
        </section>

        <section className="card">
          <div className="flex items-center justify-between border-b border-[var(--d-line)] px-4 py-3"><h2 className="text-[14px] font-semibold">Recent bookings</h2><Btn href="/demo/app/orders" size="sm" variant="ghost">All <ArrowRight size={12} /></Btn></div>
          <ul className="rows">
            {orders.slice(0, 5).map((o) => { const t = byId(people, o.lines[0].t); const p = byId(packages, byId(departures, o.dep)!.pkg)!; return (
              <li key={o.id}><Link href={`/demo/app/orders/${o.id}`} className="row-hover flex items-center gap-3 px-4 py-2.5">
                <Avatar name={t?.name ?? "?"} size={28} />
                <span className="min-w-0 flex-1"><span className="block truncate text-[13.5px] font-medium">{t?.name}{o.lines.length > 1 ? ` +${o.lines.length - 1}` : ""}</span><span className="block truncate text-[12px] text-[var(--d-ink-3)]">{p.name} · {dstr(byId(departures, o.dep)!.start)} · {o.source}</span></span>
                <span className="text-right"><span className="tnum block text-[13.5px] font-medium">{fmt(orderPaid(o))}</span><StatusPill s={o.status} /></span>
              </Link></li>
            ); })}
          </ul>
        </section>
      </div>
    </Shell>
  );
}
