"use client";

/** The traveller's side: manage a booking without calling the operator. */
import { use, useState } from "react";
import { Check, FileText, CalendarDays, Ban, CreditCard } from "lucide-react";
import { PublicShell } from "@/components/demo/PublicShell";
import { Btn, Empty, Field, Modal, Note, Pill, StatusPill } from "@/components/demo/ui";
import { useDemo } from "@/lib/demo/store";
import { TODAY, TODAY_S, byId, d, departures, dlong, dstr, fmt, fmtDate, orderDue, orderPaid, packages, policies, refundFor, ruleLabel, schedule, seatsLeft } from "@/lib/demo/data";

export default function ManagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { orders, people, recordPayment, moveOrder, cancelOrder, notify } = useDemo();
  const [modal, setModal] = useState<"pay" | "move" | "cancel" | null>(null);
  const o = orders.find((x) => x.id === id);
  if (!o) return <PublicShell><Empty>No booking {id}.</Empty></PublicShell>;
  const dp = byId(departures, o.dep)!; const p = byId(packages, dp.pkg)!;
  const lead = byId(people, o.lines[0].t); const due = orderDue(o); const rf = refundFor(o); const pol = policies[p.policy];
  const others = departures.filter((x) => x.pkg === p.id && x.id !== o.dep && d(x.start) >= TODAY && seatsLeft(x) >= o.lines.length);
  const live = o.status !== "cancelled";

  return (
    <PublicShell title="Manage my booking">
      <div className="mx-auto grid max-w-[920px] gap-6 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-5">
          <div>
            <p className="eyebrow">Booking <span className="mono">{o.id}</span></p>
            <h1 className="mt-1 text-[24px] font-semibold leading-tight">{p.name}</h1>
            <p className="text-[14px] text-[var(--d-ink-2)]">{dlong(dp.start)} to {dlong(dp.end)} · meet at {p.meet} · guide {dp.guide}</p>
            <div className="mt-2"><StatusPill s={o.status} /></div>
          </div>
          <section className="card">
            <div className="border-b border-[var(--d-line)] px-4 py-3"><h2 className="text-[14px] font-semibold">Travellers</h2></div>
            <ul className="rows">{o.lines.map((l, i) => { const t = byId(people, l.t); return <li key={i} className="flex items-center justify-between px-4 py-2.5 text-[13.5px]"><span>{t?.name}</span><span className="text-[var(--d-ink-3)]">{byId(p.options, l.opt)!.name}</span></li>; })}</ul>
          </section>
          <section className="card">
            <div className="border-b border-[var(--d-line)] px-4 py-3"><h2 className="text-[14px] font-semibold">Payments</h2></div>
            <ul className="rows">
              {schedule(o).map((s) => <li key={s.label} className="flex items-center gap-3 px-4 py-2.5 text-[13.5px]"><span className={`grid h-5 w-5 place-items-center rounded-full ${s.paid ? "bg-[var(--d-ink)] text-[var(--d-bg)]" : "border border-[var(--d-line-strong)]"}`}>{s.paid && <Check size={12} />}</span><span className="flex-1">{s.label} <span className="text-[var(--d-ink-3)]">{s.paid ? "paid" : `due ${fmtDate(s.due)}`}</span></span><span className="tnum">{fmt(s.amt)}</span></li>)}
              {o.refund && <li className="flex items-center justify-between px-4 py-2.5 text-[13.5px] text-[var(--d-bad)]"><span>Refund to your {o.payments[0]?.how.split("· ")[1] ?? "payment method"} · {o.refund.status}</span><span className="tnum">{fmt(o.refund.amt)}</span></li>}
            </ul>
            {live && due > 0 && <div className="flex items-center justify-between border-t border-[var(--d-line)] px-4 py-3"><span className="text-[13.5px]">Balance due <b className="tnum">{fmt(due)}</b></span><Btn variant="accent" onClick={() => setModal("pay")}><CreditCard size={13} /> Pay now</Btn></div>}
          </section>
          <section className="card">
            <div className="border-b border-[var(--d-line)] px-4 py-3"><h2 className="text-[14px] font-semibold">Documents</h2></div>
            <ul className="rows">{o.docs.map((dc) => <li key={dc.name} className="flex items-center gap-3 px-4 py-2.5 text-[13.5px]"><FileText size={14} className="text-[var(--d-ink-3)]" /><span className="flex-1">{dc.name}</span>{dc.status === "missing" ? <Btn size="sm" onClick={() => notify("Upload (demo): the operator sees it on your booking")}>Upload</Btn> : <Pill tone="neutral">{dc.status === "signed" ? "Signed" : "Uploaded"}</Pill>}</li>)}</ul>
          </section>
        </div>

        <aside className="flex flex-col gap-3 lg:sticky lg:top-20 lg:self-start">
          <div className="card p-4">
            <p className="eyebrow">Paid so far</p><p className="tnum text-[24px] font-semibold leading-none">{fmt(orderPaid(o))}</p>
            <p className="mt-1 text-[12.5px] text-[var(--d-ink-3)]">to Himalayan Trails Co.</p>
          </div>
          {live && (
            <div className="card flex flex-col gap-2 p-3">
              <Btn onClick={() => setModal("move")} disabled={!others.length}><CalendarDays size={13} /> Move to another date</Btn>
              <Btn onClick={() => notify("GST invoice PDF downloaded")}><FileText size={13} /> GST invoice</Btn>
              <Btn variant="danger" onClick={() => setModal("cancel")}><Ban size={13} /> Cancel booking</Btn>
            </div>
          )}
          <Note><span className="text-[12.5px]">Cancellation, {pol.name.toLowerCase()} policy: {pol.rules.map((r, i) => `${ruleLabel(pol.rules, i).toLowerCase()} ${r[1]}%`).join(" · ")}. Today is {rf.days} days before departure.</span></Note>
        </aside>
      </div>

      {modal === "pay" && (
        <Modal title={`Pay balance ${fmt(due)}`} onClose={() => setModal(null)} footer={<><Btn onClick={() => setModal(null)}>Later</Btn><Btn variant="accent" onClick={() => { recordPayment(o.id, { d: TODAY_S, amt: due, how: "Payment link · UPI", ref: "pay_R1a2" }); setModal(null); notify(`Paid ${fmt(due)} · receipt sent on WhatsApp`); }}>Pay {fmt(due)} by UPI</Btn></>}>
          <Field label="UPI ID"><input className="input" defaultValue="aarav@okbank" /></Field>
          <Note>Goes straight to the operator&apos;s Razorpay account. You can also pay part of it; the rest stays due.</Note>
        </Modal>
      )}
      {modal === "move" && (
        <Modal title="Move to another date" onClose={() => setModal(null)} footer={<><Btn onClick={() => setModal(null)}>Keep my date</Btn><Btn variant="primary" onClick={() => { moveOrder(o.id, others[0].id); setModal(null); notify(`Moved to ${dstr(others[0].start)}`); }}>Move to {dstr(others[0]?.start ?? "")}</Btn></>}>
          <Field label="New departure"><select className="select" defaultValue={others[0]?.id}>{others.map((x) => <option key={x.id} value={x.id}>{dstr(x.start)} – {dstr(x.end)} · {seatsLeft(x)} seats</option>)}</select></Field>
          <Note>Same price, nothing to pay. Allowed until 7 days before departure; after that it counts as a cancellation.</Note>
        </Modal>
      )}
      {modal === "cancel" && (
        <Modal title="Cancel this booking" onClose={() => setModal(null)} footer={<><Btn onClick={() => setModal(null)}>Keep my booking</Btn><Btn variant="danger" onClick={() => { const r = cancelOrder(o.id, 0, lead?.name ?? "Traveller"); setModal(null); notify(`Cancelled · ${fmt(r.refund)} on its way back to you`); }}>Cancel and refund {fmt(rf.refund)}</Btn></>}>
          <div className="card-2 p-3.5"><dl className="grid grid-cols-[150px_1fr] gap-x-4 gap-y-1.5 text-[13.5px]"><dt className="text-[var(--d-ink-3)]">Days before start</dt><dd className="tnum">{rf.days}</dd><dt className="text-[var(--d-ink-3)]">Policy</dt><dd>{pol.name}: {rf.pct}% kept ({fmt(rf.charge)})</dd><dt className="text-[var(--d-ink-3)]">You paid</dt><dd className="tnum">{fmt(orderPaid(o))}</dd><dt className="text-[var(--d-ink-3)]">Refund</dt><dd className="tnum font-semibold">{fmt(rf.refund)} to your original payment method, 5–7 working days</dd></dl></div>
          <Note tone="warn">No one has to approve this. The refund is issued the moment you confirm.</Note>
        </Modal>
      )}
    </PublicShell>
  );
}
