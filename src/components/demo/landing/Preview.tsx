"use client";

/** A real, read-only slice of the console for the landing page: the overview on sample data. */
import { LayoutGrid, ReceiptText, CalendarDays, Users, Package, Wallet, ShieldCheck, Handshake, Search } from "lucide-react";
import { Avatar, Meter, StatusPill } from "../ui";
import { TrilytMark } from "../Brand";
import { useDemo } from "@/lib/demo/store";
import { TODAY, byId, d, dayOf, departures, dueItems, fee, fmt, fmtDate, fmtDay, monthShort, orderDue, packages, seatsLeft } from "@/lib/demo/data";

const NAV = [["Overview", LayoutGrid, true], ["Bookings", ReceiptText, false], ["Departures", CalendarDays, false], ["Travellers", Users, false], ["Packages", Package, false], ["Agents", Handshake, false], ["Payments", Wallet, false], ["Team and roles", ShieldCheck, false]] as const;

export function Preview() {
  const { orders, people } = useDemo();
  const live = orders.filter((o) => o.status !== "cancelled");
  const month = (dt: string) => dt.startsWith("2026-10");
  const collected = orders.flatMap((o) => o.payments).filter((p) => month(p.d)).reduce((s, p) => s + p.amt, 0);
  const due = live.reduce((s, o) => s + orderDue(o), 0);
  const fees = orders.filter((o) => o.payments.some((p) => month(p.d))).reduce((s, o) => s + fee(o), 0);
  const dues = dueItems(orders); const overdue = dues.filter((x) => x.overdue);
  const pending = live.filter((o) => o.status === "pending");
  const upcoming = departures.filter((x) => d(x.start) >= TODAY).slice(0, 4);

  return (
    <div className="frame pointer-events-none select-none" aria-hidden="true">
      <div className="frame-bar"><i /><i /><i /><span className="ml-3 text-[11px] text-[var(--d-ink-3)]">app.trilyt.in/himalayan-trails</span></div>
      <div className="grid h-[520px] grid-cols-[200px_1fr] overflow-hidden text-[12px]">
        <div className="border-r border-[var(--d-line)] bg-[var(--d-surface)] p-3">
          <div className="flex items-center gap-2 px-1"><TrilytMark height={20} /></div>
          <div className="mt-3 rounded border border-[var(--d-line)] px-2.5 py-2"><p className="text-[11.5px] font-semibold">Himalayan Trails Co.</p><p className="mt-0.5 flex items-center gap-1 text-[10px] text-[var(--d-ink-3)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--d-accent)]" />Razorpay connected</p></div>
          <ul className="mt-3 flex flex-col gap-px">{NAV.map(([l, Icon, a]) => <li key={l} className={`flex items-center gap-2 rounded px-2 py-1.5 ${a ? "bg-[var(--d-surface-2)] font-medium" : "text-[var(--d-ink-2)]"}`}><Icon size={13} className={a ? "text-[var(--d-accent-ink)]" : ""} />{l}</li>)}</ul>
        </div>
        <div className="min-w-0">
          <div className="flex h-10 items-center gap-2 border-b border-[var(--d-line)] px-4 text-[11.5px]"><span className="font-medium">Overview</span><span className="ml-auto flex h-6 w-[200px] items-center gap-1.5 rounded border border-[var(--d-line)] bg-[var(--d-surface)] px-2 text-[var(--d-ink-3)]"><Search size={11} /> Search</span><Avatar name="Ramesh Lotey" size={22} /></div>
          <div className="flex flex-col gap-3 p-4">
            <div><p className="eyebrow">{fmtDay(TODAY)}</p><p className="mt-0.5 text-[15px] font-semibold">Good morning, Ramesh.</p></div>
            <div className="grid grid-cols-4 gap-2">
              {[["Collected this month", fmt(collected), ""], ["Balance due", fmt(due), `${overdue.length} overdue`], ["Refunded", fmt(13999), "by policy"], ["Trilyt fee", fmt(fees), "1.75%, cap ₹999"]].map(([l, v, n], i) => <div key={l} className="card p-2.5"><p className="eyebrow !text-[9.5px]">{l}</p><p className={`tnum mt-1 text-[15px] font-semibold leading-none ${i === 1 ? "text-[var(--d-accent-ink)]" : ""}`}>{v}</p>{n && <p className="mt-1 text-[10px] text-[var(--d-ink-3)]">{n}</p>}</div>)}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="card"><p className="border-b border-[var(--d-line)] px-3 py-2 text-[11.5px] font-semibold">Needs you today</p>
                <ul className="rows">
                  {pending.map((o) => <li key={o.id} className="flex items-center gap-2 px-3 py-2"><StatusPill s="pending" /><span className="truncate">{o.sourceNote} wants {o.lines.length} seats, {fmtDate(d(byId(departures, o.dep)!.start))}</span></li>)}
                  {overdue.slice(0, 2).map(({ o, amt }) => <li key={o.id} className="flex items-center gap-2 px-3 py-2"><span className="pill p-bad !h-5 !text-[10px]">Overdue</span><span className="truncate">{byId(people, o.lines[0].t)?.name} owes {fmt(amt)}</span></li>)}
                  <li className="flex items-center gap-2 px-3 py-2"><span className="pill p-warn !h-5 !text-[10px]">Documents</span><span className="truncate">Priya Nair has not signed the consent form</span></li>
                </ul>
              </div>
              <div className="card"><p className="border-b border-[var(--d-line)] px-3 py-2 text-[11.5px] font-semibold">Upcoming departures</p>
                <ul className="rows">{upcoming.map((x) => <li key={x.id} className="grid grid-cols-[34px_1fr_auto] items-center gap-2 px-3 py-1.5"><span className="leading-tight"><span className="tnum block text-[14px] font-semibold">{dayOf(x.start)}</span><span className="block text-[9px] uppercase text-[var(--d-ink-3)]">{monthShort(x.start)}</span></span><span className="min-w-0"><span className="block truncate font-medium">{byId(packages, x.pkg)!.name}</span><span className="mt-1 block"><Meter value={x.booked} max={x.seats} /></span></span><span className="tnum text-[10.5px] text-[var(--d-ink-2)]">{x.booked}/{x.seats}{seatsLeft(x) <= 3 && seatsLeft(x) > 0 ? ` · ${seatsLeft(x)} left` : ""}</span></li>)}</ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
