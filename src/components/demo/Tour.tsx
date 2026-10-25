"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useAgent } from "./Agent";
import { TRIP_PROMPT } from "@/lib/demo/agent";

/** `ai` opens Trilyt AI on that step with the message typed in, waiting to be sent. */
const STEPS: { href: string; h: string; t: string; ai?: string }[] = [
  { href: "/demo/app", h: "Monday morning", t: "What needs you today: balances overdue, an agent order waiting, a departure on Saturday. Everything else is quiet." },
  { href: "/demo/app/packages", h: "A new trip, by chat", t: "Type the trip the way you'd tell your team. Trilyt AI drafts the itinerary, prices and departures, and publishes to your website when you tap. The message is typed in for you: press send.", ai: TRIP_PROMPT },
  { href: "/demo/app/orders/TR-1042", h: "A booking with a balance", t: "One card per booking: who, what they paid, what is due and when, documents, and a log of everything anyone did. Send the reminder from here." },
  { href: "/demo/app/payments", h: "Due and overdue", t: "Every rupee still owed across all departures, soonest first. One tap sends a WhatsApp reminder with the payment link." },
  { href: "/demo/app/departures/dp1", h: "Saturday: the manifest", t: "The guide opens this on a phone at the meeting point: pickup, medical notes, balance owed, and a check-in per person." },
  { href: "/demo/app/departures/dp8", h: "When the river is closed", t: "Close a departure. Everyone is refunded in full automatically and offered the next dates on WhatsApp. Nobody rings you." },
  { href: "/demo/book/manage/TR-1041", h: "The traveller's side", t: "Travellers manage their own booking: pay the balance, move dates, cancel under the policy they accepted. Refunds go out without you." },
  { href: "/demo/app/payments?tab=invoices", h: "Money and GST", t: "Settlements to your own bank, refunds netted, a GST invoice per booking, and Trilyt's fee: 1.75% of each order, never more than ₹999, and at most ₹99 on an offline order." },
  { href: "/demo/app/team", h: "Who can do what", t: "Owner, ops, guide, accounts and agent each see only their part. Switch the viewer at the top right to see it." },
];
const KEY = "trilyt-demo-tour";

/** Tiny external store so the tour step survives navigation and never sets state inside an effect. */
const listeners = new Set<() => void>();
function read(): number | null { try { const s = sessionStorage.getItem(KEY); return s === null ? null : Number(s); } catch { return null; } }
function write(n: number | null) { try { if (n === null) sessionStorage.removeItem(KEY); else sessionStorage.setItem(KEY, String(n)); } catch {} listeners.forEach((l) => l()); }
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };

/** Floating guide that walks across pages. Starts from any URL with ?tour=1. */
export function Tour() {
  const router = useRouter();
  const path = usePathname();
  const step = useSyncExternalStore(subscribe, read, () => null);
  const { open, openAgent, closeAgent } = useAgent();

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("tour") === "1") { write(0); router.replace(STEPS[0].href); }
  }, [path, router]);

  if (step === null) return null;
  const s = STEPS[step];
  const go = (n: number) => {
    if (n < 0 || n >= STEPS.length) { write(null); return; }
    write(n); router.push(STEPS[n].href);
    if (STEPS[n].ai) openAgent(STEPS[n].ai); else closeAgent();
  };
  const end = () => write(null);

  return (
    <aside key={step} className={`rise card fixed bottom-4 right-4 z-[65] w-[min(360px,calc(100vw-32px))] border-[var(--d-line-strong)] p-4 lg:right-6 ${open ? "max-lg:hidden" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="eyebrow !text-[var(--d-accent-ink)]">A week in the console · {step + 1} of {STEPS.length}</p>
        <button type="button" aria-label="End tour" onClick={end} className="btn btn-ghost btn-sm !h-6 !w-6 !px-0"><X size={13} /></button>
      </div>
      <h3 className="mt-1 text-[15px] font-semibold">{s.h}</h3>
      <p className="mt-1 text-[13px] leading-[1.55] text-[var(--d-ink-2)]">{s.t}</p>
      <div className="mt-3 flex items-center gap-1">
        {STEPS.map((_, i) => <span key={i} className={`h-1 flex-1 rounded-sm ${i <= step ? "bg-[var(--d-ink)]" : "bg-[var(--d-line)]"}`} />)}
      </div>
      <div className="mt-3 flex justify-between">
        <button type="button" className="btn btn-sm" disabled={step === 0} onClick={() => go(step - 1)}>Back</button>
        <button type="button" className="btn btn-sm btn-primary" onClick={() => (step === STEPS.length - 1 ? end() : go(step + 1))}>{step === STEPS.length - 1 ? "Done" : "Next"}</button>
      </div>
    </aside>
  );
}
