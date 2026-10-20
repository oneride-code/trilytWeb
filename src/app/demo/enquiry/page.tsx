"use client";

/**
 * Operator enquiry. Submitting POSTs to /api/enquiry, which emails
 * contact@accelryde.com through Resend. If that route answers 503 (no key
 * configured) or cannot be reached, the form falls back to opening the
 * visitor's mail app with the same draft, with a copy button as the last resort.
 */
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy, Mail, Send } from "lucide-react";
import { Btn, Field, Note, ThemeToggle } from "@/components/demo/ui";
import { TrilytLogo } from "@/components/demo/Brand";
import { draftEnquiry, EMPTY_ENQUIRY, ENQUIRY_TO as TO, SELLS, VOLUME, type EnquiryForm as Form } from "@/lib/enquiry";

type Status = "idle" | "sending" | "sent" | "fallback";

export default function EnquiryPage() {
  const [f, setF] = useState<Form>(EMPTY_ENQUIRY);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { setF((s) => ({ ...s, [k]: e.target.value })); if (status !== "idle") { setStatus("idle"); setError(null); } };
  const ok = f.operator.trim() && f.name.trim() && f.phone.replace(/\D/g, "").length >= 10;
  const { subject, body } = draftEnquiry(f);
  const mailto = `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const fallback = () => { setStatus("fallback"); window.location.href = mailto; };
  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ok || status === "sending") return;
    setStatus("sending"); setError(null);
    let res: Response;
    try {
      res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    } catch { fallback(); return; }
    if (res.ok) { setStatus("sent"); return; }
    if (res.status === 400 || res.status === 429) {
      // Our own validation or rate limit: tell them, keep the form editable.
      const data = await res.json().catch(() => null) as { error?: string } | null;
      setError(data?.error ?? "Something in the form needs fixing."); setStatus("idle"); return;
    }
    fallback(); // 503 (not configured), 502 (Resend refused) or anything else.
  };
  const copy = async () => { try { await navigator.clipboard.writeText(`To: ${TO}\nSubject: ${subject}\n\n${body}`); setCopied(true); window.setTimeout(() => setCopied(false), 2000); } catch {} };

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-[var(--d-line)] bg-[var(--d-bg)]">
        <div className="mx-auto flex h-14 max-w-[1120px] items-center gap-4 px-4 lg:px-6">
          <TrilytLogo height={28} sub="for operators" />
          <Link href="/demo" className="ml-auto hidden items-center gap-1 text-[13px] text-[var(--d-ink-2)] hover:text-[var(--d-ink)] sm:inline-flex"><ArrowLeft size={13} /> Back to the product</Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto grid max-w-[1120px] gap-10 px-4 py-12 lg:grid-cols-[1fr_420px] lg:px-6 lg:py-16">
        <div className="max-w-[560px]">
          <p className="eyebrow">Enquiry</p>
          <h1 className="mt-2 text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[40px]">Tell us about your departures. We&apos;ll call you back.</h1>
          <p className="mt-4 text-[16px] leading-relaxed text-[var(--d-ink-2)]">Fill in the form and it reaches <span className="font-medium text-[var(--d-ink)]">{TO}</span> straight away. We reply within one working day and set the first five operators up ourselves.</p>
          <ul className="mt-6 flex flex-col gap-2 text-[14px] text-[var(--d-ink-2)]">
            {["A 30-minute walkthrough on your own packages", "Your Razorpay account connected, or a new one opened with you", "No monthly fee: 1.75% per online order, capped at ₹999"].map((t) => <li key={t} className="flex gap-2"><Check size={15} className="mt-0.5 shrink-0 text-[var(--d-accent-ink)]" />{t}</li>)}
          </ul>
          <p className="mt-8 text-[13px] text-[var(--d-ink-3)]">Prefer to write directly? <a href={`mailto:${TO}`} className="underline">{TO}</a>. Trilyt is built by AccelRyde Technologies LLP, Bengaluru.</p>
        </div>

        <form onSubmit={send} className="card flex flex-col gap-4 p-5" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Operator or company" className="sm:col-span-2"><input id="operator" className="input" value={f.operator} onChange={set("operator")} placeholder="Himalayan Trails Co." required /></Field>
            <Field label="Your name"><input id="name" className="input" value={f.name} onChange={set("name")} required /></Field>
            <Field label="Phone / WhatsApp"><input id="phone" className="input" type="tel" value={f.phone} onChange={set("phone")} placeholder="+91" required /></Field>
            <Field label="Email"><input id="email" className="input" type="email" value={f.email} onChange={set("email")} /></Field>
            <Field label="City"><input id="city" className="input" value={f.city} onChange={set("city")} /></Field>
            <Field label="What you sell"><select id="sells" className="select" value={f.sells} onChange={set("sells")}>{SELLS.map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label="Bookings"><select id="volume" className="select" value={f.volume} onChange={set("volume")}>{VOLUME.map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label="How you take bookings today" className="sm:col-span-2" hint="WhatsApp and a bank transfer, a Google form, an agency, another tool."><input id="tools" className="input" value={f.tools} onChange={set("tools")} /></Field>
            <Field label="Anything else" className="sm:col-span-2"><textarea id="message" className="textarea" rows={3} value={f.message} onChange={set("message")} /></Field>
          </div>
          {status === "sent" ? (
            <Note tone="accent"><span className="flex items-start gap-2"><Check size={15} className="mt-0.5 shrink-0" /><span>Sent. We&apos;ll call you back on {f.phone} within one working day.</span></span></Note>
          ) : (
            <Btn type="submit" variant="accent" size="lg" className="w-full" disabled={!ok || status === "sending"}>
              {status === "sending" ? <>Sending…</> : <><Send size={15} /> Send the enquiry</>}
            </Btn>
          )}
          {!ok && status !== "sent" && <p className="text-center text-[12px] text-[var(--d-ink-3)]">Operator, your name and a 10-digit phone number are needed.</p>}
          {error && <Note tone="warn">{error}</Note>}
          {status === "fallback" && (
            <div className="flex flex-col gap-3">
              <Note>We couldn&apos;t send this from the site just now, so your mail app should have opened with the draft below, addressed to {TO}. If it did not, copy it and send it from anywhere.</Note>
              <pre className="card-2 max-h-[260px] overflow-auto whitespace-pre-wrap p-3 text-[12.5px] leading-relaxed text-[var(--d-ink-2)]">{`To: ${TO}\nSubject: ${subject}\n\n${body}`}</pre>
              <div className="grid gap-2 sm:grid-cols-2">
                <Btn href={mailto}><Mail size={14} /> Open the email draft</Btn>
                <Btn onClick={copy}>{copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy the email</>}</Btn>
              </div>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
