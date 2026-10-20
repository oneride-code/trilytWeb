"use client";

import Link from "next/link";
import { Shell, PageTitle } from "@/components/demo/Shell";
import { Btn, Note, Pill } from "@/components/demo/ui";
import { useDemo } from "@/lib/demo/store";
import { GST_PCT, policies, ruleLabel } from "@/lib/demo/data";

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="grid grid-cols-[160px_1fr] gap-3 px-4 py-2.5 text-[13.5px]"><span className="text-[var(--d-ink-3)]">{k}</span><span className="min-w-0">{v}</span></div>;
}

export default function SettingsPage() {
  const { notify } = useDemo();
  return (
    <Shell title="Settings">
      <PageTitle title="Settings" sub="Your business, your payment account, your policies and channels." />
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card"><div className="border-b border-[var(--d-line)] px-4 py-3"><h2 className="text-[14px] font-semibold">Business</h2></div><div className="rows">
          <Row k="Operator" v="Himalayan Trails Co." /><Row k="GSTIN" v={<span className="mono">02AAACH1234K1Z5</span>} /><Row k="GST on services" v={`${GST_PCT}% without input credit (tour operator)`} /><Row k="Office" v="Mall Road, Shimla" /><Row k="Booking page" v={<Link href="/demo/book/spiti-valley-circuit" className="underline">himalayantrails.in/book</Link>} />
        </div></section>
        <section className="card"><div className="border-b border-[var(--d-line)] px-4 py-3"><h2 className="text-[14px] font-semibold">Payment account</h2></div><div className="rows">
          <Row k="Gateway" v={<span className="flex items-center gap-2">Razorpay · HTC2024 <Pill tone="ink">Connected</Pill></span>} /><Row k="Settles to" v="HDFC ••4821, T+2" /><Row k="Methods" v="UPI, cards, netbanking, EMI, pay-later" /><Row k="Refunds" v="Automatic within policy, to original method" /><Row k="Access" v="Trilyt partner access: create links and refunds, read settlements. Revoke any time." />
        </div></section>
        <section className="card"><div className="flex items-center justify-between border-b border-[var(--d-line)] px-4 py-3"><h2 className="text-[14px] font-semibold">Cancellation policies</h2><Btn size="sm" onClick={() => notify("Policy editor (demo)")}>Edit</Btn></div><div className="rows">
          {(Object.keys(policies) as (keyof typeof policies)[]).map((k) => <Row key={k} k={policies[k].name} v={policies[k].rules.map((r, i) => `${ruleLabel(policies[k].rules, i)}: ${r[1]}%`).join(" · ")} />)}
        </div><p className="border-t border-[var(--d-line)] px-4 py-2.5 text-[12px] text-[var(--d-ink-3)]">Each package picks one. Shown as sentences on the booking page, accepted at checkout.</p></section>
        <section className="card"><div className="border-b border-[var(--d-line)] px-4 py-3"><h2 className="text-[14px] font-semibold">Channels and messages</h2></div><div className="rows">
          <Row k="WhatsApp" v="+91 98xxx 00100 · Business API, templates approved" /><Row k="SMS" v="DLT registered · HTRAIL" /><Row k="Reminders" v="Booking confirmation; balance 7 and 2 days before due; pickup details the evening before" /><Row k="Instagram, website" v="Booking links on both" /><Row k="Trilyt marketplace" v={<span className="text-[var(--d-ink-2)]">Later. Trilyt as one more channel, same console.</span>} />
        </div></section>
      </div>
      <Note>Team and roles moved to <Link href="/demo/app/team" className="underline">their own page</Link>.</Note>
    </Shell>
  );
}
