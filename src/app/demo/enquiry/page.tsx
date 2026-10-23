"use client";

/**
 * Operator enquiry. No backend yet: the form composes the email and opens the
 * operator's mail app addressed to contact@accelryde.com, with a copy button
 * as the fallback. Swap `send()` for an API route when there is one.
 */
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy, Mail } from "lucide-react";
import { Btn, Field, Note, ThemeToggle } from "@/components/demo/ui";
import { TrilytLogo } from "@/components/demo/Brand";

const TO = "contact@accelryde.com";
const SELLS = ["Treks and expeditions", "Road trips and bike tours", "Weekend getaways and camps", "City, food and heritage walks", "Water sports and adventure", "Group tours and yatras", "Something else"];
const VOLUME = ["Under 10 a month", "10–30 a month", "30–100 a month", "More than 100 a month"];

type Form = { operator: string; name: string; phone: string; email: string; city: string; sells: string; volume: string; tools: string; message: string };
const EMPTY: Form = { operator: "", name: "", phone: "", email: "", city: "", sells: SELLS[0], volume: VOLUME[1], tools: "", message: "" };

function draft(f: Form) {
  const subject = `Trilyt enquiry: ${f.operator || "travel operator"}${f.city ? `, ${f.city}` : ""}`;
  const body = [
    `Hi Trilyt team,`, ``,
    `We run ${f.operator || "a travel business"}${f.city ? ` in ${f.city}` : ""} and would like to see Trilyt for our bookings and payments.`, ``,
    `Operator: ${f.operator}`, `Contact: ${f.name}`, `Phone / WhatsApp: ${f.phone}`, `Email: ${f.email}`, `City: ${f.city}`,
    `What we sell: ${f.sells}`, `Bookings: ${f.volume}`, `How we take bookings today: ${f.tools || "—"}`, ``,
    f.message ? `Notes: ${f.message}` : ``, ``, `Please call or WhatsApp to set up a walkthrough.`, ``, f.name,
  ].join("\n");
  return { subject, body };
}

export default function EnquiryPage() {
  const [f, setF] = useState<Form>(EMPTY);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF((s) => ({ ...s, [k]: e.target.value }));
  const ok = f.operator.trim() && f.name.trim() && f.phone.replace(/\D/g, "").length >= 10;
  const { subject, body } = draft(f);
  const mailto = `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const send = (e: React.FormEvent) => { e.preventDefault(); if (!ok) return; setSent(true); window.location.href = mailto; };
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
          <p className="mt-4 text-[16px] leading-relaxed text-[var(--d-ink-2)]">Fill in the form and it drafts an email to <span className="font-medium text-[var(--d-ink)]">{TO}</span> with your details; send it from your own mail app. We reply within one working day and set the first five operators up ourselves.</p>
          <ul className="mt-6 flex flex-col gap-2 text-[14px] text-[var(--d-ink-2)]">
            {["A 30-minute walkthrough on your own packages", "Your Razorpay account connected, or a new one opened with you", "A free website with your packages, dates and online booking", "Nothing to pay for 6 months; then 1.75% per online order, capped at ₹999, no monthly fee"].map((t) => <li key={t} className="flex gap-2"><Check size={15} className="mt-0.5 shrink-0 text-[var(--d-accent-ink)]" />{t}</li>)}
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
          <Btn type="submit" variant="accent" size="lg" className="w-full" disabled={!ok}><Mail size={15} /> Open the email draft</Btn>
          {!ok && <p className="text-center text-[12px] text-[var(--d-ink-3)]">Operator, your name and a 10-digit phone number are needed.</p>}
          {sent && (
            <div className="flex flex-col gap-3">
              <Note>Your mail app should have opened with the draft below, addressed to {TO}. If it did not, copy it and send it from anywhere.</Note>
              <pre className="card-2 max-h-[260px] overflow-auto whitespace-pre-wrap p-3 text-[12.5px] leading-relaxed text-[var(--d-ink-2)]">{`To: ${TO}\nSubject: ${subject}\n\n${body}`}</pre>
              <Btn onClick={copy}>{copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy the email</>}</Btn>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
