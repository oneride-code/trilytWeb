"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import { PublicShell } from "@/components/demo/PublicShell";
import { Btn, Eyebrow, Field } from "@/components/demo/ui";
import { readDraft, writeDraft, type BookingDraft } from "@/lib/demo/booking";
import { useDemo } from "@/lib/demo/store";
import { TODAY_S, byId, departures, dstr, fmt, packages } from "@/lib/demo/data";

const METHODS = [["upi", "UPI", "Any UPI app · instant"], ["card", "Card", "Visa, Mastercard, RuPay"], ["nb", "Netbanking", "All major banks"], ["emi", "EMI", "3, 6, 9 months"]] as const;

export default function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { createOrder } = useDemo();
  const p = packages.find((x) => x.slug === slug) ?? packages[0];
  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [method, setMethod] = useState<(typeof METHODS)[number][0]>("upi");
  const [paying, setPaying] = useState(false);
  useEffect(() => {
    // Load the draft after mount; if someone lands here directly, seed a sensible one.
    const t = window.setTimeout(() => {
      const dr = readDraft();
      if (dr && dr.slug === slug) { setDraft(dr); return; }
      const dp = departures.find((x) => x.pkg === p.id && x.seats - x.booked > 0)!;
      const d0 = { slug, dep: dp.id, opt: p.options[0].id, n: 2, names: ["Aarav Mehta", "Meera Iyer"], phone: "+91 98xxx 11234", email: "aarav@example.com" };
      writeDraft(d0); setDraft(d0);
    }, 0);
    return () => window.clearTimeout(t);
  }, [slug, p]);

  if (!draft) return <PublicShell step={2}><div className="h-[60vh]" /></PublicShell>;
  const dp = byId(departures, draft.dep)!; const amount = p.booking * draft.n;

  const pay = () => {
    setPaying(true);
    window.setTimeout(() => {
      const o = createOrder({ dep: draft.dep, source: "Website", status: "part", lines: Array.from({ length: draft.n }).map((_, i) => ({ t: i === 0 ? "t1" : "t6", opt: draft.opt })), addons: [],
        payments: [{ d: TODAY_S, amt: amount, how: `Payment link · ${method === "upi" ? "UPI" : method === "card" ? "Card" : method === "nb" ? "Netbanking" : "EMI"}`, ref: "pay_Q9z2" }] }, "Website");
      router.push(`/demo/book/${slug}/done?order=${o.id}`);
    }, 1400);
  };

  return (
    <PublicShell step={2} title={p.name}>
      <div className="mx-auto max-w-[440px]">
        <div className="card overflow-hidden">
          <div className="border-b border-[var(--d-line)] bg-[var(--d-ink)] p-5 text-[var(--d-bg)]">
            <Eyebrow className="!text-[var(--d-bg)] opacity-70">Himalayan Trails Co.</Eyebrow>
            <p className="tnum mt-2 text-[30px] font-semibold leading-none">{fmt(amount)}</p>
            <p className="mt-1.5 text-[13px] opacity-80">Booking amount · {p.name} · {dstr(dp.start)} · {draft.n} traveller{draft.n > 1 ? "s" : ""}</p>
          </div>
          <div className="flex flex-col gap-3 p-5">
            <Eyebrow>Pay with</Eyebrow>
            {METHODS.map(([k, l, s]) => (
              <button key={k} type="button" onClick={() => setMethod(k)} className={`flex items-center gap-3 rounded-lg border px-3.5 py-2.5 text-left transition-colors ${method === k ? "border-[var(--d-ink)]" : "border-[var(--d-line)] hover:bg-[var(--d-surface-2)]"}`}>
                <span className="grid h-8 w-8 place-items-center rounded-md bg-[var(--d-surface-2)] text-[10.5px] font-semibold">{l.slice(0, 3).toUpperCase()}</span>
                <span className="flex-1"><span className="block text-[13.5px] font-medium">{l}</span><span className="block text-[12px] text-[var(--d-ink-3)]">{s}</span></span>
                <span className={`h-4 w-4 rounded-full border-2 ${method === k ? "border-[var(--d-ink)] bg-[var(--d-ink)]" : "border-[var(--d-line-strong)]"}`} />
              </button>
            ))}
            {method === "upi" && <Field label="UPI ID"><input className="input" defaultValue="aarav@okbank" /></Field>}
            {method === "card" && <div className="grid grid-cols-2 gap-3"><Field label="Card number" className="col-span-2"><input className="input mono" defaultValue="4111 1111 1111 1111" /></Field><Field label="Expiry"><input className="input" defaultValue="08/29" /></Field><Field label="CVV"><input className="input" defaultValue="•••" /></Field></div>}
            <Btn variant="accent" size="lg" className="mt-1 w-full" onClick={pay} disabled={paying}>{paying ? <><Loader2 size={16} className="animate-spin" /> Confirming with your bank…</> : <>Pay {fmt(amount)}</>}</Btn>
            <p className="flex items-center justify-center gap-1.5 text-center text-[11.5px] text-[var(--d-ink-3)]"><Lock size={11} /> Secure checkout on the operator&apos;s own Razorpay account. Settles to Himalayan Trails Co., not to Trilyt.</p>
            <button type="button" className="btn btn-ghost btn-sm mx-auto" onClick={() => router.push(`/demo/book/${slug}`)}>Back</button>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
