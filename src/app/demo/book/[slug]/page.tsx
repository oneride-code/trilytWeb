"use client";

import { use, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Star } from "lucide-react";
import { PublicShell } from "@/components/demo/PublicShell";
import { Btn, Field, Note } from "@/components/demo/ui";
import { writeDraft } from "@/lib/demo/booking";
import { TODAY, d, departures, dlong, dstr, fmt, packages, pkgExtras, policies, ruleLabel, seatsLeft } from "@/lib/demo/data";

export default function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const p = packages.find((x) => x.slug === slug) ?? packages[0];
  const deps = departures.filter((x) => x.pkg === p.id && d(x.start) >= TODAY).sort((a, b) => d(a.start).getTime() - d(b.start).getTime());
  const [dep, setDep] = useState(deps.find((x) => seatsLeft(x) > 0)?.id ?? deps[0]?.id);
  const [opt, setOpt] = useState(p.options[0].id);
  const [n, setN] = useState(2);
  const [stage, setStage] = useState<"choose" | "details">("choose");
  const [names, setNames] = useState(["Aarav Mehta", "Meera Iyer"]);
  const [phone, setPhone] = useState("+91 98xxx 11234");
  const [email, setEmail] = useState("aarav@example.com");
  const [agree, setAgree] = useState(false);
  const dp = departures.find((x) => x.id === dep)!; const o = p.options.find((x) => x.id === opt)!;
  const total = o.price * n, ba = p.booking * n;
  const pol = policies[p.policy];
  const x = pkgExtras(p);
  const go = () => { writeDraft({ slug, dep, opt, n, names: names.slice(0, n), phone, email }); router.push(`/demo/book/${slug}/checkout`); };

  return (
    <PublicShell step={1} title={p.name}>
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-7">
          <div>
            <p className="eyebrow">{p.type} · {p.region} · {p.days}</p>
            <h1 className="mt-1.5 text-[30px] font-semibold leading-tight">{p.name}</h1>
            <p className="mt-1 text-[15px] text-[var(--d-ink-2)]">{p.tagline}</p>
            <p className="mt-2 flex items-center gap-1.5 text-[13px] text-[var(--d-ink-2)]"><Star size={13} fill="currentColor" /> {p.reviews ? `${p.rating} · ${p.reviews} reviews` : "New trip"} · meet at {p.meet}</p>
          </div>
          <div className="relative aspect-[3/2] max-h-[380px] overflow-hidden rounded-lg border border-[var(--d-line)]"><Image src={p.image} alt={p.name} fill sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" priority /></div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--d-line)] bg-[var(--d-line)] sm:grid-cols-5">
            {([["Duration", p.days], ["Difficulty", x.difficulty], ...x.facts, ["Group size", `up to ${Math.max(...deps.map((q) => q.seats))}`]] as [string, string][]).slice(0, 5).map(([k, v]) => <div key={k} className="bg-[var(--d-surface)] px-3 py-2.5"><dt className="eyebrow">{k}</dt><dd className="mt-0.5 text-[13.5px] font-medium">{v}</dd></div>)}
          </dl>

          <section>
            <h2 className="text-[16px] font-semibold">Itinerary</h2>
            <ol className="mt-2 rows card">{p.itinerary.map((s, i) => <li key={i} className="flex gap-3 px-4 py-2.5 text-[14px]"><span className="tnum w-12 shrink-0 text-[var(--d-ink-3)]">Day {i + 1}</span>{s}</li>)}</ol>
          </section>

          <section>
            <h2 className="text-[16px] font-semibold">Dates</h2>
            <ul className="mt-2 rows card">
              {deps.map((q) => <li key={q.id} className="flex items-center gap-3 px-4 py-2.5 text-[14px]"><span className="min-w-0 flex-1"><span className="font-medium">{dstr(q.start)} – {dstr(q.end)}</span><span className="ml-2 text-[12.5px] text-[var(--d-ink-3)]">guide {q.guide}</span></span><span className={`text-[12.5px] ${seatsLeft(q) === 0 ? "text-[var(--d-ink-3)]" : seatsLeft(q) <= 3 ? "text-[var(--d-accent-ink)]" : "text-[var(--d-ink-2)]"}`}>{seatsLeft(q) === 0 ? "Full" : seatsLeft(q) <= 3 ? `Only ${seatsLeft(q)} left` : `${seatsLeft(q)} seats`}</span><button type="button" className={`btn btn-sm ${dep === q.id ? "btn-primary" : ""}`} disabled={seatsLeft(q) === 0} onClick={() => { setDep(q.id); setStage("choose"); }}>{dep === q.id ? "Selected" : "Choose"}</button></li>)}
            </ul>
          </section>
          <div className="grid gap-5 sm:grid-cols-2">
            <section><h2 className="text-[16px] font-semibold">Included</h2><ul className="mt-2 flex flex-col gap-1 text-[14px] text-[var(--d-ink-2)]">{p.inclusions.map((x) => <li key={x} className="flex gap-2"><Check size={14} className="mt-1 shrink-0" />{x}</li>)}</ul></section>
            <section><h2 className="text-[16px] font-semibold">Not included</h2><ul className="mt-2 list-disc pl-5 text-[14px] text-[var(--d-ink-2)]">{p.exclusions.map((x) => <li key={x}>{x}</li>)}</ul></section>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <section><h2 className="text-[16px] font-semibold">Things to carry</h2><ul className="mt-2 list-disc pl-5 text-[14px] text-[var(--d-ink-2)]">{x.carry.map((c) => <li key={c}>{c}</li>)}</ul></section>
            <section><h2 className="text-[16px] font-semibold">Meeting point</h2><p className="mt-2 text-[14px] text-[var(--d-ink-2)]">{p.meet}. Pickup details and the guide&apos;s number come on WhatsApp the evening before.</p></section>
          </div>
          <section>
            <h2 className="text-[16px] font-semibold">What travellers say</h2>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">{x.reviews.map((r) => <blockquote key={r.name} className="card p-4 text-[14px] leading-relaxed text-[var(--d-ink-2)]">&ldquo;{r.text}&rdquo;<footer className="mt-2 text-[12.5px] text-[var(--d-ink-3)]">{r.name}, {r.city}</footer></blockquote>)}</div>
          </section>
          <section>
            <h2 className="text-[16px] font-semibold">Questions</h2>
            <div className="mt-2 rows card">{x.faq.map((f) => <details key={f.q} className="group px-4 py-2.5"><summary className="cursor-pointer list-none text-[14px] font-medium">{f.q}</summary><p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--d-ink-2)]">{f.a}</p></details>)}</div>
          </section>
          <section className="card p-4">
            <h2 className="text-[14px] font-semibold">Payment and cancellation</h2>
            <p className="mt-1.5 text-[13.5px] text-[var(--d-ink-2)]">Pay <b className="tnum text-[var(--d-ink)]">{fmt(p.booking)}</b> per traveller now to hold your seats. The balance is due 14 days before departure; we send a payment link on WhatsApp. If you cancel: {pol.rules.map((r, i) => `${ruleLabel(pol.rules, i).toLowerCase()} we keep ${r[1]}%`).join("; ")}. Refunds go back to the method you paid with, within 5–7 working days, automatically.</p>
          </section>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="card p-5">
            {stage === "choose" ? (
              <div className="flex flex-col gap-4">
                <div><p className="eyebrow">From</p><p className="tnum text-[26px] font-semibold leading-none">{fmt(Math.min(...p.options.map((x) => x.price)))}<span className="text-[13px] font-normal text-[var(--d-ink-3)]"> per traveller</span></p></div>
                <Field label="Departure"><select className="select" value={dep} onChange={(e) => setDep(e.target.value)}>{deps.map((x) => <option key={x.id} value={x.id} disabled={seatsLeft(x) === 0}>{dstr(x.start)} – {dstr(x.end)} · {seatsLeft(x) === 0 ? "full" : seatsLeft(x) <= 3 ? `only ${seatsLeft(x)} left` : `${seatsLeft(x)} seats`}</option>)}</select></Field>
                <Field label="Sharing"><select className="select" value={opt} onChange={(e) => setOpt(e.target.value)}>{p.options.map((x) => <option key={x.id} value={x.id}>{x.name} · {fmt(x.price)}</option>)}</select></Field>
                <Field label="Travellers"><input className="input tnum" type="number" min={1} max={Math.max(1, seatsLeft(dp))} value={n} onChange={(e) => setN(Math.min(Math.max(1, Number(e.target.value) || 1), Math.max(1, seatsLeft(dp))))} /></Field>
                <dl className="flex flex-col gap-1.5 border-t border-[var(--d-line)] pt-3 text-[13.5px]">
                  <div className="flex justify-between"><dt className="text-[var(--d-ink-2)]">{n} × {o.name}</dt><dd className="tnum">{fmt(total)}</dd></div>
                  <div className="flex justify-between font-semibold"><dt>Pay now to hold seats</dt><dd className="tnum">{fmt(ba)}</dd></div>
                  <div className="flex justify-between text-[var(--d-ink-3)]"><dt>Balance due {dlong(new Date(d(dp.start).getTime() - 14 * 86400000).toISOString().slice(0, 10))}</dt><dd className="tnum">{fmt(total - ba)}</dd></div>
                </dl>
                <Btn variant="accent" size="lg" className="w-full" onClick={() => setStage("details")} disabled={seatsLeft(dp) === 0}>Continue</Btn>
                <p className="text-center text-[12px] text-[var(--d-ink-3)]">Seats held for 30 minutes while you pay</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div><p className="eyebrow">Travellers · {dstr(dp.start)}</p><p className="text-[13.5px] text-[var(--d-ink-2)]">{n} × {o.name}, {fmt(ba)} now</p></div>
                {Array.from({ length: n }).map((_, i) => <Field key={i} label={`Traveller ${i + 1} full name`}><input className="input" value={names[i] ?? ""} onChange={(e) => setNames((ns) => { const c = [...ns]; c[i] = e.target.value; return c; })} /></Field>)}
                <Field label="WhatsApp number"><input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
                <Field label="Email"><input className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
                <label className="flex items-start gap-2 text-[13px] text-[var(--d-ink-2)]"><input type="checkbox" className="mt-1" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> I accept the {pol.name.toLowerCase()} cancellation policy above. ID and the consent form can be uploaded after booking.</label>
                <Btn variant="accent" size="lg" className="w-full" onClick={go} disabled={!agree}>Pay {fmt(ba)}</Btn>
                <button type="button" className="btn btn-ghost btn-sm mx-auto" onClick={() => setStage("choose")}>Back</button>
              </div>
            )}
          </div>
          <Note><span className="text-[12.5px]">You pay Himalayan Trails Co. directly. Bookings run on trilyt.</span></Note>
        </aside>
      </div>
    </PublicShell>
  );
}
