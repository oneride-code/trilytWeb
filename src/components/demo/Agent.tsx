"use client";

/**
 * Trilyt AI in the console: a chat panel over the page. Replies come from
 * lib/demo/agent.ts; the actions it offers (publish, remind, close) run through
 * the same store calls as the buttons elsewhere, and only when tapped.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, RotateCcw, Send, Sparkles, X } from "lucide-react";
import { Meter, can } from "./ui";
import { useDemo } from "@/lib/demo/store";
import { SUGGESTIONS, reply, type Card, type TripDraft } from "@/lib/demo/agent";
import { dayOf, dstr, fmt, monthShort, policies, team } from "@/lib/demo/data";

interface Msg { id: number; from: "you" | "ai"; text: string; card?: Card }
interface AgentCtx {
  open: boolean; busy: boolean; msgs: Msg[]; prefill: { key: number; text: string };
  /** Opens the panel, optionally with a message typed in and waiting to be sent. */
  openAgent: (prompt?: string) => void;
  closeAgent: () => void;
  toggle: () => void;
  /** Opens the panel and sends a message, as if the operator typed it. */
  ask: (text: string) => void;
  act: (id: number, action: "publish" | "remind" | "close" | "keep") => void;
  reset: () => void;
}

const Ctx = createContext<AgentCtx | null>(null);
const OWNER = team.find((m) => m.role === "owner")!.name.split(" ")[0];

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const { role, orders, people, closed, notify, publishTrip, sendReminder, closeDeparture } = useDemo();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const [prefill, setPrefill] = useState({ key: 0, text: "" });
  const seq = useRef(0);
  const timer = useRef<number | undefined>(undefined);

  const say = useCallback((text: string, card?: Card) => {
    const id = ++seq.current;
    // A new draft retires the one before it, so only the latest can be published.
    const retire = (x: Msg): Msg => (card?.kind === "trip" && x.card?.kind === "trip" && x.card.state === "draft" ? { ...x, card: { ...x.card, state: "old" } } : x);
    setMsgs((m) => [...m.map(retire), { id, from: "ai", text, card }]);
  }, []);
  const patch = useCallback((id: number, fn: (c: Card) => Card) => setMsgs((m) => m.map((x) => (x.id === id && x.card ? { ...x, card: fn(x.card) } : x))), []);

  const publish = useCallback((id: number, draft: TripDraft) => {
    if (role === "owner") {
      const p = publishTrip(draft);
      patch(id, (c) => (c.kind === "trip" ? { ...c, state: "published", pkgId: p.id } : c));
      say(`Live. ${p.name} is on your website with ${draft.dates.length} departures and ${draft.dates.length * draft.seats} seats. Travellers can book it now; share the booking page on WhatsApp or Instagram.`);
      notify(`${p.name} is live · ${draft.dates.length} departures`);
    } else if (can(role, "Create and edit packages")) {
      patch(id, (c) => (c.kind === "trip" ? { ...c, state: "sent" } : c));
      say(`Sent to ${OWNER}. It goes live on your website once ${OWNER} approves the prices.`);
      notify(`Sent to ${OWNER} for approval`);
    } else say("Switch the viewer back to Owner to publish this.");
  }, [role, publishTrip, patch, say, notify]);

  const ask = useCallback((raw: string) => {
    const text = raw.trim();
    setOpen(true);
    if (!text || busy) return;
    const last = [...msgs].reverse().find((m) => m.card?.kind === "trip" && m.card.state === "draft");
    const draft = last?.card?.kind === "trip" ? last.card.draft : null;
    const turn = reply(text, { role, orders, people, closed, draft });
    const id = ++seq.current;
    setMsgs((m) => [...m, { id, from: "you", text }]);
    setBusy(true);
    timer.current = window.setTimeout(() => {
      setBusy(false);
      if (turn.publish && last && draft) publish(last.id, draft);
      else say(turn.text, turn.card);
    }, turn.card?.kind === "trip" ? 1100 : 600);
  }, [busy, msgs, role, orders, people, closed, publish, say]);

  const act = useCallback((id: number, action: "publish" | "remind" | "close" | "keep") => {
    const c = msgs.find((m) => m.id === id)?.card;
    if (!c) return;
    if (action === "publish" && c.kind === "trip") publish(id, c.draft);
    if (action === "remind" && c.kind === "dues") {
      if (!can(role, "Send payment link or reminder")) { say("Your role can see who owes what, but only the owner or ops can send reminders."); return; }
      for (const r of c.rows) sendReminder(r.id);
      patch(id, (x) => (x.kind === "dues" ? { ...x, state: "sent" } : x));
      say(`Sent ${c.rows.length} WhatsApp reminders, each with a payment link for exactly what that traveller owes. They're in each booking's log.`);
      notify(`${c.rows.length} reminders sent on WhatsApp`);
    }
    if (action === "close" && c.kind === "close") {
      if (role !== "owner") { say("Only the owner can close a departure. Switch the viewer to Owner to do it."); return; }
      const r = closeDeparture(c.depId);
      patch(id, (x) => (x.kind === "close" ? { ...x, state: "done", refunded: r.refunded } : x));
      say(`Closed. ${fmt(r.refunded)} is on its way back in full to ${r.orders} bookings, and everyone has a WhatsApp offering ${c.next ? `the ${dstr(c.next)} batch` : "your next dates"}.`);
      notify(`Departure closed · ${fmt(r.refunded)} refunded`);
    }
    if (action === "keep" && c.kind === "close") {
      patch(id, (x) => (x.kind === "close" ? { ...x, state: "kept" } : x));
      say("Okay, it stays on. Nothing was sent.");
    }
  }, [msgs, role, publish, say, patch, sendReminder, closeDeparture, notify]);

  const reset = useCallback(() => { window.clearTimeout(timer.current); setMsgs([]); setBusy(false); }, []);
  const openAgent = useCallback((prompt?: string) => { setOpen(true); if (prompt !== undefined) setPrefill((p) => ({ key: p.key + 1, text: prompt })); }, []);
  const closeAgent = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((o) => !o), []);

  const value = useMemo<AgentCtx>(() => ({ open, busy, msgs, prefill, openAgent, closeAgent, toggle, ask, act, reset }), [open, busy, msgs, prefill, openAgent, closeAgent, toggle, ask, act, reset]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAgent() {
  const a = useContext(Ctx);
  if (!a) throw new Error("useAgent outside AgentProvider");
  return a;
}

/** The prompt bar on the overview: opens the panel, or sends one of the suggestions straight away. */
export function AskBar() {
  const { openAgent, ask } = useAgent();
  return (
    <section className="card flex flex-col gap-2.5 p-3 md:flex-row md:items-center">
      <button type="button" onClick={() => openAgent()} className="flex h-10 min-w-0 flex-1 items-center gap-2.5 rounded-lg border border-[var(--d-line-strong)] bg-[var(--d-bg)] px-3 text-left text-[13.5px] text-[var(--d-ink-3)] transition-colors hover:border-[var(--d-ink-3)]">
        <Sparkles size={15} className="shrink-0 text-[var(--d-accent)]" /><span className="truncate">Ask Trilyt AI to build a trip, chase a balance or close a departure…</span><kbd className="ml-auto hidden sm:inline">⌘J</kbd>
      </button>
      <div className="flex flex-wrap gap-1.5">{SUGGESTIONS.slice(0, 3).map((s) => <button key={s.label} type="button" onClick={() => ask(s.prompt)} className="btn btn-sm">{s.label}</button>)}</div>
    </section>
  );
}

/** The panel itself. Mounted once in the demo layout; shows on console pages only. */
export function AgentPanel() {
  const a = useAgent();
  const { role } = useDemo();
  const path = usePathname();
  const list = useRef<HTMLDivElement>(null);
  const inConsole = path.startsWith("/demo/app");
  const { toggle, closeAgent, open } = a;

  useEffect(() => { const el = list.current; if (el) el.scrollTop = el.scrollHeight; }, [a.msgs.length, a.busy, open]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j" && window.location.pathname.startsWith("/demo/app")) { e.preventDefault(); toggle(); }
      else if (e.key === "Escape" && open) closeAgent();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [toggle, closeAgent, open]);

  if (!open || !inConsole) return null;
  const name = team.find((m) => m.role === role)?.name.split(" ")[0] ?? "there";

  return (
    <div className="fixed inset-0 z-[58]" role="presentation">
      <button aria-label="Close Trilyt AI" className="absolute inset-0 bg-[rgba(10,12,16,0.22)] backdrop-blur-[3px]" onClick={closeAgent} />
      <aside role="dialog" aria-modal="true" aria-label="Trilyt AI" className="slidein-l absolute inset-y-0 left-0 flex w-[min(460px,100vw)] flex-col border-r border-[var(--d-line)] bg-[var(--d-surface)]">
        <header className="flex items-center gap-2.5 border-b border-[var(--d-line)] px-4 py-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--d-accent-soft)] text-[var(--d-accent-ink)]"><Sparkles size={16} /></span>
          <div className="min-w-0 flex-1">
            <h2 className="text-[15px] font-semibold leading-tight">Trilyt AI</h2>
            <p className="truncate text-[11.5px] text-[var(--d-ink-3)]">Works on your bookings · asks before it acts</p>
          </div>
          {a.msgs.length > 0 && <button type="button" className="btn btn-ghost btn-sm" onClick={a.reset}><RotateCcw size={13} /> New chat</button>}
          <button type="button" aria-label="Close" onClick={closeAgent} className="btn btn-ghost btn-sm !h-7 !w-7 !px-0"><X size={15} /></button>
        </header>

        <div ref={list} className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto px-4 py-4" aria-live="polite">
          {a.msgs.length === 0 ? (
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[18px] font-semibold leading-tight">Namaste, {name}.</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--d-ink-2)]">Tell me what you need, in Hindi, English or both. I draft it here and wait for your tap before anything reaches a traveller or your website.</p>
              </div>
              <ul className="flex flex-col gap-2">
                {SUGGESTIONS.map((s) => (
                  <li key={s.label}><button type="button" onClick={() => a.ask(s.prompt)} className="card row-hover block w-full px-3 py-2.5 text-left">
                    <span className="block text-[13.5px] font-medium">{s.label}</span>
                    <span className="mt-0.5 block truncate text-[12.5px] text-[var(--d-ink-3)]">“{s.prompt}”</span>
                  </button></li>
                ))}
              </ul>
            </div>
          ) : a.msgs.map((m) => m.from === "you" ? (
            <p key={m.id} className="ml-auto max-w-[88%] whitespace-pre-line rounded-2xl rounded-br-md bg-[var(--d-ink)] px-3.5 py-2.5 text-[14px] leading-snug text-[var(--d-bg)]">{m.text}</p>
          ) : (
            <div key={m.id} className="rise flex flex-col gap-2.5">
              {m.text && <p className="flex gap-2 text-[13.5px] leading-relaxed text-[var(--d-ink-2)]"><Sparkles size={13} className="mt-[3px] shrink-0 text-[var(--d-accent)]" /><span className="min-w-0 whitespace-pre-line">{m.text}</span></p>}
              {m.card && <CardView id={m.id} card={m.card} />}
            </div>
          ))}
          {a.busy && <p className="flex items-center gap-2 text-[12.5px] text-[var(--d-ink-3)]"><span className="dots" aria-hidden="true"><i /><i /><i /></span>Working on it…</p>}
        </div>

        <Composer key={a.prefill.key} initial={a.prefill.text} />
      </aside>
    </div>
  );
}

/** The message box. Keyed by the prefill, so a prompt handed in from elsewhere starts it fresh. */
function Composer({ initial }: { initial: string }) {
  const { ask, busy } = useAgent();
  const [v, setV] = useState(initial);
  const send = () => { if (!v.trim() || busy) return; ask(v); setV(""); };
  return (
    <form className="border-t border-[var(--d-line)] p-3" onSubmit={(e) => { e.preventDefault(); send(); }}>
      <div className="ai-box flex items-end gap-2 rounded-xl border border-[var(--d-line-strong)] bg-[var(--d-surface)] p-1.5 pl-3">
        <label htmlFor="ai-message" className="sr-only">Message Trilyt AI</label>
        <textarea id="ai-message" autoFocus value={v} rows={Math.min(4, Math.max(1, Math.ceil(v.length / 46)))}
          onChange={(e) => setV(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Message Trilyt AI…" className="ai-input max-h-32 min-h-9 flex-1 resize-none bg-transparent py-1.5 text-[14px] leading-snug" />
        <button type="submit" aria-label="Send" disabled={!v.trim() || busy} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--d-ink)] text-[var(--d-bg)] transition-opacity disabled:opacity-35"><Send size={15} /></button>
      </div>
      <p className="mt-1.5 px-1 text-[11px] leading-snug text-[var(--d-ink-3)]">Demo: answers come from the sample data, nothing is sent anywhere. ⌘J opens and closes this panel.</p>
    </form>
  );
}

function CardView({ id, card }: { id: number; card: Card }) {
  const { act, ask, closeAgent } = useAgent();
  const { role } = useDemo();
  if (card.kind === "trip") return <TripCard draft={card.draft} state={card.state} pkgId={card.pkgId} owner={role === "owner"} onPublish={() => act(id, "publish")} onLeave={closeAgent} />;

  if (card.kind === "dues") {
    const total = card.rows.reduce((n, r) => n + r.amt, 0);
    return (
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between gap-2 border-b border-[var(--d-line)] px-3.5 py-2.5"><p className="text-[13px] font-semibold">{card.rows.length} balances</p><p className="tnum text-[13px] font-semibold">{fmt(total)}</p></div>
        <ul className="rows">
          {card.rows.map((r) => (
            <li key={r.id}><Link href={`/demo/app/orders/${r.id}`} onClick={closeAgent} className="row-hover flex items-center gap-2 px-3.5 py-2 text-[13px]">
              <span className="min-w-0 flex-1"><span className="block truncate font-medium">{r.name}</span><span className="block truncate text-[11.5px] text-[var(--d-ink-3)]">{r.pkg}</span></span>
              <span className="text-right"><span className="tnum block font-medium">{fmt(r.amt)}</span>{r.overdue ? <span className="text-[11.5px] font-medium text-[var(--d-bad)]">overdue</span> : <span className="text-[11.5px] text-[var(--d-ink-3)]">due {dstr(r.due)}</span>}</span>
            </Link></li>
          ))}
        </ul>
        <div className="border-t border-[var(--d-line)] p-3">
          {card.state === "sent" ? <p className="flex items-center gap-1.5 text-[13px] font-medium"><Check size={14} className="text-[var(--d-accent-ink)]" /> Reminders sent with payment links</p>
            : card.canSend ? <button type="button" onClick={() => act(id, "remind")} className="btn btn-accent w-full"><Send size={13} /> Remind all {card.rows.length} on WhatsApp</button>
            : <p className="text-[12.5px] text-[var(--d-ink-3)]">Your role can see this list. Reminders are sent by the owner or ops.</p>}
        </div>
      </div>
    );
  }

  if (card.kind === "close") return (
    <div className="card p-3.5">
      <p className="eyebrow">Close departure</p>
      <p className="mt-1 text-[15px] font-semibold leading-tight">{card.name} · {dstr(card.start)}</p>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-[12px]">
        {([["Bookings", String(card.bookings)], ["Travellers", String(card.travellers)], ["Refund", fmt(card.refund)]] as const).map(([l, v]) => (
          <div key={l} className="card-2 px-2.5 py-2"><dt className="text-[var(--d-ink-3)]">{l}</dt><dd className="tnum mt-0.5 text-[14px] font-semibold text-[var(--d-ink)]">{v}</dd></div>
        ))}
      </dl>
      {card.state === "ask" && card.canClose && <div className="mt-3 flex gap-2"><button type="button" onClick={() => act(id, "close")} className="btn btn-danger flex-1">Close and refund everyone</button><button type="button" onClick={() => act(id, "keep")} className="btn">Keep it</button></div>}
      {card.state === "ask" && !card.canClose && <p className="mt-3 text-[12.5px] text-[var(--d-ink-3)]">Only the owner can close a departure.</p>}
      {card.state === "kept" && <p className="mt-3 text-[13px] text-[var(--d-ink-2)]">Kept open.</p>}
      {card.state === "done" && <div className="mt-3 flex items-center justify-between gap-2"><p className="flex items-center gap-1.5 text-[13px] font-medium"><Check size={14} className="text-[var(--d-accent-ink)]" /> Closed · {fmt(card.refunded ?? 0)} refunded</p><Link href={`/demo/app/departures/${card.depId}`} onClick={closeAgent} className="btn btn-sm">Open <ArrowRight size={12} /></Link></div>}
    </div>
  );

  if (card.kind === "seats") return (
    <ul className="card rows overflow-hidden">
      {card.rows.map((r) => (
        <li key={r.id}><Link href={`/demo/app/departures/${r.id}`} onClick={closeAgent} className="row-hover grid grid-cols-[40px_1fr_auto] items-center gap-3 px-3.5 py-2">
          <span className="leading-tight"><span className="tnum block text-[16px] font-semibold">{dayOf(r.start)}</span><span className="block text-[10.5px] uppercase text-[var(--d-ink-3)]">{monthShort(r.start)}</span></span>
          <span className="min-w-0"><span className="block truncate text-[13px] font-medium">{r.name}</span><span className="mt-1 block"><Meter value={r.booked} max={r.seats} /></span></span>
          <span className="tnum text-[12px] text-[var(--d-ink-2)]">{r.booked}/{r.seats}</span>
        </Link></li>
      ))}
    </ul>
  );

  if (card.kind === "links") return (
    <div className="flex flex-wrap gap-1.5">{card.links.map((l) => <Link key={l.href} href={l.href} onClick={closeAgent} className="btn btn-sm">{l.label} <ArrowRight size={12} /></Link>)}</div>
  );

  return (
    <div className="flex flex-col gap-1.5">
      {SUGGESTIONS.map((s) => <button key={s.label} type="button" onClick={() => ask(s.prompt)} className="btn btn-sm justify-start">{s.label}</button>)}
    </div>
  );
}

/**
 * A drafted trip as the operator sees it before and after publishing. Also used,
 * without actions, as the illustration on the product page.
 */
export function TripCard({ draft: t, state, pkgId, owner = true, onPublish, onLeave, preview = false }: {
  draft: TripDraft; state: "draft" | "old" | "sent" | "published"; pkgId?: string; owner?: boolean; onPublish?: () => void; onLeave?: () => void; preview?: boolean;
}) {
  const [all, setAll] = useState(false);
  const days = all ? t.itinerary : t.itinerary.slice(0, 4);
  const more = t.itinerary.length - 4;
  return (
    <div className={`card overflow-hidden ${state === "old" ? "opacity-60" : ""}`}>
      <div className="p-4">
        <p className="eyebrow flex items-center gap-1.5 !text-[var(--d-accent-ink)]">{state === "published" ? <Check size={12} /> : <Sparkles size={12} />}{state === "published" ? "Live on your website" : state === "sent" ? `Waiting for ${OWNER}` : state === "old" ? "Earlier draft" : "Draft trip"}</p>
        <h3 className="mt-1.5 text-[18px] font-semibold leading-tight">{t.name}</h3>
        <p className="mt-0.5 text-[13px] text-[var(--d-ink-3)]">{t.nights}N / {t.days}D · {t.from} → {t.from} · {t.seats} seats</p>
        <ol className="mt-3 flex flex-col gap-1 text-[13.5px] leading-snug text-[var(--d-ink-2)]">
          {days.map((s, i) => <li key={i}>Day {i + 1} · {s}</li>)}
        </ol>
        {more > 0 && (preview ? <p className="mt-1 text-[13px] text-[var(--d-ink-3)]">+ {more} more days</p>
          : <button type="button" onClick={() => setAll(!all)} className="mt-1 text-[13px] text-[var(--d-ink-3)] hover:text-[var(--d-ink)]">{all ? "Show fewer days" : `+ ${more} more days`}</button>)}
        <div className="mt-3 flex flex-wrap gap-1.5">{t.options.map((o) => <span key={o.id} className="chip">{o.name.replace(/ sharing| room/, "")} {fmt(o.price)}</span>)}</div>
        <div className="mt-2 flex flex-wrap gap-1.5">{t.dates.map((s) => <span key={s} className="chip chip-accent">{dstr(s)}</span>)}</div>
        <p className="mt-3 text-[12px] text-[var(--d-ink-3)]">{fmt(t.booking)} to book · balance 14 days before · {policies[t.policy].name} cancellation policy</p>
      </div>
      {state === "draft" && (
        <div className="px-4 pb-4">
          {preview ? <span className="btn btn-accent pointer-events-none w-full !h-10">Publish to website <ArrowRight size={14} /></span>
            : <button type="button" onClick={onPublish} className="btn btn-accent w-full !h-10">{owner ? <>Publish to website <ArrowRight size={14} /></> : <>Send to {OWNER} to publish <ArrowRight size={14} /></>}</button>}
        </div>
      )}
      {state === "published" && pkgId && (
        <div className="flex flex-wrap gap-2 px-4 pb-4">
          <Link href={`/demo/book/${t.slug}`} onClick={onLeave} className="btn btn-sm">Booking page <ArrowRight size={12} /></Link>
          <Link href={`/demo/app/packages/${pkgId}`} onClick={onLeave} className="btn btn-sm">Package and departures <ArrowRight size={12} /></Link>
        </div>
      )}
    </div>
  );
}
