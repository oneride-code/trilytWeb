"use client";

import { useState } from "react";
import Link from "next/link";
import { Shell, PageTitle } from "@/components/demo/Shell";
import { Avatar, Btn, Panel, StatusPill, Empty, useCan } from "@/components/demo/ui";
import { BookingCard } from "@/components/demo/BookingCard";
import { NewBookingButton } from "@/components/demo/actions";
import { useDemo, SOURCE_LABEL } from "@/lib/demo/store";
import { byId, departures, dstr, fmt, orderDue, orderPaid, orderTotal, packages, type OrderStatus } from "@/lib/demo/data";

const TABS: { k: OrderStatus | "all" | "due"; l: string }[] = [{ k: "all", l: "All" }, { k: "due", l: "Balance due" }, { k: "pending", l: "Awaiting confirmation" }, { k: "paid", l: "Paid" }, { k: "cancelled", l: "Cancelled" }];

export default function OrdersPage() {
  const { orders, people, role } = useDemo();
  const money = useCan("See who paid what") !== false;
  const [tab, setTab] = useState<(typeof TABS)[number]["k"]>("all");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string | null>(null);
  const mine = role === "agent" ? orders.filter((o) => o.agent === "ag1") : role === "guide" ? orders.filter((o) => byId(departures, o.dep)?.guide === "Tenzin Norbu") : orders;
  const tabs = money ? TABS : TABS.filter((t) => t.k !== "due");
  const list = mine.filter((o) => tab === "all" ? true : tab === "due" ? o.status === "part" || o.status === "pending" : o.status === tab)
    .filter((o) => { if (!q) return true; const s = q.toLowerCase(); const t = byId(people, o.lines[0].t); return o.id.toLowerCase().includes(s) || (t?.name.toLowerCase().includes(s) ?? false) || byId(packages, byId(departures, o.dep)!.pkg)!.name.toLowerCase().includes(s); });
  const counts = (k: (typeof TABS)[number]["k"]) => mine.filter((o) => k === "all" ? true : k === "due" ? o.status === "part" || o.status === "pending" : o.status === k).length;
  const selected = sel ? orders.find((o) => o.id === sel) : null;

  return (
    <Shell title="Bookings" actions={(role === "owner" || role === "ops" || role === "agent") && <NewBookingButton primary />} wide>
      <PageTitle title="Bookings" sub={role === "agent" ? "Orders placed by Hilltop Travels at net rate." : role === "guide" ? "Bookings on your departures. Payments stay with the office." : "One booking per order from any channel. Click a row to open it beside the list."}>
        <input className="input !w-[240px]" placeholder="Search id, name, package" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search bookings" />
      </PageTitle>

      <div className="flex flex-wrap gap-1 border-b border-[var(--d-line)]">
        {tabs.map((t) => <button key={t.k} type="button" onClick={() => setTab(t.k)} className={`-mb-px border-b-2 px-3 py-2 text-[13px] ${tab === t.k ? "border-[var(--d-ink)] font-medium text-[var(--d-ink)]" : "border-transparent text-[var(--d-ink-2)] hover:text-[var(--d-ink)]"}`}>{t.l} <span className="tnum ml-1 text-[var(--d-ink-3)]">{counts(t.k)}</span></button>)}
      </div>

      <div className="card scroll-x">
        <table className="tbl">
          <thead><tr><th>Booking</th><th>Traveller</th><th>Departure</th><th>From</th>{money ? <><th className="num">Total</th><th className="num">Paid</th><th className="num">Due</th></> : <><th className="num">Travellers</th><th>Pickup</th></>}<th>Status</th></tr></thead>
          <tbody>
            {list.map((o) => { const t = byId(people, o.lines[0].t); const dp = byId(departures, o.dep)!; const p = byId(packages, dp.pkg)!; const due = orderDue(o); return (
              <tr key={o.id} className={`row-link ${sel === o.id ? "bg-[var(--d-surface-2)]" : ""}`} onClick={() => setSel(o.id)}>
                <td><span className="mono text-[12.5px] font-medium">{o.id}</span><span className="block text-[11.5px] text-[var(--d-ink-3)]">{dstr(o.created)}</span></td>
                <td><span className="flex items-center gap-2"><Avatar name={t?.name ?? "?"} size={24} /><span className="min-w-0"><span className="block truncate font-medium">{t?.name}{o.lines.length > 1 ? ` +${o.lines.length - 1}` : ""}</span></span></span></td>
                <td><span className="block truncate">{p.name}</span><span className="block text-[11.5px] text-[var(--d-ink-3)]">{dstr(dp.start)} – {dstr(dp.end)}</span></td>
                <td className="text-[var(--d-ink-2)]">{SOURCE_LABEL[o.source]}{o.sourceNote ? <span className="block text-[11.5px] text-[var(--d-ink-3)]">{o.sourceNote}</span> : null}</td>
                {money ? <>
                  <td className="num">{fmt(orderTotal(o))}</td>
                  <td className="num">{fmt(orderPaid(o))}</td>
                  <td className={`num ${due > 0 && o.status !== "cancelled" ? "font-medium text-[var(--d-accent-ink)]" : "text-[var(--d-ink-3)]"}`}>{o.status === "cancelled" ? "—" : fmt(due)}</td>
                </> : <>
                  <td className="num">{o.lines.length}</td>
                  <td className="text-[var(--d-ink-2)]">{o.pickup ?? p.meet.split(",")[0]}</td>
                </>}
                <td><StatusPill s={o.status} /></td>
              </tr>
            ); })}
          </tbody>
        </table>
        {!list.length && <Empty>No bookings match.</Empty>}
      </div>

      {selected && (
        <Panel eyebrow={<span className="mono">{selected.id}</span>} title={`${byId(people, selected.lines[0].t)?.name ?? ""}${selected.lines.length > 1 ? ` and ${selected.lines.length - 1} more` : ""}`} onClose={() => setSel(null)}
          footer={<Btn href={`/demo/app/orders/${selected.id}`} size="sm" variant="ghost">Open as a page</Btn>}>
          <BookingCard o={selected} compact />
        </Panel>
      )}
      {money && <p className="text-[12px] text-[var(--d-ink-3)]">Tip: <Link href="/demo/app/orders/TR-1042" className="underline">open a booking as a full page</Link> when you need the whole log.</p>}
    </Shell>
  );
}
