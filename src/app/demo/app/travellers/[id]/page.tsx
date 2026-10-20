"use client";

import { use } from "react";
import Link from "next/link";
import { Shell } from "@/components/demo/Shell";
import { Avatar, Empty, Stat, StatusPill, useCan } from "@/components/demo/ui";
import { NewBookingButton } from "@/components/demo/actions";
import { useDemo } from "@/lib/demo/store";
import { byId, departures, dstr, fmt, orderDue, orderPaid, packages } from "@/lib/demo/data";

export default function TravellerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { orders, people, role } = useDemo();
  const money = useCan("See who paid what") !== false;
  const t = byId(people, id);
  if (!t) return <Shell title="Traveller" crumb={{ href: "/demo/app/travellers", label: "Travellers" }}><Empty>No traveller {id}.</Empty></Shell>;
  const os = orders.filter((o) => o.lines.some((l) => l.t === t.id));
  const paid = os.reduce((s, o) => s + orderPaid(o), 0), due = os.filter((o) => o.status !== "cancelled").reduce((s, o) => s + orderDue(o), 0);
  return (
    <Shell title={t.name} crumb={{ href: "/demo/app/travellers", label: "Travellers" }} actions={(role === "owner" || role === "ops") && <NewBookingButton primary travellerId={t.id} />}>
      <div className="flex items-center gap-4">
        <Avatar name={t.name} size={48} />
        <div><h1 className="text-[22px] font-semibold leading-tight">{t.name}</h1><p className="text-[13.5px] text-[var(--d-ink-2)]">{t.city || "City unknown"} · {t.phone} · {t.email || "no email"}</p>{(t.medical || t.emergency) && <p className="mt-0.5 text-[13px] text-[var(--d-ink-2)]">{t.medical && <span className="text-[var(--d-warn)]">{t.medical}</span>}{t.medical && t.emergency ? " · " : ""}{t.emergency && <>Emergency: {t.emergency}</>}</p>}</div>
      </div>
      {money ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Trips" value={String(Math.max(t.trips, os.length))} />
          <Stat label="Paid to you" value={fmt(paid || t.spent)} />
          <Stat label="Balance due" value={due ? fmt(due) : "—"} accent={due > 0} />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <Stat label="Trips with you" value={String(Math.max(t.trips, os.length))} />
          <Stat label="Emergency contact" value={t.emergency ? t.emergency.split(" · ")[0] : "—"} note={t.emergency?.split(" · ")[1]} />
        </div>
      )}
      <section className="card">
        <div className="border-b border-[var(--d-line)] px-4 py-3"><h2 className="text-[14px] font-semibold">Bookings</h2></div>
        <ul className="rows">
          {os.map((o) => { const dp = byId(departures, o.dep)!; const p = byId(packages, dp.pkg)!; const row = <><span className="mono text-[12.5px]">{o.id}</span><span className="min-w-0 flex-1 truncate text-[13.5px]">{p.name} · {dstr(dp.start)}{o.pickup ? ` · pickup ${o.pickup}` : ""}</span>{money && <span className="tnum text-[13.5px]">{fmt(orderPaid(o))}</span>}<StatusPill s={o.status} /></>;
            return <li key={o.id}>{money ? <Link href={`/demo/app/orders/${o.id}`} className="row-hover flex items-center gap-3 px-4 py-3">{row}</Link> : <div className="flex items-center gap-3 px-4 py-3">{row}</div>}</li>; })}
          {!os.length && <li className="px-4 py-6 text-center text-[13px] text-[var(--d-ink-3)]">No bookings yet.</li>}
        </ul>
      </section>
    </Shell>
  );
}
