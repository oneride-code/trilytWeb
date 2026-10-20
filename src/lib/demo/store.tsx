"use client";

/**
 * In-memory store for the demo. Orders change as you click through the
 * booking cycle (confirm, record a payment, move a date, check in, cancel),
 * and the change survives navigation between demo pages. A reload resets it.
 */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  TODAY_S, bookingAmt, departures, dstr, initialOrders, orderDue, refundFor, travellers as seedTravellers,
  type CheckState, type Order, type Payment, type Role, type Source, type Traveller,
} from "./data";

type Theme = "light" | "dark";
const NOW = `${TODAY_S} 09:${String(12 + Math.floor(Math.random() * 40)).padStart(2, "0")}`;
const stamp = () => NOW;

interface Store {
  orders: Order[];
  people: Traveller[];
  closed: string[];
  role: Role;
  setRole: (r: Role) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  toast: string | null;
  notify: (m: string) => void;
  confirmOrder: (id: string) => void;
  declineOrder: (id: string) => void;
  recordPayment: (id: string, p: Payment) => void;
  cancelOrder: (id: string, extra?: number, by?: string) => { refund: number };
  createOrder: (o: Omit<Order, "id" | "created" | "log" | "docs" | "checkin" | "reminders"> & Partial<Pick<Order, "docs" | "note" | "pickup">>, by?: string) => Order;
  moveOrder: (id: string, depId: string) => void;
  addTraveller: (id: string, name: string, phone: string) => void;
  checkIn: (id: string, t: string, state: CheckState | null) => void;
  sendReminder: (id: string) => void;
  closeDeparture: (depId: string) => { orders: number; refunded: number };
}

const Ctx = createContext<Store | null>(null);
const WHO: Record<Role, string> = { owner: "Ramesh Lotey", ops: "Kavita Shah", guide: "Tenzin Norbu", accounts: "Suresh Pillai", agent: "Hilltop Travels" };

export function DemoStoreProvider({ children, initialTheme = "light" }: { children: React.ReactNode; initialTheme?: Theme }) {
  const [orders, setOrders] = useState<Order[]>(() => initialOrders.map((o) => ({ ...o, payments: [...o.payments], log: [...o.log], checkin: { ...o.checkin } })));
  const [people, setPeople] = useState<Traveller[]>(() => [...seedTravellers]);
  const [closed, setClosed] = useState<string[]>([]);
  const [role, setRole] = useState<Role>("owner");
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [toast, setToast] = useState<string | null>(null);
  const who = WHO[role];

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    if (typeof document !== "undefined") document.documentElement.dataset.theme = t;
    try { localStorage.setItem("trilyt-demo-theme", t); } catch {}
  }, []);

  const notify = useCallback((m: string) => {
    setToast(m);
    window.setTimeout(() => setToast((cur) => (cur === m ? null : cur)), 2800);
  }, []);

  const update = (id: string, fn: (o: Order) => Order) => setOrders((os) => os.map((o) => (o.id === id ? fn(o) : o)));
  const withLog = (o: Order, by: string, what: string): Order => ({ ...o, log: [...o.log, { at: stamp(), who: by, what }] });

  const confirmOrder = useCallback((id: string) => {
    update(id, (o) => withLog({ ...o, status: "part", payments: [...o.payments, { d: TODAY_S, amt: bookingAmt(o), how: "Agent settlement · bank transfer", ref: "UTR 2110…" }] }, who, "Confirmed agent order, booking amount received"));
  }, [who]);
  const declineOrder = useCallback((id: string) => {
    update(id, (o) => withLog({ ...o, status: "cancelled", refund: { amt: 0, status: "processed", d: TODAY_S } }, who, "Declined agent order"));
  }, [who]);
  const recordPayment = useCallback((id: string, p: Payment) => {
    update(id, (o) => { const n = withLog({ ...o, payments: [...o.payments, p] }, who, `Marked ₹${p.amt.toLocaleString("en-IN")} received, ${p.how.replace("Received offline · ", "")}`); if (orderDue(n) <= 0) n.status = "paid"; return n; });
  }, [who]);
  const cancelOrder = useCallback((id: string, extra = 0, by?: string) => {
    let refund = 0;
    setOrders((os) => os.map((o) => {
      if (o.id !== id) return o;
      const rf = refundFor(o); refund = rf.refund + extra;
      const dep = departures.find((x) => x.id === o.dep); if (dep) dep.booked -= o.lines.length;
      return withLog({ ...o, status: "cancelled", refund: { amt: refund, status: "processed", d: TODAY_S } }, by ?? who, `Cancelled ${rf.days} days before departure. Policy ${rf.pct}% charged, refund ₹${refund.toLocaleString("en-IN")} sent to original method`);
    }));
    return { refund };
  }, [who]);
  const createOrder = useCallback<Store["createOrder"]>((o, by) => {
    const id = "TR-" + (1051 + Math.floor(Math.random() * 40));
    const n: Order = { reminders: 0, checkin: {}, docs: [{ name: "Consent and indemnity form", status: "missing" }, { name: "Government ID", status: "missing" }], ...o, id, created: TODAY_S,
      log: [{ at: stamp(), who: by ?? who, what: o.payments.length ? "Booked and paid booking amount" : "Booking created, payment link sent" }] };
    const dep = departures.find((x) => x.id === o.dep); if (dep) dep.booked += o.lines.length;
    setOrders((os) => [n, ...os]);
    return n;
  }, [who]);
  const moveOrder = useCallback((id: string, depId: string) => {
    update(id, (o) => {
      const from = departures.find((x) => x.id === o.dep), to = departures.find((x) => x.id === depId);
      if (from) from.booked -= o.lines.length; if (to) to.booked += o.lines.length;
      return withLog({ ...o, dep: depId }, who, `Moved to the ${to ? dstr(to.start) : ""} departure, traveller notified on WhatsApp`);
    });
  }, [who]);
  const addTraveller = useCallback((id: string, name: string, phone: string) => {
    const tid = "t" + (100 + Math.floor(Math.random() * 900));
    setPeople((ps) => [...ps, { id: tid, name, city: "", phone, email: "", trips: 1, spent: 0 }]);
    update(id, (o) => { const dep = departures.find((x) => x.id === o.dep); if (dep) dep.booked += 1; return withLog({ ...o, lines: [...o.lines, { t: tid, opt: o.lines[0].opt }], status: o.status === "paid" ? "part" : o.status }, who, `Added ${name} to the booking, balance updated`); });
  }, [who]);
  const checkIn = useCallback((id: string, t: string, state: CheckState | null) => {
    update(id, (o) => { const c = { ...o.checkin }; if (state) c[t] = state; else delete c[t]; return { ...o, checkin: c }; });
  }, []);
  const sendReminder = useCallback((id: string) => {
    update(id, (o) => withLog({ ...o, reminders: o.reminders + 1 }, who, "Balance reminder sent on WhatsApp with payment link"));
  }, [who]);
  const closeDeparture = useCallback((depId: string) => {
    let n = 0, refunded = 0;
    setOrders((os) => os.map((o) => {
      if (o.dep !== depId || o.status === "cancelled") return o;
      const paid = o.payments.reduce((s, p) => s + p.amt, 0); n += 1; refunded += paid;
      return withLog({ ...o, status: "cancelled", refund: { amt: paid, status: "processed", d: TODAY_S } }, who, `Departure closed by operator. Full refund ₹${paid.toLocaleString("en-IN")} sent, traveller offered other dates on WhatsApp`);
    }));
    const dep = departures.find((x) => x.id === depId); if (dep) dep.booked = 0;
    setClosed((c) => [...c, depId]);
    return { orders: n, refunded };
  }, [who]);

  const value = useMemo<Store>(() => ({ orders, people, closed, role, setRole, theme, setTheme, toast, notify, confirmOrder, declineOrder, recordPayment, cancelOrder, createOrder, moveOrder, addTraveller, checkIn, sendReminder, closeDeparture }),
    [orders, people, closed, role, theme, setTheme, toast, notify, confirmOrder, declineOrder, recordPayment, cancelOrder, createOrder, moveOrder, addTraveller, checkIn, sendReminder, closeDeparture]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemo() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useDemo outside DemoStoreProvider");
  return s;
}

export const SOURCE_LABEL: Record<Source, string> = {
  Website: "Website", WhatsApp: "WhatsApp", Instagram: "Instagram", Trilyt: "Trilyt", Agent: "Agent", "Walk-in": "Walk-in",
};
