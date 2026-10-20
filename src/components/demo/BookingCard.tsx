"use client";

/**
 * One card per booking, with every action on it. Used as the right-hand panel
 * over the bookings list and as the full page at /demo/app/orders/[id].
 */
import Link from "next/link";
import { Check, FileText, Phone } from "lucide-react";
import { Avatar, Btn, Note, Pill, StatusPill, useCan } from "./ui";
import { AddTravellerButton, CancelButton, MarkOfflineButton, MoveDateButton, SendLinkButton } from "./actions";
import { useDemo, SOURCE_LABEL } from "@/lib/demo/store";
import { agents, byId, daysUntil, depOf, dlong, dstr, fee, fmt, fmtDate, gstOf, orderDue, orderPaid, orderTotal, pkgOf, policies, refundFor, ruleLabel, schedule, type Order } from "@/lib/demo/data";

export function BookingCard({ o, compact = false }: { o: Order; compact?: boolean }) {
  const { people, confirmOrder, declineOrder, notify, role } = useDemo();
  const dep = depOf(o); const p = pkgOf(o);
  const total = orderTotal(o), paid = orderPaid(o), due = orderDue(o);
  const rf = refundFor(o); const sch = schedule(o);
  const canPay = useCan("Send payment link or reminder") === true;
  const canOffline = useCan("Mark payment received offline") === true;
  const canEdit = useCan("Move date, add or remove a traveller");
  const canCancel = useCan("Cancel and refund within policy") === true;
  const money = useCan("See who paid what") !== false;
  const agent = o.agent ? byId(agents, o.agent) : undefined;
  const live = o.status !== "cancelled";

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2"><StatusPill s={o.status} /><span className="text-[12.5px] text-[var(--d-ink-3)]">via {SOURCE_LABEL[o.source]}{o.sourceNote ? ` · ${o.sourceNote}` : ""} · {dlong(o.created)}</span></div>
          <h2 className="mt-1.5 text-[18px] font-semibold leading-tight">{p.name}</h2>
          <p className="text-[13.5px] text-[var(--d-ink-2)]"><Link href={`/demo/app/departures/${dep.id}`} className="underline-offset-2 hover:underline">{dstr(dep.start)} – {dstr(dep.end)}</Link> · guide {dep.guide} · {daysUntil(dep.start) >= 0 ? `in ${daysUntil(dep.start)} days` : "departed"}</p>
        </div>
        {money && <div className="text-right"><p className="eyebrow">{due > 0 && live ? "Balance due" : "Total"}</p><p className={`tnum text-[22px] font-semibold leading-none ${due > 0 && live ? "text-[var(--d-accent-ink)]" : ""}`}>{fmt(due > 0 && live ? due : total)}</p></div>}
      </div>

      {o.status === "pending" && agent && (
        <Note tone="warn">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span><b>{agent.name}</b> placed this at net rate ({agent.commission}% commission). Credit used {fmt(agent.used)} of {fmt(agent.credit)}. Confirm to hold the seats.</span>
            {(role === "owner" || role === "ops") && <span className="flex gap-2"><Btn size="sm" variant="primary" onClick={() => { confirmOrder(o.id); notify("Confirmed · seats held · agent invoiced at net rate"); }}><Check size={13} /> Confirm</Btn><Btn size="sm" onClick={() => { declineOrder(o.id); notify("Declined · agent notified"); }}>Decline</Btn></span>}
          </div>
        </Note>
      )}

      {/* Travellers */}
      <section>
        <div className="mb-2 flex items-center justify-between"><p className="eyebrow">Travellers</p>{live && canEdit && <AddTravellerButton o={o} size="sm" />}</div>
        <div className="rows card">
          {o.lines.map((l, i) => { const t = byId(people, l.t); const opt = byId(p.options, l.opt)!; return (
            <div key={i} className="flex items-center gap-3 px-3.5 py-2.5">
              <Avatar name={t?.name ?? "?"} size={30} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-medium">{t ? <Link href={`/demo/app/travellers/${t.id}`} className="hover:underline">{t.name}</Link> : "Unknown"}{t?.medical && <span className="ml-2 text-[12px] text-[var(--d-warn)]">· {t.medical}</span>}</p>
                <p className="text-[12px] text-[var(--d-ink-3)]">{opt.name}{t?.phone ? ` · ${t.phone}` : ""}{o.pickup ? ` · pickup ${o.pickup}` : ""}</p>
              </div>
              {money && <span className="tnum text-[13.5px]">{fmt(opt.price)}</span>}
            </div>
          ); })}
          {o.addons.map((a) => { const ad = p.addons.find((x) => x.name === a)!; return (
            <div key={a} className="flex items-center justify-between px-3.5 py-2 text-[13px] text-[var(--d-ink-2)]"><span>{a} <span className="text-[var(--d-ink-3)]">× {ad.per === "traveller" ? o.lines.length : 1}</span></span>{money && <span className="tnum">{fmt(ad.price * (ad.per === "traveller" ? o.lines.length : 1))}</span>}</div>
          ); })}
          {money && <div className="flex items-center justify-between px-3.5 py-2 text-[13.5px] font-medium"><span>Total <span className="font-normal text-[var(--d-ink-3)]">incl. GST {fmt(gstOf(total))}</span></span><span className="tnum">{fmt(total)}</span></div>}
        </div>
      </section>

      {/* Schedule and payments */}
      {money && <div className={`grid gap-5 ${compact ? "" : "lg:grid-cols-2"}`}>
        <section>
          <p className="eyebrow mb-2">Payment schedule</p>
          <div className="rows card">
            {sch.map((s) => (
              <div key={s.label} className="flex items-center gap-3 px-3.5 py-2.5 text-[13.5px]">
                <span className={`grid h-5 w-5 place-items-center rounded-full ${s.paid ? "bg-[var(--d-ink)] text-[var(--d-bg)]" : s.overdue ? "bg-[var(--d-bad)] text-white" : "border border-[var(--d-line-strong)]"}`}>{s.paid && <Check size={12} />}</span>
                <span className="flex-1">{s.label}<span className="ml-2 text-[12px] text-[var(--d-ink-3)]">{s.paid ? "paid" : s.overdue ? `overdue since ${fmtDate(s.due)}` : `due ${fmtDate(s.due)}`}</span></span>
                <span className="tnum">{fmt(s.amt)}</span>
              </div>
            ))}
            {o.reminders > 0 && <p className="px-3.5 py-2 text-[12px] text-[var(--d-ink-3)]">{o.reminders} reminder{o.reminders > 1 ? "s" : ""} sent on WhatsApp</p>}
          </div>
        </section>
        <section>
          <p className="eyebrow mb-2">Payments received</p>
          <div className="rows card">
            {o.payments.map((pm, i) => (
              <div key={i} className="flex items-center gap-3 px-3.5 py-2.5 text-[13.5px]">
                <span className="flex-1">{pm.how}<span className="ml-2 mono text-[11.5px] text-[var(--d-ink-3)]">{pm.ref}</span></span>
                <span className="text-[12px] text-[var(--d-ink-3)]">{dstr(pm.d)}</span><span className="tnum w-20 text-right">{fmt(pm.amt)}</span>
              </div>
            ))}
            {o.refund && <div className="flex items-center gap-3 px-3.5 py-2.5 text-[13.5px] text-[var(--d-bad)]"><span className="flex-1">Refund to original method · {o.refund.status}</span><span className="text-[12px]">{dstr(o.refund.d)}</span><span className="tnum w-20 text-right">−{fmt(o.refund.amt)}</span></div>}
            {!o.payments.length && <p className="px-3.5 py-3 text-[13px] text-[var(--d-ink-3)]">Nothing received yet</p>}
            <div className="flex items-center justify-between px-3.5 py-2 text-[12.5px] text-[var(--d-ink-3)]"><span>Trilyt fee on this order</span><span className="tnum">{fmt(fee(o))}</span></div>
          </div>
        </section>
      </div>}

      {/* Documents and policy */}
      <div className={`grid gap-5 ${compact ? "" : "lg:grid-cols-2"}`}>
        <section>
          <p className="eyebrow mb-2">Documents</p>
          <div className="rows card">
            {o.docs.map((dc) => (
              <div key={dc.name} className="flex items-center gap-3 px-3.5 py-2.5 text-[13.5px]"><FileText size={14} className="text-[var(--d-ink-3)]" /><span className="flex-1">{dc.name}</span>{dc.status === "missing" ? <Pill tone="warn">Missing</Pill> : <Pill tone="neutral">{dc.status === "signed" ? "Signed" : "Uploaded"}</Pill>}</div>
            ))}
            {o.docs.some((x) => x.status === "missing") && live && <div className="px-3.5 py-2"><Btn size="sm" onClick={() => notify("Form link sent on WhatsApp")}><Phone size={12} /> Ask for missing documents</Btn></div>}
          </div>
        </section>
        {money && <section>
          <p className="eyebrow mb-2">If cancelled today · {policies[p.policy].name} policy</p>
          <div className="card px-3.5 py-3 text-[13.5px]">
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12.5px] text-[var(--d-ink-2)]">{policies[p.policy].rules.map((r, i) => <span key={i} className={rf.pct === r[1] && live ? "font-semibold text-[var(--d-ink)]" : ""}>{ruleLabel(policies[p.policy].rules, i)}: {r[1]}%</span>)}</div>
            {live ? <p className="mt-2">{rf.days} days before departure → <b>{rf.pct}% charged</b> ({fmt(rf.charge)}), refund <b className="tnum">{fmt(rf.refund)}</b> goes out automatically.</p> : <p className="mt-2 text-[var(--d-ink-2)]">Cancelled. Refund {fmt(o.refund?.amt ?? 0)} {o.refund?.status}.</p>}
          </div>
        </section>}
      </div>

      {/* Activity log */}
      <section>
        <p className="eyebrow mb-2">Activity</p>
        <ol className="card px-3.5 py-1">
          {[...o.log].reverse().map((e, i) => (
            <li key={i} className="flex gap-3 border-b border-[var(--d-line)] py-2.5 text-[13px] last:border-0">
              <span className="mono w-[108px] shrink-0 text-[11.5px] text-[var(--d-ink-3)]">{e.at}</span>
              <span className="min-w-0"><b className="font-medium">{e.who}</b> <span className="text-[var(--d-ink-2)]">{e.what}</span></span>
            </li>
          ))}
        </ol>
      </section>

      {/* Actions */}
      {live && (canPay || canOffline || canEdit || canCancel) && (
        <div className="flex flex-wrap gap-2 border-t border-[var(--d-line)] pt-4">
          {due > 0 && canPay && <SendLinkButton o={o} />}
          {due > 0 && canOffline && <MarkOfflineButton o={o} />}
          {canEdit && <MoveDateButton o={o} />}
          {paid > 0 && <Btn onClick={() => notify("GST invoice PDF downloaded")}><FileText size={13} /> GST invoice</Btn>}
          {canCancel && <span className="ml-auto"><CancelButton o={o} /></span>}
        </div>
      )}
    </div>
  );
}
