"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Shell, PageTitle } from "@/components/demo/Shell";
import { Btn, Meter, Note, Stat, StatusPill } from "@/components/demo/ui";
import { NewBookingButton } from "@/components/demo/actions";
import { useDemo } from "@/lib/demo/store";
import { agents, byId, departures, dstr, fmt, orderTotal, packages } from "@/lib/demo/data";

export default function AgentsPage() {
  const { orders, people, role, notify } = useDemo();
  const agentOrders = orders.filter((o) => o.agent);
  const me = agents[0];
  if (role === "agent") {
    const mine = orders.filter((o) => o.agent === me.id);
    const confirmed = mine.filter((o) => o.status === "part" || o.status === "paid");
    const earned = confirmed.reduce((s, o) => s + (orderTotal(o) * me.commission) / 100, 0);
    const pendingEarn = mine.filter((o) => o.status === "pending").reduce((s, o) => s + (orderTotal(o) * me.commission) / 100, 0);
    return (
      <Shell title="Hilltop Travels" actions={<NewBookingButton primary />}>
        <PageTitle title={`${me.name} · agent account`} sub={`You sell Himalayan Trails Co. packages at net rate. Your commission is ${me.commission}%. Orders are confirmed by the operator within 24 hours.`} />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Earned this season" value={fmt(earned)} accent note={pendingEarn ? `${fmt(pendingEarn)} more once pending orders are confirmed` : `${me.commission}% on ${confirmed.length} confirmed orders`} />
          <Stat label="Credit limit" value={fmt(me.credit)} note={<span className="block pt-1"><Meter value={me.used} max={me.credit} /></span>} />
          <Stat label="Credit used" value={fmt(me.used)} note={`${fmt(me.credit - me.used)} available`} />
          <Stat label="Orders this season" value={String(me.orders)} note="net-rate invoices issued to you" />
        </div>
        <section className="card scroll-x">
          <div className="border-b border-[var(--d-line)] px-4 py-3"><h2 className="text-[14px] font-semibold">Net rates</h2></div>
          <table className="tbl"><thead><tr><th>Package</th><th>Option</th><th className="num">Retail</th><th className="num">Your net rate</th><th className="num">You earn</th></tr></thead>
            <tbody>{packages.flatMap((p) => p.options.map((o) => <tr key={p.id + o.id}><td className="font-medium">{p.name}</td><td className="text-[var(--d-ink-2)]">{o.name}</td><td className="num">{fmt(o.price)}</td><td className="num font-medium">{fmt(o.price * (1 - me.commission / 100))}</td><td className="num text-[var(--d-accent-ink)]">{fmt((o.price * me.commission) / 100)}</td></tr>))}</tbody></table>
        </section>
        <section className="card">
          <div className="flex items-center justify-between border-b border-[var(--d-line)] px-4 py-3"><h2 className="text-[14px] font-semibold">Your orders</h2><span className="text-[12px] text-[var(--d-ink-3)]">retail · your commission</span></div>
          <ul className="rows">{mine.map((o) => { const dp = byId(departures, o.dep)!; return <li key={o.id}><Link href={`/demo/app/orders/${o.id}`} className="row-hover flex items-center gap-3 px-4 py-3"><span className="mono text-[12.5px]">{o.id}</span><span className="min-w-0 flex-1 truncate text-[13.5px]">{byId(people, o.lines[0].t)?.name}{o.lines.length > 1 ? ` +${o.lines.length - 1}` : ""} · {byId(packages, dp.pkg)!.name} · {dstr(dp.start)}</span><span className="tnum text-[13.5px]">{fmt(orderTotal(o))} <span className={o.status === "pending" ? "text-[var(--d-ink-3)]" : "text-[var(--d-accent-ink)]"}>· {fmt((orderTotal(o) * me.commission) / 100)}{o.status === "pending" ? " pending" : ""}</span></span><StatusPill s={o.status} /></Link></li>; })}</ul>
        </section>
      </Shell>
    );
  }
  return (
    <Shell title="Agents" actions={role === "owner" && <Btn variant="primary" onClick={() => notify("Agent invite sent")}><Plus size={14} /> Agent</Btn>} wide>
      <PageTitle title="Agents" sub="Travel agents who sell your departures. Each has a login, a commission, a credit limit and net-rate invoices. Their orders wait for your confirmation." />
      <section className="card scroll-x">
        <table className="tbl">
          <thead><tr><th>Agent</th><th>Contact</th><th className="num">Commission</th><th style={{ width: 240 }}>Credit</th><th className="num">Orders</th><th className="num">Commission earned</th><th></th></tr></thead>
          <tbody>{agents.map((a) => { const earned = orders.filter((o) => o.agent === a.id && (o.status === "part" || o.status === "paid")).reduce((s, o) => s + (orderTotal(o) * a.commission) / 100, 0); return (
            <tr key={a.id}><td className="font-medium">{a.name}<span className="block text-[11.5px] text-[var(--d-ink-3)]">{a.city}</span></td><td className="text-[var(--d-ink-2)]">{a.contact}</td><td className="num">{a.commission}%</td><td><span className="flex items-center gap-3"><span className="flex-1"><Meter value={a.used} max={a.credit} /></span><span className="tnum text-[12.5px]">{fmt(a.used)} / {fmt(a.credit)}</span></span></td><td className="num">{a.orders}</td><td className="num">{fmt(earned)}</td><td className="text-right">{role === "owner" && <button type="button" className="btn btn-ghost btn-sm" onClick={() => notify("Agent settings (demo)")}>Edit</button>}</td></tr>
          ); })}</tbody>
        </table>
      </section>
      <section className="card">
        <div className="border-b border-[var(--d-line)] px-4 py-3"><h2 className="text-[14px] font-semibold">Agent orders</h2></div>
        <ul className="rows">{agentOrders.map((o) => { const dp = byId(departures, o.dep)!; const a = byId(agents, o.agent!)!; return <li key={o.id}><Link href={`/demo/app/orders/${o.id}`} className="row-hover flex items-center gap-3 px-4 py-3"><span className="mono text-[12.5px]">{o.id}</span><span className="min-w-0 flex-1 truncate text-[13.5px]">{a.name} · {byId(people, o.lines[0].t)?.name}{o.lines.length > 1 ? ` +${o.lines.length - 1}` : ""} · {byId(packages, dp.pkg)!.name} · {dstr(dp.start)}</span><span className="tnum text-[13.5px]">{fmt(orderTotal(o))} <span className="text-[var(--d-ink-3)]">net {fmt(orderTotal(o) * (1 - a.commission / 100))}</span></span><StatusPill s={o.status} /></Link></li>; })}</ul>
      </section>
      <Note>Agents never see your traveller list or your other agents. Switch the viewer to Agent at the top right to see their side.</Note>
    </Shell>
  );
}
