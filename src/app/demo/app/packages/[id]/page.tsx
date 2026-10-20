"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Pencil } from "lucide-react";
import { Shell } from "@/components/demo/Shell";
import { Btn, Empty, Meter, Pill } from "@/components/demo/ui";
import { useDemo } from "@/lib/demo/store";
import { TODAY, byId, d, departures, dstr, fmt, packages, policies, ruleLabel, seatsLeft } from "@/lib/demo/data";

export default function PackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { notify, role } = useDemo();
  const p = byId(packages, id);
  if (!p) return <Shell title="Package" crumb={{ href: "/demo/app/packages", label: "Packages" }}><Empty>No package {id}.</Empty></Shell>;
  const pol = policies[p.policy];
  const deps = departures.filter((x) => x.pkg === p.id).sort((a, b) => d(a.start).getTime() - d(b.start).getTime());
  return (
    <Shell title={p.name} crumb={{ href: "/demo/app/packages", label: "Packages" }} actions={<><Btn href={`/demo/book/${p.slug}`}><ExternalLink size={13} /> Booking page</Btn>{(role === "owner" || role === "ops") && <Btn variant="primary" onClick={() => notify(role === "owner" ? "Package editor (demo)" : "Package editor (demo) · prices and policy are locked for ops")}><Pencil size={13} /> Edit</Btn>}</>}>
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-4">
            <span className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md border border-[var(--d-line)]"><Image src={p.image} alt="" fill sizes="112px" className="object-cover" /></span>
            <div><p className="eyebrow">{p.type} · {p.region} · {p.days}</p><h1 className="mt-1 text-[22px] font-semibold leading-tight">{p.name}</h1><p className="mt-0.5 text-[13.5px] text-[var(--d-ink-2)]">{p.tagline}</p><p className="mt-1 text-[12.5px] text-[var(--d-ink-3)]">Meeting point: {p.meet}</p></div>
          </div>

          <section className="card">
            <div className="border-b border-[var(--d-line)] px-4 py-3"><h2 className="text-[14px] font-semibold">Price options</h2></div>
            <table className="tbl"><thead><tr><th>Option</th><th className="num">Price per traveller</th><th className="num">Booking amount</th><th className="num">Balance</th></tr></thead>
              <tbody>{p.options.map((o) => <tr key={o.id}><td className="font-medium">{o.name}</td><td className="num">{fmt(o.price)}</td><td className="num">{fmt(p.booking)}</td><td className="num text-[var(--d-ink-2)]">{fmt(o.price - p.booking)} · 14 days before</td></tr>)}</tbody></table>
            {p.addons.length > 0 && <><div className="border-y border-[var(--d-line)] px-4 py-2 text-[12px] font-medium text-[var(--d-ink-3)]">Add-ons</div>
              <table className="tbl"><tbody>{p.addons.map((a) => <tr key={a.name}><td>{a.name}</td><td className="num">{fmt(a.price)} <span className="text-[var(--d-ink-3)]">per {a.per}</span></td></tr>)}</tbody></table></>}
          </section>

          <section className="card">
            <div className="border-b border-[var(--d-line)] px-4 py-3"><h2 className="text-[14px] font-semibold">Itinerary</h2></div>
            <ol className="rows">{p.itinerary.map((s, i) => <li key={i} className="flex gap-3 px-4 py-2 text-[13.5px]"><span className="tnum w-12 text-[var(--d-ink-3)]">Day {i + 1}</span>{s}</li>)}</ol>
          </section>

          <div className="grid gap-5 sm:grid-cols-2">
            <section className="card p-4"><p className="eyebrow mb-2">Included</p><ul className="list-disc pl-4 text-[13.5px] text-[var(--d-ink-2)]">{p.inclusions.map((x) => <li key={x}>{x}</li>)}</ul></section>
            <section className="card p-4"><p className="eyebrow mb-2">Not included</p><ul className="list-disc pl-4 text-[13.5px] text-[var(--d-ink-2)]">{p.exclusions.map((x) => <li key={x}>{x}</li>)}</ul></section>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <section className="card p-4">
            <p className="eyebrow">Cancellation policy · {pol.name}</p>
            <ul className="mt-2 flex flex-col gap-1 text-[13.5px]">{pol.rules.map((r, i) => <li key={i} className="flex justify-between"><span className="text-[var(--d-ink-2)]">{ruleLabel(pol.rules, i)}</span><span className="tnum font-medium">{r[1]}% charged</span></li>)}</ul>
            <p className="mt-3 text-[12.5px] text-[var(--d-ink-3)]">Shown as sentences on the booking page and accepted at checkout. Refunds within it go out automatically.</p>
          </section>
          <section className="card">
            <div className="border-b border-[var(--d-line)] px-4 py-3"><h2 className="text-[14px] font-semibold">Departures</h2></div>
            <ul className="rows">
              {deps.map((x) => <li key={x.id}><Link href={`/demo/app/departures/${x.id}`} className="row-hover block px-4 py-2.5"><span className="flex items-center justify-between text-[13.5px]"><span className="font-medium">{dstr(x.start)} – {dstr(x.end)}</span>{d(x.start) < TODAY ? <Pill tone="neutral">Departed</Pill> : seatsLeft(x) <= 0 ? <Pill tone="ink">Full</Pill> : <span className="tnum text-[12.5px] text-[var(--d-ink-2)]">{seatsLeft(x)} open</span>}</span><span className="mt-1.5 block"><Meter value={x.booked} max={x.seats} /></span></Link></li>)}
            </ul>
          </section>
        </div>
      </div>
    </Shell>
  );
}
