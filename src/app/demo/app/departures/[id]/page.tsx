"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Check, Download, Printer, UserX, MessageCircle, MapPin, Phone } from "lucide-react";
import { Shell } from "@/components/demo/Shell";
import { Avatar, Btn, Empty, Meter, Pill, Stat, useCan } from "@/components/demo/ui";
import { CloseDepartureButton, NewBookingButton } from "@/components/demo/actions";
import { useDemo } from "@/lib/demo/store";
import { byId, daysUntil, departures, dlong, dstr, fmt, orderDue, orderPaid, packages, seatsLeft, type CheckState } from "@/lib/demo/data";

export default function DeparturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { orders, people, checkIn, notify, role, closed } = useDemo();
  const [view, setView] = useState<"guide" | "office">(role === "guide" ? "guide" : "office");
  const dp = byId(departures, id);
  const canClose = useCan("Close a departure and refund everyone") === true;
  if (!dp) return <Shell title="Departure" crumb={{ href: "/demo/app/departures", label: "Departures" }}><Empty>No departure {id}.</Empty></Shell>;
  const p = byId(packages, dp.pkg)!;
  const os = orders.filter((o) => o.dep === dp.id && o.status !== "cancelled");
  const rows = os.flatMap((o) => o.lines.map((l) => ({ o, t: byId(people, l.t), opt: byId(p.options, l.opt)! })));
  const checked = rows.filter((r) => r.o.checkin[r.t?.id ?? ""] === "in").length;
  const noshow = rows.filter((r) => r.o.checkin[r.t?.id ?? ""] === "noshow").length;
  const col = os.reduce((s, o) => s + orderPaid(o), 0), due = os.reduce((s, o) => s + orderDue(o), 0);
  const isClosed = closed.includes(dp.id);
  const soon = daysUntil(dp.start) <= 7 && daysUntil(dp.start) >= 0;
  const toggle = (o: typeof os[number], tid: string, s: CheckState) => checkIn(o.id, tid, o.checkin[tid] === s ? null : s);

  return (
    <Shell title={`${p.name} · ${dstr(dp.start)}`} crumb={{ href: "/demo/app/departures", label: "Departures" }}
      actions={<><Btn onClick={() => notify("Manifest PDF downloaded")}><Download size={13} /> Manifest</Btn>{(role === "owner" || role === "ops") && !isClosed && <NewBookingButton />}</>}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{p.type} · {p.days} · guide {dp.guide}</p>
          <h1 className="mt-1 text-[22px] font-semibold leading-tight">{p.name}</h1>
          <p className="mt-0.5 text-[13.5px] text-[var(--d-ink-2)]">{dlong(dp.start)} to {dlong(dp.end)} · {daysUntil(dp.start) >= 0 ? `departs in ${daysUntil(dp.start)} days` : "departed"} · booking cut-off {dstr(dp.cutoff)}</p>
          <p className="mt-1 flex items-center gap-1.5 text-[13px] text-[var(--d-ink-2)]"><MapPin size={13} /> Meet: {p.meet}</p>
        </div>
        <div className="flex items-center gap-2">
          {isClosed ? <Pill tone="bad">Closed · everyone refunded</Pill> : seatsLeft(dp) <= 0 ? <Pill tone="ink">Full</Pill> : <Pill tone="neutral">{seatsLeft(dp)} seats open</Pill>}
          {canClose && !isClosed && os.length > 0 && <CloseDepartureButton depId={dp.id} />}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Seats" value={`${dp.booked} / ${dp.seats}`} note={<span className="block pt-1"><Meter value={dp.booked} max={dp.seats} /></span>} />
        <Stat label="Checked in" value={`${checked} / ${rows.length}`} note={noshow ? `${noshow} no-show` : soon ? "tap each name at the meeting point" : "opens on the day"} />
        {role === "guide" ? <>
          <Stat label="Pickups" value={String(new Set(rows.map((r) => r.o.pickup ?? p.meet.split(",")[0])).size)} note="points on the way" />
          <Stat label="Medical notes" value={String(rows.filter((r) => r.t?.medical).length)} note="read before you leave" />
        </> : <>
          <Stat label="Collected" value={fmt(col)} note={`${os.length} bookings`} />
          <Stat label="Still due" value={due ? fmt(due) : "—"} accent={due > 0} note={due ? "collect before boarding or send the link" : "everyone is paid up"} />
        </>}
      </div>

      <section className="card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--d-line)] px-4 py-3">
          <h2 className="text-[14px] font-semibold">Manifest</h2>
          {role !== "guide" && <div className="flex items-center gap-1 rounded-md border border-[var(--d-line)] p-0.5 text-[12.5px]">
            {(["guide", "office"] as const).map((v) => <button key={v} type="button" onClick={() => setView(v)} className={`rounded px-2.5 py-1 ${view === v ? "bg-[var(--d-ink)] text-[var(--d-bg)]" : "text-[var(--d-ink-2)]"}`}>{v === "guide" ? "Guide view" : "Office view"}</button>)}
          </div>}
          <div className="flex gap-2"><Btn size="sm" onClick={() => notify(`Pickup details sent to ${rows.length} travellers on WhatsApp`)}><MessageCircle size={12} /> Message everyone</Btn><Btn size="sm" onClick={() => notify("Print view opened")}><Printer size={12} /> Print</Btn></div>
        </div>
        {rows.length ? (
          <div className="scroll-x">
            <table className="tbl">
              <thead><tr><th style={{ width: 36 }}>#</th><th>Traveller</th><th>Pickup</th>{view === "guide" ? <><th>Medical / notes</th><th>Emergency contact</th></> : <><th>Option</th><th>Booking</th><th className="num">Paid</th><th className="num">Due</th></>}<th style={{ width: 170 }}>Check-in</th></tr></thead>
              <tbody>
                {rows.map((r, i) => { const tid = r.t?.id ?? ""; const st = r.o.checkin[tid]; const dueO = orderDue(r.o); return (
                  <tr key={r.o.id + tid} className={st === "noshow" ? "opacity-60" : ""}>
                    <td className="tnum text-[var(--d-ink-3)]">{i + 1}</td>
                    <td><span className="flex items-center gap-2"><Avatar name={r.t?.name ?? "?"} size={24} /><span><span className="block font-medium">{r.t?.name}</span><span className="flex items-center gap-1 text-[11.5px] text-[var(--d-ink-3)]"><Phone size={10} />{r.t?.phone}</span></span></span></td>
                    <td className="text-[var(--d-ink-2)]">{r.o.pickup ?? p.meet.split(",")[0]}</td>
                    {view === "guide" ? <>
                      <td className={r.t?.medical ? "text-[var(--d-warn)]" : "text-[var(--d-ink-3)]"}>{r.t?.medical ?? "—"}</td>
                      <td className="text-[var(--d-ink-2)]">{r.t?.emergency ?? "—"}</td>
                    </> : <>
                      <td className="text-[var(--d-ink-2)]">{r.opt.name}</td>
                      <td><Link href={`/demo/app/orders/${r.o.id}`} className="mono text-[12.5px] hover:underline">{r.o.id}</Link><span className="block text-[11.5px] text-[var(--d-ink-3)]">{r.o.source}</span></td>
                      <td className="num">{fmt(orderPaid(r.o))}</td>
                      <td className={`num ${dueO ? "font-medium text-[var(--d-accent-ink)]" : "text-[var(--d-ink-3)]"}`}>{dueO ? fmt(dueO) : "—"}</td>
                    </>}
                    <td>
                      <span className="flex gap-1">
                        <button type="button" onClick={() => toggle(r.o, tid, "in")} className={`btn btn-sm ${st === "in" ? "btn-primary" : ""}`} aria-pressed={st === "in"}><Check size={12} /> In</button>
                        <button type="button" onClick={() => toggle(r.o, tid, "noshow")} className={`btn btn-sm ${st === "noshow" ? "btn-danger" : "btn-ghost"}`} aria-pressed={st === "noshow"}><UserX size={12} /> No show</button>
                      </span>
                    </td>
                  </tr>
                ); })}
              </tbody>
            </table>
          </div>
        ) : <Empty>{isClosed ? "Departure closed. All bookings were refunded in full." : "No bookings yet."}</Empty>}
        <p className="border-t border-[var(--d-line)] px-4 py-2.5 text-[12px] text-[var(--d-ink-3)]">{role === "guide" ? "Check-ins sync to the office as they happen. Balances and payments are handled by the office." : "Guide view hides money and shows what the guide needs on the road. Check-ins sync to the office as they happen."}</p>
      </section>
    </Shell>
  );
}
