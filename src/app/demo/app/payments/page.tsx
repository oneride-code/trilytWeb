"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Download, FileText, Landmark } from "lucide-react";
import { Shell, PageTitle } from "@/components/demo/Shell";
import { Avatar, Btn, Empty, Note, Pill, Stat, useCan } from "@/components/demo/ui";
import { MarkOfflineButton, SendLinkButton } from "@/components/demo/actions";
import { useDemo } from "@/lib/demo/store";
import { GST_PCT, TRILYT, byId, departures, dstr, dueItems, fee, feeParts, fmt, fmtDate, gstOf, orderPaid, orderTotal, packages, settlements } from "@/lib/demo/data";

const TABS = [["due", "Due and overdue"], ["settlements", "Settlements"], ["refunds", "Refunds"], ["invoices", "Invoices and fees"]] as const;
type Tab = (typeof TABS)[number][0];

function PaymentsInner() {
  const sp = useSearchParams(); const router = useRouter();
  const tab = (TABS.some(([k]) => k === sp.get("tab")) ? sp.get("tab") : "due") as Tab;
  const { orders, people, notify } = useDemo();
  const canRemind = useCan("Send payment link or reminder") === true;
  const canOffline = useCan("Mark payment received offline") === true;
  const canMoney = useCan("Settlements and refunds") === true;
  const month = (dt: string) => dt.startsWith("2026-10");
  const online = orders.flatMap((o) => o.payments).filter((p) => month(p.d) && !p.how.startsWith("Received offline") && !p.how.startsWith("Agent")).reduce((s, p) => s + p.amt, 0);
  const offline = orders.flatMap((o) => o.payments).filter((p) => month(p.d) && (p.how.startsWith("Received offline") || p.how.startsWith("Agent"))).reduce((s, p) => s + p.amt, 0);
  const settled = settlements.filter((s) => s.status === "settled" && month(s.d)).reduce((s, x) => s + x.amt, 0);
  const next = settlements.find((s) => s.status === "scheduled");
  const refunds = orders.filter((o) => o.refund);
  const dues = dueItems(orders);
  const overdue = dues.filter((x) => x.overdue).reduce((s, x) => s + x.amt, 0);
  const feeOrders = orders.filter((o) => o.payments.some((p) => month(p.d)));
  const fees = feeOrders.reduce((s, o) => s + fee(o), 0);
  const paidOrders = orders.filter((o) => orderPaid(o) > 0);

  return (
    <Shell title="Payments" wide>
      <PageTitle title="Payments" sub="Money goes to your own Razorpay account and your own bank. Trilyt keeps the books and does the chasing." />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Collected online, October" value={fmt(online)} note="UPI, cards, netbanking, EMI" />
        <Stat label="Collected offline, October" value={fmt(offline)} note="cash, bank transfer, agent settlements" />
        <Stat label="Still due" value={fmt(dues.reduce((s, x) => s + x.amt, 0))} accent note={overdue ? `${fmt(overdue)} overdue` : "nothing overdue"} />
        <Stat label="Next settlement" value={next ? fmt(next.amt) : "—"} note={next ? `${dstr(next.d)} · to HDFC ••4821` : ""} />
      </div>

      <div className="flex flex-wrap gap-1 border-b border-[var(--d-line)]">
        {TABS.map(([k, l]) => <button key={k} type="button" onClick={() => router.replace(`/demo/app/payments?tab=${k}`)} className={`-mb-px border-b-2 px-3 py-2 text-[13px] ${tab === k ? "border-[var(--d-ink)] font-medium text-[var(--d-ink)]" : "border-transparent text-[var(--d-ink-2)] hover:text-[var(--d-ink)]"}`}>{l}</button>)}
      </div>

      {tab === "due" && (
        <section className="card scroll-x">
          <table className="tbl">
            <thead><tr><th>Traveller</th><th>Booking</th><th>Departure</th><th>What</th><th>Due</th><th className="num">Amount</th><th></th></tr></thead>
            <tbody>
              {dues.map(({ o, amt, due, overdue: od, label }) => { const t = byId(people, o.lines[0].t); const dp = byId(departures, o.dep)!; return (
                <tr key={o.id}>
                  <td><span className="flex items-center gap-2"><Avatar name={t?.name ?? "?"} size={24} /><span className="font-medium">{t?.name}</span></span></td>
                  <td><Link href={`/demo/app/orders/${o.id}`} className="mono text-[12.5px] hover:underline">{o.id}</Link></td>
                  <td>{byId(packages, dp.pkg)!.name}<span className="block text-[11.5px] text-[var(--d-ink-3)]">{dstr(dp.start)}</span></td>
                  <td className="text-[var(--d-ink-2)]">{o.status === "pending" ? "Booking amount" : label}{o.reminders ? <span className="block text-[11.5px] text-[var(--d-ink-3)]">{o.reminders} reminder{o.reminders > 1 ? "s" : ""} sent</span> : null}</td>
                  <td>{od ? <Pill tone="bad">Overdue · {fmtDate(due)}</Pill> : <Pill tone="neutral">Due {fmtDate(due)}</Pill>}</td>
                  <td className="num font-medium">{fmt(amt)}</td>
                  <td className="text-right"><span className="flex justify-end gap-1.5">{canRemind && <SendLinkButton o={o} size="sm" />}{canOffline && <MarkOfflineButton o={o} size="sm" />}</span></td>
                </tr>
              ); })}
            </tbody>
          </table>
          {!dues.length && <Empty>Everyone is paid up.</Empty>}
          <p className="border-t border-[var(--d-line)] px-4 py-2.5 text-[12px] text-[var(--d-ink-3)]">Balances are due 14 days before departure. Automatic reminders go out 7 and 2 days before; anything here still unpaid after that is yours to chase.</p>
        </section>
      )}

      {tab === "settlements" && (canMoney ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          <section className="card scroll-x">
            <table className="tbl">
              <thead><tr><th>Date</th><th>Reference</th><th className="num">Payments</th><th className="num">Amount</th><th>Status</th></tr></thead>
              <tbody>{settlements.map((s) => <tr key={s.d + s.amt}><td>{dstr(s.d)}</td><td className="mono text-[12.5px] text-[var(--d-ink-2)]">{s.utr || "—"}</td><td className="num">{s.items}</td><td className="num font-medium">{fmt(s.amt)}</td><td>{s.status === "settled" ? <Pill tone="ink">Settled</Pill> : <Pill tone="neutral">Scheduled</Pill>}</td></tr>)}</tbody>
            </table>
            <p className="border-t border-[var(--d-line)] px-4 py-2.5 text-[12px] text-[var(--d-ink-3)]">Settled in October: <b className="tnum text-[var(--d-ink)]">{fmt(settled)}</b>. Razorpay settles T+2 to the account on file. Gateway charges are Razorpay&apos;s and the same on any software.</p>
          </section>
          <section className="card p-4">
            <p className="eyebrow">Connected account</p>
            <p className="mt-2 flex items-center gap-2 text-[14px] font-medium"><Landmark size={15} /> Himalayan Trails Co.</p>
            <dl className="mt-2 grid grid-cols-[90px_1fr] gap-y-1 text-[13px]"><dt className="text-[var(--d-ink-3)]">Gateway</dt><dd>Razorpay · merchant HTC2024</dd><dt className="text-[var(--d-ink-3)]">Bank</dt><dd>HDFC ••4821</dd><dt className="text-[var(--d-ink-3)]">Settlement</dt><dd>T+2, daily</dd><dt className="text-[var(--d-ink-3)]">Refund reserve</dt><dd className="tnum">{fmt(42000)} held by Razorpay</dd></dl>
            <Note>Trilyt creates links and refunds on your account through Razorpay&apos;s partner access. It never holds your money.</Note>
          </section>
        </div>
      ) : <Note tone="warn">Settlements are visible to the owner and accounts roles only.</Note>)}

      {tab === "refunds" && (
        <section className="card scroll-x">
          <table className="tbl">
            <thead><tr><th>Booking</th><th>Traveller</th><th>Cancelled</th><th>Basis</th><th className="num">Paid</th><th className="num">Refunded</th><th>Status</th></tr></thead>
            <tbody>{refunds.map((o) => { const t = byId(people, o.lines[0].t); const last = [...o.log].reverse().find((e) => e.what.includes("refund") || e.what.includes("Refund")); return (
              <tr key={o.id}><td><Link href={`/demo/app/orders/${o.id}`} className="mono text-[12.5px] hover:underline">{o.id}</Link></td><td className="font-medium">{t?.name}</td><td>{dstr(o.refund!.d)}</td><td className="max-w-[320px] text-[12.5px] text-[var(--d-ink-2)]">{last?.what ?? "Declined before payment"}</td><td className="num">{fmt(orderPaid(o))}</td><td className="num font-medium">{fmt(o.refund!.amt)}</td><td>{o.refund!.status === "processed" ? <Pill tone="ink">Sent</Pill> : <Pill tone="warn">Waiting for funds</Pill>}</td></tr>
            ); })}</tbody>
          </table>
          {!refunds.length && <Empty>No refunds.</Empty>}
          <p className="border-t border-[var(--d-line)] px-4 py-2.5 text-[12px] text-[var(--d-ink-3)]">Refunds within the policy go out automatically to the original payment method, 5–7 working days. Only the owner can refund more than the policy.</p>
        </section>
      )}

      {tab === "invoices" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <section className="card">
            <div className="flex items-center justify-between border-b border-[var(--d-line)] px-4 py-3"><h2 className="text-[14px] font-semibold">GST invoices to travellers</h2><Btn size="sm" onClick={() => notify("GSTR-1 export (CSV) downloaded")}><Download size={12} /> GSTR-1 export</Btn></div>
            <div className="scroll-x"><table className="tbl">
              <thead><tr><th>Invoice</th><th>Traveller</th><th className="num">Taxable</th><th className="num">GST {GST_PCT}%</th><th className="num">Total</th><th></th></tr></thead>
              <tbody>{paidOrders.slice(0, 8).map((o) => { const t = byId(people, o.lines[0].t); const total = orderTotal(o); const g = gstOf(total); return (
                <tr key={o.id}><td className="mono text-[12.5px]">HTC/26-27/{o.id.slice(3)}</td><td>{t?.name}</td><td className="num">{fmt(total - g)}</td><td className="num">{fmt(g)}</td><td className="num font-medium">{fmt(total)}</td><td className="text-right"><button type="button" className="btn btn-ghost btn-sm" onClick={() => notify(`Invoice HTC/26-27/${o.id.slice(3)} downloaded`)}><FileText size={12} /> PDF</button></td></tr>
              ); })}</tbody>
            </table></div>
            <p className="border-t border-[var(--d-line)] px-4 py-2.5 text-[12px] text-[var(--d-ink-3)]">Tour operator services at {GST_PCT}% without input credit, GSTIN 02AAACH1234K1Z5. TCS applies to overseas packages only. Your CA sees this tab too.</p>
          </section>
          <section className="card">
            <div className="flex items-center justify-between border-b border-[var(--d-line)] px-4 py-3"><h2 className="text-[14px] font-semibold">Trilyt fee · October</h2><span className="tnum text-[13.5px] font-semibold">{fmt(fees)}</span></div>
            <div className="scroll-x"><table className="tbl">
              <thead><tr><th>Booking</th><th className="num">Online, net</th><th className="num">Offline</th><th className="num">Fee</th></tr></thead>
              <tbody>{feeOrders.map((o) => { const f = feeParts(o); return <tr key={o.id}><td className="mono text-[12.5px]">{o.id}</td><td className="num">{f.online ? fmt(f.online) : <span className="text-[var(--d-ink-3)]">—</span>}</td><td className="num">{f.offline ? fmt(f.offline) : <span className="text-[var(--d-ink-3)]">—</span>}</td><td className="num font-medium">{fmt(f.total)}{(f.capped || f.offlineCapped) && <span className="ml-1 text-[11px] text-[var(--d-ink-3)]">cap</span>}</td></tr>; })}</tbody>
            </table></div>
            <p className="border-t border-[var(--d-line)] px-4 py-2.5 text-[12px] text-[var(--d-ink-3)]">{TRILYT.pct}% of what came in online, never more than {fmt(TRILYT.cap)} per order; {TRILYT.pct}% or {fmt(TRILYT.offlineCap)}, whichever is less, on what came in offline. Refunds deducted. One invoice on 1 November, paid by UPI mandate. No monthly fee.</p>
          </section>
        </div>
      )}
    </Shell>
  );
}

export default function PaymentsPage() {
  return <Suspense fallback={<Shell title="Payments"><div className="h-[60vh]" /></Shell>}><PaymentsInner /></Suspense>;
}
