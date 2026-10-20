import Link from "next/link";

/**
 * The operator-software pitch on the homepage. The consumer app is shown
 * first; this section hands travel operators off to the product page at /demo
 * and to the enquiry form.
 */
const POINTS = [
  ["Bookings from every channel", "Website, WhatsApp, Instagram, walk-ins and agents land as one booking with a payment link."],
  ["Paid to your own account", "Travellers pay through your own Razorpay account. Deposits, balances and refunds run on policy."],
  ["Built for India", "GST invoices, WhatsApp reminders, agent net rates, a manifest for the guide's phone."],
] as const;

export function ForOperators() {
  return (
    <section id="operators" className="px-lg py-[80px] lg:px-xl">
      <div className="mx-auto max-w-[1240px] overflow-hidden rounded-3xl bg-brand">
        <div className="grid gap-xl p-xl lg:grid-cols-[1.1fr_1fr] lg:p-[56px]">
          <div>
            <span className="text-label-sm rounded-half bg-accent-orange px-md py-[3px] text-[#1a0d06]">For travel operators</span>
            <h2 className="mt-lg text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-white lg:text-[40px]">
              Run every departure.{" "}
              <span className="text-accent-orange">Get paid to your own account.</span>
            </h2>
            <p className="mt-md max-w-[48ch] text-[16px] leading-[26px] text-white/65">
              Trilyt also makes the software behind trek companies, bike expeditions, weekend camps and group tours: bookings, deposits and balances, manifests, refunds and GST, with no monthly fee.
            </p>
            <div className="mt-xl flex flex-wrap gap-md">
              <Link href="/demo" className="text-label-md inline-flex items-center gap-sm rounded-half bg-accent-orange px-xl py-md text-[#1a0d06] transition-opacity hover:opacity-90">
                See the product
              </Link>
              <Link href="/demo/enquiry" className="text-label-md inline-flex items-center gap-sm rounded-half border border-white/25 px-xl py-md text-white transition-colors hover:bg-white/10">
                Send an enquiry
              </Link>
            </div>
            <p className="mt-md text-caption-md text-white/50">1.75% per online order, capped at ₹999 · ₹0 a month · contact@accelryde.com</p>
          </div>
          <ul className="flex flex-col gap-md self-center">
            {POINTS.map(([h, t]) => (
              <li key={h} className="rounded-2xl border border-white/12 p-lg">
                <p className="text-[16px] font-semibold text-white">{h}</p>
                <p className="mt-xs text-[14px] leading-[22px] text-white/60">{t}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
