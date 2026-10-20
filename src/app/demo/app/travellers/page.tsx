"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shell, PageTitle } from "@/components/demo/Shell";
import { Avatar, Empty, Note, useCan } from "@/components/demo/ui";
import { useDemo } from "@/lib/demo/store";
import { byId, departures, dstr, fmt, orderPaid, packages } from "@/lib/demo/data";

export default function TravellersPage() {
  const { orders, people, role } = useDemo();
  const router = useRouter();
  const [q, setQ] = useState("");
  const money = useCan("See who paid what") !== false;
  // A guide sees only the people on their own departures, and never the money.
  const mineIds = role === "guide" ? new Set(orders.filter((o) => o.status !== "cancelled" && byId(departures, o.dep)?.guide === "Tenzin Norbu").flatMap((o) => o.lines.map((l) => l.t))) : null;
  const list = people.filter((t) => (!mineIds || mineIds.has(t.id)) && (!q || t.name.toLowerCase().includes(q.toLowerCase()) || t.city.toLowerCase().includes(q.toLowerCase())));
  return (
    <Shell title="Travellers" wide>
      <PageTitle title="Travellers" sub={role === "guide" ? "People on your departures: contact, pickup, medical notes and emergency contacts." : "Everyone who has booked with you, across every channel. Repeat travellers show up here before they book again."}>
        <input className="input !w-[240px]" placeholder="Search name or city" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search travellers" />
      </PageTitle>
      <div className="card scroll-x">
        <table className="tbl">
          <thead><tr><th>Traveller</th><th>City</th><th>Contact</th><th>{role === "guide" ? "Departure" : "Last trip"}</th>{money ? <><th className="num">Trips</th><th className="num">Paid to you</th></> : <th>Emergency contact</th>}<th>Notes</th></tr></thead>
          <tbody>
            {list.map((t) => { const os = orders.filter((o) => o.lines.some((l) => l.t === t.id)); const last = os[0]; const dp = last ? byId(departures, last.dep) : undefined; const paid = os.reduce((s, o) => s + orderPaid(o), 0); return (
              <tr key={t.id} className="row-link" onClick={() => router.push(`/demo/app/travellers/${t.id}`)}>
                <td><span className="flex items-center gap-2"><Avatar name={t.name} size={26} /><Link href={`/demo/app/travellers/${t.id}`} className="font-medium hover:underline" onClick={(e) => e.stopPropagation()}>{t.name}</Link></span></td>
                <td className="text-[var(--d-ink-2)]">{t.city || "—"}</td>
                <td className="text-[var(--d-ink-2)]">{t.phone}<span className="block text-[11.5px] text-[var(--d-ink-3)]">{t.email}</span></td>
                <td>{dp ? <>{byId(packages, dp.pkg)!.name}<span className="block text-[11.5px] text-[var(--d-ink-3)]">{dstr(dp.start)}{last?.pickup ? ` · pickup ${last.pickup}` : ""}</span></> : "—"}</td>
                {money ? <><td className="num">{Math.max(t.trips, os.length)}</td><td className="num">{fmt(paid || t.spent)}</td></> : <td className="text-[var(--d-ink-2)]">{t.emergency ?? "—"}</td>}
                <td className={t.medical ? "text-[var(--d-warn)]" : "text-[var(--d-ink-3)]"}>{t.medical ?? "—"}</td>
              </tr>
            ); })}
          </tbody>
        </table>
        {!list.length && <Empty>No travellers match.</Empty>}
      </div>
      {role === "guide" && <Note>Guides see contact, pickup and medical details for their own batches. Payments and balances stay with the office.</Note>}
    </Shell>
  );
}
