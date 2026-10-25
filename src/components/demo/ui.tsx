"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Check, Moon, Sun, X } from "lucide-react";
import { useDemo } from "@/lib/demo/store";
import { ROLE_NAV, can, type OrderStatus, type Perm } from "@/lib/demo/data";

export function Card({ children, className = "", as: Tag = "div", tone = "default" }: { children: React.ReactNode; className?: string; as?: "div" | "section" | "article" | "aside" | "nav"; tone?: "default" | "2" }) {
  return <Tag className={`${tone === "2" ? "card-2" : "card"} ${className}`}>{children}</Tag>;
}

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

type BtnProps = {
  children: React.ReactNode; href?: string; onClick?: () => void; variant?: "default" | "primary" | "accent" | "ghost" | "danger";
  size?: "sm" | "md" | "lg"; className?: string; disabled?: boolean; type?: "button" | "submit"; title?: string;
};
export function Btn({ children, href, onClick, variant = "default", size = "md", className = "", disabled, type = "button", title }: BtnProps) {
  const cls = `btn ${variant !== "default" ? `btn-${variant}` : ""} ${size !== "md" ? `btn-${size}` : ""} ${className}`;
  if (href) return <Link href={href} className={cls} title={title}>{children}</Link>;
  return <button type={type} className={cls} onClick={onClick} disabled={disabled} title={title}>{children}</button>;
}

const STATUS: Record<OrderStatus, [string, string]> = {
  pending: ["p-warn", "Awaiting confirmation"], part: ["p-accent", "Balance due"], paid: ["p-ink", "Paid"], cancelled: ["p-bad", "Cancelled"],
};
export function StatusPill({ s }: { s: OrderStatus }) { const [c, l] = STATUS[s]; return <span className={`pill ${c}`}>{l}</span>; }
export function Pill({ tone = "neutral", children }: { tone?: "ink" | "accent" | "warn" | "bad" | "neutral"; children: React.ReactNode }) {
  return <span className={`pill p-${tone}`}>{children}</span>;
}

export function Meter({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return <div className={`meter ${max - value <= 3 && max - value > 0 ? "hot" : ""}`} role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}><i style={{ width: `${pct}%` }} /></div>;
}

export function Avatar({ name, className = "", size = 32 }: { name: string; className?: string; size?: number }) {
  const initials = name.split(" ").map((x) => x[0]).slice(0, 2).join("");
  return (
    <span className={`inline-grid shrink-0 place-items-center rounded-full border border-[var(--d-line-strong)] bg-[var(--d-surface-2)] font-semibold text-[var(--d-ink-2)] ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }} aria-hidden="true">
      {initials}
    </span>
  );
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useDemo();
  const dark = theme === "dark";
  return (
    <button type="button" aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} aria-pressed={dark}
      onClick={() => setTheme(dark ? "light" : "dark")} className={`btn btn-ghost !h-8 !w-8 !px-0 ${className}`}>
      {dark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}

export function Toast() {
  const { toast } = useDemo();
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-[70] flex justify-center px-4">
      {toast && <div className="rise flex items-center gap-2 rounded-lg border border-[var(--d-line-strong)] bg-[var(--d-ink)] px-4 py-2.5 text-[13.5px] font-medium text-[var(--d-bg)]"><Check size={14} className="text-[var(--d-accent)]" />{toast}</div>}
    </div>
  );
}

function useEscape(onClose: () => void) {
  useEffect(() => { const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); }; window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, [onClose]);
}

export function Modal({ title, onClose, children, footer, wide = false }: { title: React.ReactNode; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode; wide?: boolean }) {
  useEscape(onClose);
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-[rgba(10,12,16,0.45)] p-4" onClick={onClose} role="presentation">
      <div role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}
        className={`rise card max-h-[90dvh] w-full overflow-auto ${wide ? "max-w-[760px]" : "max-w-[540px]"}`}>
        <div className="flex items-center justify-between gap-3 border-b border-[var(--d-line)] px-5 py-3.5">
          <h2 className="text-[15px] font-semibold">{title}</h2>
          <button type="button" aria-label="Close" onClick={onClose} className="btn btn-ghost btn-sm !h-7 !w-7 !px-0"><X size={15} /></button>
        </div>
        <div className="flex flex-col gap-4 px-5 py-4">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-[var(--d-line)] px-5 py-3.5">{footer}</div>}
      </div>
    </div>
  );
}

/** Right-hand panel over a list, so the operator never loses the list. */
export function Panel({ title, onClose, children, footer, eyebrow }: { title: React.ReactNode; eyebrow?: React.ReactNode; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode }) {
  useEscape(onClose);
  return (
    <div className="fixed inset-0 z-[55]" role="presentation">
      <button aria-label="Close panel" className="absolute inset-0 bg-[rgba(10,12,16,0.25)]" onClick={onClose} />
      <aside role="dialog" aria-modal="true" className="slidein absolute inset-y-0 right-0 flex w-[min(640px,100vw)] flex-col border-l border-[var(--d-line)] bg-[var(--d-surface)]">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--d-line)] px-5 py-3.5">
          <div className="min-w-0">{eyebrow && <div className="eyebrow mb-0.5">{eyebrow}</div>}<h2 className="truncate text-[16px] font-semibold">{title}</h2></div>
          <button type="button" aria-label="Close" onClick={onClose} className="btn btn-ghost btn-sm !h-7 !w-7 !px-0"><X size={15} /></button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-auto px-5 py-4">{children}</div>
        {footer && <div className="flex flex-wrap gap-2 border-t border-[var(--d-line)] px-5 py-3.5">{footer}</div>}
      </aside>
    </div>
  );
}

export function Field({ label, children, className = "", hint }: { label: string; children: React.ReactNode; className?: string; hint?: string }) {
  return <label className={`flex min-w-0 flex-col gap-1.5 ${className}`}><span className="lbl">{label}</span>{children}{hint && <span className="text-[12px] text-[var(--d-ink-3)]">{hint}</span>}</label>;
}

/** Big number with a caption, for the overview and payments. */
export function Stat({ label, value, note, accent = false, href }: { label: string; value: string; note?: React.ReactNode; accent?: boolean; href?: string }) {
  const inner = (
    <>
      <Eyebrow>{label}</Eyebrow>
      <p className={`tnum mt-2 text-[26px] font-semibold leading-none tracking-[-0.02em] ${accent ? "text-[var(--d-accent-ink)]" : ""}`}>{value}</p>
      {note && <div className="mt-1.5 text-[12.5px] text-[var(--d-ink-2)]">{note}</div>}
    </>
  );
  if (href) return <Link href={href} className="card block p-4 transition-colors hover:bg-[var(--d-surface-2)]">{inner}</Link>;
  return <div className="card p-4">{inner}</div>;
}

export function Note({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "warn" | "bad" | "accent" }) {
  const cls = tone === "warn" ? "bg-[var(--d-warn-soft)] text-[var(--d-warn)]" : tone === "bad" ? "bg-[var(--d-bad-soft)] text-[var(--d-bad)]" : tone === "accent" ? "bg-[var(--d-accent-soft)] text-[var(--d-accent-ink)]" : "bg-[var(--d-surface-2)] text-[var(--d-ink-2)]";
  return <div className={`rounded-lg px-3 py-2.5 text-[13px] leading-relaxed ${cls}`}>{children}</div>;
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="px-4 py-8 text-center text-[13.5px] text-[var(--d-ink-3)]">{children}</p>;
}

/** Role helpers: what the current viewer may do and see. */
export { can };
export function useCan(action: string) { const { role } = useDemo(); return can(role, action); }
export function useNav() { const { role } = useDemo(); return ROLE_NAV[role]; }

export function PermMark({ v }: { v: Perm }) {
  if (v === true) return <span className="inline-grid h-5 w-5 place-items-center rounded-full bg-[var(--d-ink)] text-[var(--d-bg)]"><Check size={12} /></span>;
  if (v === "own") return <span className="pill p-neutral !h-5 !px-1.5 !text-[11px]">Own only</span>;
  return <span className="text-[var(--d-line-strong)]">—</span>;
}
