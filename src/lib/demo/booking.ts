/** The traveller's in-progress booking, kept in sessionStorage between the three booking pages. */
export interface BookingDraft { slug: string; dep: string; opt: string; n: number; names: string[]; phone: string; email: string }
const KEY = "trilyt-demo-booking";

export function readDraft(): BookingDraft | null {
  try { const s = sessionStorage.getItem(KEY); return s ? (JSON.parse(s) as BookingDraft) : null; } catch { return null; }
}
export function writeDraft(d: BookingDraft) { try { sessionStorage.setItem(KEY, JSON.stringify(d)); } catch {} }
export function clearDraft() { try { sessionStorage.removeItem(KEY); } catch {} }
