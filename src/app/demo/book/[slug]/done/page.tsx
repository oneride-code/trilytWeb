"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { PublicShell } from "@/components/demo/PublicShell";
import { Btn, Note } from "@/components/demo/ui";
import { clearDraft } from "@/lib/demo/booking";
import { useDemo } from "@/lib/demo/store";
import { byId, departures, dlong, fmt, fmtDate, orderDue, orderPaid, packages, schedule } from "@/lib/demo/data";

export default function DonePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { orders, people } = useDemo();
  const [id, setId] = useState<string | null>(null);
  useEffect(() => { const t = window.setTimeout(() => { setId(new URL(window.location.href).searchParams.get("order")); clearDraft(); }, 0); return () => window.clearTimeout(t); }, []);
  const o = id ? orders.find((x) => x.id === id) : undefined;
  const p = packages.find((x) => x.slug === slug) ?? packages[0];
  if (!o) return <PublicShell step={3}><div className="h-[60vh]" /></PublicShell>;
  const dp = byId(departures, o.dep)!;
  return (
    <PublicShell step={3} title={p.name}>
      <div className="mx-auto max-w-[560px]">
        <div className="card p-6">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--d-ink)] text-[var(--d-bg)]"><Check size={18} /></span>
          <h1 className="mt-4 text-[24px] font-semibold leading-tight">You&apos;re booked, {byId(people, o.lines[0].t)?.name.split(" ")[0]}.</h1>
          <p className="mt-1 text-[14px] text-[var(--d-ink-2)]">{p.name}, {dlong(dp.start)} to {dlong(dp.end)}. {o.lines.length} traveller{o.lines.length > 1 ? "s" : ""}. Booking <span className="mono">{o.id}</span>.</p>
          <dl className="mt-5 rows card">
            {schedule(o).map((s) => <div key={s.label} className="flex items-center justify-between px-4 py-2.5 text-[13.5px]"><dt>{s.label} <span className="text-[var(--d-ink-3)]">{s.paid ? "· paid" : `· due ${fmtDate(s.due)}`}</span></dt><dd className="tnum font-medium">{fmt(s.amt)}</dd></div>)}
          </dl>
          <p className="mt-4 text-[13.5px] text-[var(--d-ink-2)]">Paid {fmt(orderPaid(o))} to Himalayan Trails Co. A WhatsApp message with your receipt and GST invoice is on its way. We&apos;ll send a payment link for the balance of {fmt(orderDue(o))} two weeks before the trip.</p>
          <div className="mt-5 flex flex-wrap gap-2"><Btn href={`/demo/book/manage/${o.id}`} variant="primary">Manage my booking</Btn><Btn href={`/demo/app/orders/${o.id}`}>See it in the operator console</Btn></div>
        </div>
        <Note><span className="text-[12.5px]">Upload your ID and sign the consent form from Manage my booking any time before departure. <Link href="/demo" className="underline">Back to the demo start</Link>.</span></Note>
      </div>
    </PublicShell>
  );
}
