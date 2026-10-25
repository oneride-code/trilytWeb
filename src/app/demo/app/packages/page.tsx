"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, ExternalLink, Sparkles } from "lucide-react";
import { Shell, PageTitle } from "@/components/demo/Shell";
import { Btn } from "@/components/demo/ui";
import { useAgent } from "@/components/demo/Agent";
import { useDemo } from "@/lib/demo/store";
import { TRIP_PROMPT } from "@/lib/demo/agent";
import { TODAY, d, departures, dstr, fmt, packages, policies } from "@/lib/demo/data";

export default function PackagesPage() {
  const { notify, role } = useDemo();
  const { openAgent } = useAgent();
  const router = useRouter();
  return (
    <Shell title="Packages" actions={(role === "owner" || role === "ops") && <><Btn onClick={() => openAgent(TRIP_PROMPT)} title="Create with AI"><Sparkles size={14} className="text-[var(--d-accent)]" /><span className="hidden sm:inline">Create with AI</span></Btn><Btn variant="primary" onClick={() => notify("Package editor (demo)")}><Plus size={14} /> Package</Btn></>} wide>
      <PageTitle title="Packages" sub="What you sell. Each package has price options, add-ons, a cancellation policy and dated departures. Ops can create and edit packages; prices and the policy are the owner's. Or describe a trip to Trilyt AI in one line and publish its draft." />
      <div className="card scroll-x">
        <table className="tbl">
          <thead><tr><th>Package</th><th>Type</th><th className="num">From</th><th className="num">Booking amount</th><th>Policy</th><th>Next departure</th><th className="num">Rating</th><th></th></tr></thead>
          <tbody>
            {packages.map((p) => { const next = departures.filter((x) => x.pkg === p.id && d(x.start) >= TODAY).sort((a, b) => d(a.start).getTime() - d(b.start).getTime())[0]; return (
              <tr key={p.id} className="row-link" onClick={() => router.push(`/demo/app/packages/${p.id}`)}>
                <td><span className="flex items-center gap-3"><span className="relative h-9 w-12 overflow-hidden rounded border border-[var(--d-line)]"><Image src={p.image} alt="" fill sizes="48px" className="object-cover" /></span><span><Link href={`/demo/app/packages/${p.id}`} className="font-medium hover:underline" onClick={(e) => e.stopPropagation()}>{p.name}</Link><span className="block text-[11.5px] text-[var(--d-ink-3)]">{p.region} · {p.days}</span></span></span></td>
                <td className="text-[var(--d-ink-2)]">{p.type}</td>
                <td className="num">{fmt(Math.min(...p.options.map((o) => o.price)))}</td>
                <td className="num">{fmt(p.booking)}</td>
                <td className="text-[var(--d-ink-2)]">{policies[p.policy].name}</td>
                <td>{next ? <>{dstr(next.start)}<span className="block text-[11.5px] text-[var(--d-ink-3)]">{next.seats - next.booked} seats open</span></> : "—"}</td>
                <td className="num">{p.reviews ? <>{p.rating} <span className="text-[var(--d-ink-3)]">({p.reviews})</span></> : <span className="text-[var(--d-ink-3)]">New</span>}</td>
                <td className="text-right"><Link href={`/demo/book/${p.slug}`} className="btn btn-ghost btn-sm" onClick={(e) => e.stopPropagation()}><ExternalLink size={12} /> Booking page</Link></td>
              </tr>
            ); })}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
