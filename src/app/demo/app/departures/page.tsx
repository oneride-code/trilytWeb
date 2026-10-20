"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, ArrowRight } from "lucide-react";
import { Shell, PageTitle } from "@/components/demo/Shell";
import { Btn, Meter, Pill } from "@/components/demo/ui";
import { useDemo } from "@/lib/demo/store";
import { TODAY, byId, d, daysUntil, departures, dstr, fmt, orderDue, orderPaid, packages, seatsLeft, type Departure } from "@/lib/demo/data";

export function SeatPill({ dp, closed }: { dp: Departure; closed?: boolean }) {
  const left = seatsLeft(dp);
  if (closed) return <Pill tone="bad">Closed</Pill>;
  if (d(dp.start) < TODAY) return <Pill tone="neutral">Departed</Pill>;
  if (left <= 0) return <Pill tone="ink">Full</Pill>;
  if (left <= 3) return <Pill tone="accent">Only {left} left</Pill>;
  return <Pill tone="neutral">{left} seats open</Pill>;
}

export default function DeparturesPage() {
  const { orders, notify, role, closed } = useDemo();
  const router = useRouter();
  const all = role === "guide" ? departures.filter((x) => x.guide === "Tenzin Norbu") : departures;
  const list = [...all].sort((a, b) => d(a.start).getTime() - d(b.start).getTime());
  const months = Array.from(new Set(list.map((x) => d(x.start).toLocaleDateString("en-IN", { month: "long", year: "numeric" }))));

  return (
    <Shell title="Departures" actions={(role === "owner" || role === "ops") && <Btn variant="primary" onClick={() => notify("Departure form (demo)")}><Plus size={14} /> Departure</Btn>} wide>
      <PageTitle title="Departures" sub={role === "guide" ? "Your batches. Open one for the manifest." : "Dated batches with seats. Open one for the manifest, check-in and the money on it."} />
      {months.map((m) => (
        <section key={m}>
          <p className="eyebrow mb-2">{m}</p>
          <div className="card scroll-x">
            <table className="tbl">
              <thead><tr><th>Dates</th><th>Package</th><th>Guide</th><th style={{ width: 220 }}>Seats</th><th className="num">Collected</th><th className="num">Still due</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {list.filter((x) => d(x.start).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) === m).map((dp) => {
                  const p = byId(packages, dp.pkg)!; const os = orders.filter((o) => o.dep === dp.id && o.status !== "cancelled");
                  const col = os.reduce((s, o) => s + orderPaid(o), 0); const due = os.reduce((s, o) => s + orderDue(o), 0); const isClosed = closed.includes(dp.id);
                  return (
                    <tr key={dp.id} className="row-link" onClick={() => router.push(`/demo/app/departures/${dp.id}`)}>
                      <td><span className="font-medium">{dstr(dp.start)} – {dstr(dp.end)}</span><span className="block text-[11.5px] text-[var(--d-ink-3)]">{daysUntil(dp.start) >= 0 ? `in ${daysUntil(dp.start)} days` : "departed"} · cut-off {dstr(dp.cutoff)}</span></td>
                      <td><Link href={`/demo/app/packages/${p.id}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>{p.name}</Link><span className="block text-[11.5px] text-[var(--d-ink-3)]">{p.days} · {p.type}</span></td>
                      <td className="text-[var(--d-ink-2)]">{dp.guide}</td>
                      <td><span className="flex items-center gap-3"><span className="flex-1"><Meter value={dp.booked} max={dp.seats} /></span><span className="tnum w-12 text-right text-[12.5px]">{dp.booked}/{dp.seats}</span></span></td>
                      <td className="num">{fmt(col)}</td>
                      <td className={`num ${due ? "text-[var(--d-accent-ink)]" : "text-[var(--d-ink-3)]"}`}>{due ? fmt(due) : "—"}</td>
                      <td><SeatPill dp={dp} closed={isClosed} /></td>
                      <td className="text-right"><ArrowRight size={14} className="inline text-[var(--d-ink-3)]" /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </Shell>
  );
}
