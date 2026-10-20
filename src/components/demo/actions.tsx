"use client";

/** Modals for the actions an operator takes on a booking or a departure. All state is in-memory. */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Send, Banknote, Ban, CalendarDays, UserPlus, MessageCircle, CloudRain } from "lucide-react";
import { Btn, Field, Modal, Note } from "./ui";
import { useDemo } from "@/lib/demo/store";
import { TODAY, TODAY_S, byId, d, departures, dstr, fmt, orderDue, orderPaid, orderTotal, packages, pkgOf, policies, refundFor, seatsLeft, type Order } from "@/lib/demo/data";

export function NewBookingButton({ primary = false, travellerId, size }: { primary?: boolean; travellerId?: string; size?: "sm" | "md" }) {
  const [open, setOpen] = useState(false);
  const { createOrder, notify, people } = useDemo();
  const router = useRouter();
  const t = travellerId ? byId(people, travellerId) : undefined;
  const upcoming = departures.filter((x) => d(x.start) >= TODAY && x.seats - x.booked > 0);
  const [dep, setDep] = useState(upcoming[0]?.id ?? "dp2");
  const [source, setSource] = useState<Order["source"]>("WhatsApp");
  const [name, setName] = useState(t?.name ?? "Nikhil Rao");
  const [phone, setPhone] = useState(t?.phone ?? "+91 98xxx 00412");
  const [n, setN] = useState(1);
  const [pay, setPay] = useState<"link" | "later" | "cash">("link");
  const dp = byId(departures, dep)!; const p = byId(packages, dp.pkg)!;
  const create = () => {
    const o = createOrder({ dep, source, status: pay === "cash" ? "part" : "pending", lines: Array.from({ length: n }).map(() => ({ t: t?.id ?? "t9", opt: p.options[0].id })), addons: [],
      payments: pay === "cash" ? [{ d: TODAY_S, amt: p.booking * n, how: "Received offline · cash", ref: "—" }] : [] });
    setOpen(false);
    notify(pay === "link" ? `${o.id} created · link for ${fmt(p.booking * n)} sent on ${source}` : pay === "cash" ? `${o.id} created · ${fmt(p.booking * n)} cash recorded` : `${o.id} created · pay later`);
    router.push(`/demo/app/orders/${o.id}`);
  };
  return (
    <>
      <Btn variant={primary ? "primary" : "default"} size={size} onClick={() => setOpen(true)}><Plus size={14} /> New booking</Btn>
      {open && (
        <Modal title="New booking" onClose={() => setOpen(false)} footer={<><Btn onClick={() => setOpen(false)}>Cancel</Btn><Btn variant="primary" onClick={create}>{pay === "link" ? <><Send size={13} /> Create and send link</> : "Create booking"}</Btn></>}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Departure" className="sm:col-span-2"><select className="select" value={dep} onChange={(e) => setDep(e.target.value)}>{upcoming.map((x) => <option key={x.id} value={x.id}>{byId(packages, x.pkg)!.name} · {dstr(x.start)} · {seatsLeft(x)} seats left</option>)}</select></Field>
            <Field label="Came from"><select className="select" value={source} onChange={(e) => setSource(e.target.value as Order["source"])}>{["WhatsApp", "Walk-in", "Instagram", "Agent"].map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label="Travellers"><input className="input tnum" type="number" min={1} max={seatsLeft(dp)} value={n} onChange={(e) => setN(Math.max(1, Number(e.target.value) || 1))} /></Field>
            <Field label="Lead traveller"><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></Field>
            <Field label="WhatsApp number"><input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
            <Field label="Booking amount" className="sm:col-span-2" hint={`${fmt(p.booking)} per traveller. Balance is due 14 days before departure.`}>
              <div className="flex flex-wrap gap-2">
                {([["link", "Send payment link"], ["cash", "Received in cash"], ["later", "Pay later"]] as const).map(([k, l]) => (
                  <button key={k} type="button" onClick={() => setPay(k)} className={`btn btn-sm ${pay === k ? "btn-primary" : ""}`}>{l}</button>
                ))}
              </div>
            </Field>
          </div>
          <Note>Seats are held for 30 minutes while the traveller pays. The link, <b className="tnum">{fmt(p.booking * n)}</b>, lands in your own Razorpay account.</Note>
        </Modal>
      )}
    </>
  );
}

export function SendLinkButton({ o, size }: { o: Order; size?: "sm" | "md" }) {
  const [open, setOpen] = useState(false);
  const { notify, sendReminder, people } = useDemo();
  const t = byId(people, o.lines[0].t)!;
  const first = t.name.split(" ")[0];
  return (
    <>
      <Btn variant="primary" size={size} onClick={() => setOpen(true)}><MessageCircle size={13} /> Remind on WhatsApp</Btn>
      {open && (
        <Modal title="Send balance reminder" onClose={() => setOpen(false)} footer={<><Btn onClick={() => setOpen(false)}>Cancel</Btn><Btn variant="primary" onClick={() => { sendReminder(o.id); setOpen(false); notify(`Reminder sent to ${first} on WhatsApp`); }}><Send size={13} /> Send</Btn></>}>
          <div className="card-2 p-3 text-[13px] leading-relaxed">
            Hi {first}, your balance of <b className="tnum">{fmt(orderDue(o))}</b> for {pkgOf(o).name} ({dstr(byId(departures, o.dep)!.start)}) is due. Pay here: <span className="mono text-[var(--d-accent-ink)]">rzp.io/l/ht-{o.id.toLowerCase()}</span>. UPI, card or EMI. Reply here if anything has changed. · Himalayan Trails Co.
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Send by"><select className="select" defaultValue="WhatsApp"><option>WhatsApp</option><option>SMS (DLT template)</option><option>Email</option></select></Field>
            <Field label="Link expires"><select className="select" defaultValue="7"><option value="7">In 7 days</option><option value="dep">Day before departure</option></select></Field>
          </div>
          <Note>Automatic reminders already go out 7 and 2 days before the due date. This one is sent now and logged on the booking.</Note>
        </Modal>
      )}
    </>
  );
}

export function MarkOfflineButton({ o, size }: { o: Order; size?: "sm" | "md" }) {
  const [open, setOpen] = useState(false);
  const [amt, setAmt] = useState(orderDue(o));
  const [how, setHow] = useState("Bank transfer");
  const [ref, setRef] = useState("");
  const { recordPayment, notify } = useDemo();
  return (
    <>
      <Btn size={size} onClick={() => setOpen(true)}><Banknote size={13} /> Received offline</Btn>
      {open && (
        <Modal title="Mark payment received offline" onClose={() => setOpen(false)} footer={<><Btn onClick={() => setOpen(false)}>Cancel</Btn><Btn variant="primary" onClick={() => { recordPayment(o.id, { d: TODAY_S, amt, how: `Received offline · ${how.toLowerCase()}`, ref: ref || "—" }); setOpen(false); notify(`${fmt(amt)} recorded. Nothing moved through Trilyt.`); }}>Record</Btn></>}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Amount"><input className="input tnum" type="number" value={amt} onChange={(e) => setAmt(Number(e.target.value) || 0)} /></Field>
            <Field label="How"><select className="select" value={how} onChange={(e) => setHow(e.target.value)}><option>Bank transfer</option><option>Cash</option><option>UPI to my number</option></select></Field>
            <Field label="Reference" className="sm:col-span-2"><input className="input" placeholder="UTR or a note" value={ref} onChange={(e) => setRef(e.target.value)} /></Field>
          </div>
          <Note>Counts towards the order like any other payment, so the manifest and the GST invoice stay right.</Note>
        </Modal>
      )}
    </>
  );
}

export function MoveDateButton({ o, size }: { o: Order; size?: "sm" | "md" }) {
  const [open, setOpen] = useState(false);
  const { moveOrder, notify } = useDemo();
  const p = pkgOf(o);
  const others = departures.filter((x) => x.pkg === p.id && x.id !== o.dep && d(x.start) >= TODAY && seatsLeft(x) >= o.lines.length);
  const [to, setTo] = useState(others[0]?.id ?? "");
  return (
    <>
      <Btn size={size} onClick={() => setOpen(true)} disabled={!others.length}><CalendarDays size={13} /> Move date</Btn>
      {open && (
        <Modal title="Move to another departure" onClose={() => setOpen(false)} footer={<><Btn onClick={() => setOpen(false)}>Cancel</Btn><Btn variant="primary" onClick={() => { moveOrder(o.id, to); setOpen(false); notify(`Moved to ${dstr(byId(departures, to)!.start)} · traveller notified`); }}>Move {o.lines.length} seat{o.lines.length > 1 ? "s" : ""}</Btn></>}>
          <Field label="New departure"><select className="select" value={to} onChange={(e) => setTo(e.target.value)}>{others.map((x) => <option key={x.id} value={x.id}>{dstr(x.start)} – {dstr(x.end)} · {seatsLeft(x)} seats left · guide {x.guide}</option>)}</select></Field>
          <Note>Same price option and add-ons. Nothing to pay or refund. The traveller gets the new dates on WhatsApp and the old seats open up.</Note>
        </Modal>
      )}
    </>
  );
}

export function AddTravellerButton({ o, size }: { o: Order; size?: "sm" | "md" }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Nikhil Rao");
  const [phone, setPhone] = useState("+91 98xxx 00412");
  const { addTraveller, notify } = useDemo();
  const dp = byId(departures, o.dep)!; const p = pkgOf(o); const opt = byId(p.options, o.lines[0].opt)!;
  return (
    <>
      <Btn size={size} onClick={() => setOpen(true)} disabled={seatsLeft(dp) < 1}><UserPlus size={13} /> Add traveller</Btn>
      {open && (
        <Modal title="Add a traveller to this booking" onClose={() => setOpen(false)} footer={<><Btn onClick={() => setOpen(false)}>Cancel</Btn><Btn variant="primary" onClick={() => { addTraveller(o.id, name, phone); setOpen(false); notify(`${name} added · balance now includes ${fmt(opt.price)}`); }}>Add and send link</Btn></>}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name"><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></Field>
            <Field label="WhatsApp number"><input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
          </div>
          <Note>{opt.name} at <b className="tnum">{fmt(opt.price)}</b>, same as the others. {seatsLeft(dp)} seat{seatsLeft(dp) === 1 ? "" : "s"} left on this departure.</Note>
        </Modal>
      )}
    </>
  );
}

export function CancelButton({ o, size, label = "Cancel booking" }: { o: Order; size?: "sm" | "md"; label?: string }) {
  const [open, setOpen] = useState(false);
  const [extra, setExtra] = useState(false);
  const { cancelOrder, notify, people, role } = useDemo();
  const rf = refundFor(o); const p = pkgOf(o);
  const bonus = extra ? Math.round(orderTotal(o) * 0.05) : 0;
  return (
    <>
      <Btn variant="danger" size={size} onClick={() => setOpen(true)}><Ban size={13} /> {label}</Btn>
      {open && (
        <Modal title={`Cancel ${o.id}`} onClose={() => setOpen(false)} footer={<><Btn onClick={() => setOpen(false)}>Keep booking</Btn><Btn variant="danger" onClick={() => { const r = cancelOrder(o.id, bonus); setOpen(false); notify(`Cancelled · ${fmt(r.refund)} refund sent automatically`); }}>Cancel and refund {fmt(rf.refund + bonus)}</Btn></>}>
          <Field label="Who"><select className="select" defaultValue="all"><option value="all">Whole booking ({o.lines.length} traveller{o.lines.length > 1 ? "s" : ""})</option>{o.lines.map((l) => <option key={l.t}>Only {byId(people, l.t)?.name}</option>)}</select></Field>
          <div className="card-2 p-3.5">
            <dl className="grid grid-cols-[150px_1fr] gap-x-4 gap-y-1.5 text-[13.5px]">
              <dt className="text-[var(--d-ink-3)]">Days before start</dt><dd className="tnum">{rf.days}</dd>
              <dt className="text-[var(--d-ink-3)]">Policy</dt><dd>{policies[p.policy].name} · <b>{rf.pct}% charged</b> ({fmt(rf.charge)})</dd>
              <dt className="text-[var(--d-ink-3)]">Received so far</dt><dd className="tnum">{fmt(orderPaid(o))}</dd>
              <dt className="text-[var(--d-ink-3)]">Refund</dt><dd className="tnum"><b>{fmt(rf.refund + bonus)}</b> to the original method, 5–7 working days</dd>
            </dl>
          </div>
          {role === "owner" && <label className="flex items-start gap-2 text-[13px] text-[var(--d-ink-2)]"><input type="checkbox" className="mt-1" checked={extra} onChange={(e) => setExtra(e.target.checked)} /> Add a 5% goodwill refund. Only the owner can refund more than the policy.</label>}
          <Note tone="warn">The refund leaves your Razorpay balance when you confirm. If the balance is short it waits for funds; the cancellation still stands.</Note>
        </Modal>
      )}
    </>
  );
}

export function CloseDepartureButton({ depId, size }: { depId: string; size?: "sm" | "md" }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("Weather: river closed by the district administration");
  const { closeDeparture, notify, orders } = useDemo();
  const router = useRouter();
  const dp = byId(departures, depId)!; const p = byId(packages, dp.pkg)!;
  const live = orders.filter((o) => o.dep === depId && o.status !== "cancelled");
  const paid = live.reduce((s, o) => s + orderPaid(o), 0);
  const alt = departures.filter((x) => x.pkg === p.id && x.id !== depId && d(x.start) >= TODAY);
  return (
    <>
      <Btn variant="danger" size={size} onClick={() => setOpen(true)}><CloudRain size={13} /> Close departure</Btn>
      {open && (
        <Modal title={`Close ${p.name} · ${dstr(dp.start)}`} onClose={() => setOpen(false)} footer={<><Btn onClick={() => setOpen(false)}>Keep it open</Btn><Btn variant="danger" onClick={() => { const r = closeDeparture(depId); setOpen(false); notify(`Closed · ${r.orders} bookings refunded ${fmt(r.refunded)} · everyone messaged`); router.push("/demo/app/departures"); }}>Close and refund {fmt(paid)}</Btn></>}>
          <Field label="Reason (goes in the message)"><textarea className="textarea" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} /></Field>
          <div className="card-2 p-3.5">
            <dl className="grid grid-cols-[150px_1fr] gap-x-4 gap-y-1.5 text-[13.5px]">
              <dt className="text-[var(--d-ink-3)]">Bookings</dt><dd className="tnum">{live.length} · {live.reduce((s, o) => s + o.lines.length, 0)} travellers</dd>
              <dt className="text-[var(--d-ink-3)]">Refund in full</dt><dd className="tnum"><b>{fmt(paid)}</b>, policy does not apply when you cancel</dd>
              <dt className="text-[var(--d-ink-3)]">Offered instead</dt><dd>{alt.length ? alt.map((x) => dstr(x.start)).join(", ") : "No other dates yet"}</dd>
            </dl>
          </div>
          <Note tone="warn">Each traveller gets one WhatsApp message with the reason, the refund amount, and a link to move to another date instead. The departure closes to new bookings.</Note>
        </Modal>
      )}
    </>
  );
}
