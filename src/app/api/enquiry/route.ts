/**
 * POST /api/enquiry: sends the operator enquiry to contact@accelryde.com
 * through Resend. The page tries this first and falls back to a mailto draft
 * when it answers 503 (no key configured) or cannot be reached.
 *
 * Env: RESEND_API_KEY (Resend secret) and ENQUIRY_FROM (a sender on a domain
 * verified in Resend, e.g. "Trilyt <enquiry@trilyt.com>"). See .env.example.
 *
 * Note: next.config.ts proxies /api/* to the oneRyde backend, but filesystem
 * routes win over that rewrite, so this handler is served first.
 */
import { Resend } from "resend";
import { draftEnquiry, ENQUIRY_TO, SELLS, VOLUME, type EnquiryForm } from "@/lib/enquiry";

export const runtime = "nodejs";

// Crude in-memory rate limit: per IP, per server instance; resets on deploy.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) { hits.set(ip, recent); return true; }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  return false;
}

function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const oneOf = <T extends readonly string[]>(v: unknown, opts: T) => (typeof v === "string" && (opts as readonly string[]).includes(v) ? v : opts[0]);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (status: number, body: Record<string, unknown>) => Response.json(body, { status });

export async function POST(req: Request) {
  let raw: unknown;
  try { raw = await req.json(); } catch { return json(400, { error: "Send the enquiry as JSON." }); }
  const b = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;

  const f: EnquiryForm = {
    operator: str(b.operator, 200), name: str(b.name, 120), phone: str(b.phone, 40), email: str(b.email, 200), city: str(b.city, 120),
    sells: oneOf(b.sells, SELLS), volume: oneOf(b.volume, VOLUME), tools: str(b.tools, 500), message: str(b.message, 2000),
  };

  const problems: string[] = [];
  if (!f.operator) problems.push("operator");
  if (!f.name) problems.push("name");
  if (f.phone.replace(/\D/g, "").length < 10) problems.push("phone");
  if (f.email && !EMAIL.test(f.email)) problems.push("email");
  if (problems.length) return json(400, { error: "Operator, your name and a 10-digit phone number are needed; the email, if given, must be valid.", fields: problems });

  const key = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM;
  if (!key || !from) {
    return json(503, { error: "Email sending is not configured on this server (RESEND_API_KEY / ENQUIRY_FROM missing). Use the email draft instead." });
  }

  if (rateLimited(clientIp(req))) return json(429, { error: "Too many enquiries from this connection. Try again in a few minutes, or email us directly." });

  const { subject, body } = draftEnquiry(f);
  const resend = new Resend(key);
  const { error } = await resend.emails.send({ from, to: ENQUIRY_TO, subject, text: body, replyTo: f.email || undefined });
  if (error) {
    console.error("[enquiry] Resend refused the email:", error.name, error.message);
    return json(502, { error: "The enquiry could not be sent right now. Use the email draft instead." });
  }
  return json(200, { ok: true });
}
