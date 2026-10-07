import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { RideBookingBar } from "@/components/site/RideBookingBar";
import { RideGallery } from "@/components/site/RideGallery";
import { HeroSlideshow } from "@/components/site/HeroSlideshow";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Glow } from "@/components/ui/Glow";
import { UPCOMING_RIDE } from "@/lib/rides";
import {
  IconBike,
  IconCheck,
  IconClock,
  IconFlame,
  IconMinus,
  IconMusic,
  IconPin,
  IconPlate,
  IconRoute,
  IconSignal,
  IconTent,
  IconTicket,
  IconUsers,
  IconWater,
} from "@/components/ui/RideIcons";

/** Ride data is shared with the homepage — see src/lib/rides.ts. */
const RIDE = UPCOMING_RIDE;

export const metadata: Metadata = {
  title: "Kolli Hills Ride — 10 October",
  description:
    "Two days to Kolli Hills: 70 hairpin bends, camping, a bonfire with music, and the Agaya Gangai waterfalls. Stay, breakfast, dinner and a tech-supported group ride included. ₹2,799.",
};

/* ---------------------------------------------------------------- includes */

const INCLUDED = [
  {
    icon: IconTent,
    title: "Stay",
    body: "A night under canvas in the hills, pitched and ready when you arrive. Each tent is shared between two people.",
  },
  {
    icon: IconPlate,
    title: "Breakfast & dinner",
    body: "2 breakfasts and dinner — from the first chai stop to breakfast before the ride home.",
  },
  {
    icon: IconFlame,
    title: "Bonfire",
    body: "A fire at camp once the light drops, and the group you just rode in with.",
  },
  {
    icon: IconMusic,
    title: "Music",
    body: "The part of the night nobody wants to end.",
  },
  {
    icon: IconUsers,
    title: "The right group",
    body: "Riders who match your energy — curated, not just whoever signed up.",
  },
  {
    icon: IconSignal,
    title: "Tech-supported ride",
    body: "Live location, shared route and regroup alerts through the Trilyt app. Nobody gets lost.",
  },
];

/* --------------------------------------------------------------- itinerary */

const ITINERARY = [
  {
    day: "Day 1",
    date: "Saturday, 10 October",
    title: "The climb",
    meals: "Breakfast on the road · Dinner at camp",
    stops: [
      {
        icon: IconRoute,
        label: `${RIDE.hairpins} hairpin bends`,
        body: "The reason you came. A continuous climb that unfolds one switchback at a time.",
      },
      {
        icon: IconPin,
        label: "Sightseeing",
        body: "Viewpoints along the ridge, with time to stop properly rather than glance and go.",
      },
      {
        icon: IconTent,
        label: "Camp for the night",
        body: "Settle in as the light drops over the valley.",
      },
      {
        icon: IconFlame,
        label: "Bonfire and music",
        body: "Gather round the fire, with music and the group you just rode in with.",
      },
    ],
  },
  {
    day: "Day 2",
    date: "Sunday, 11 October",
    title: "Water and the way home",
    meals: "Breakfast at camp",
    stops: [
      {
        icon: IconWater,
        label: "Agaya Gangai waterfalls",
        body: "A proper descent to one of Tamil Nadu's finest falls.",
      },
      {
        icon: IconPlate,
        label: "Optional relax stop",
        body: "Boat house or botanical garden — take it or skip it, your call. Entry is covered either way.",
      },
      {
        icon: IconBike,
        label: "Ride back to Bangalore",
        body: "Unhurried, with stops where they make sense.",
      },
    ],
  },
];

/* Everything the ticket price covers — the six cards above, plus entry fees. */
const COVERED = [...INCLUDED.map((i) => i.title), "All entry fees"];

/* CONFIRM: drafted from what a ride of this kind normally excludes. */
const NOT_INCLUDED = [
  "Lunch on both days",
  "Your motorcycle, riding gear and helmet",
  "Fuel for your own bike",
  "Personal expenses and anything bought off-itinerary",
];

const FAQS = [
  {
    q: "Do I need my own bike?",
    a: "Yes — this is a self-ride. Bring your own motorcycle, in good condition, with valid documents and proper riding gear.",
  },
  {
    q: "Is lunch included?",
    a: "No — we cover breakfast and dinner. Lunch on both days is on you, so pick something up on the road.",
  },
  {
    q: "What does tech-supported actually mean?",
    a: "The whole route is loaded into the Trilyt app before we leave. You get live group location, the shared route, and regroup alerts — so nobody is riding on screenshots or guesswork.",
  },
  {
    q: "I'm riding solo. Will that be odd?",
    a: "Most people come solo. The group is put together deliberately so the energy matches — that's rather the point.",
  },
  {
    q: "How do I book?",
    a: "Tap Book now and reserve your spot on our booking page. The exact meeting point and departure time are confirmed on booking.",
  },
];

/* ------------------------------------------------------------------- page */

function QuickFact({
  icon: Icon,
  label,
  value,
}: {
  icon: (p: { className?: string }) => React.JSX.Element;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-md">
      <Icon className="mt-[2px] text-accent-orange" />
      <div>
        <p className="text-caption-sm uppercase tracking-[0.08em] text-white/50">
          {label}
        </p>
        <p className="text-label-md mt-[2px] text-white">{value}</p>
      </div>
    </div>
  );
}

export default function KolliHillsRidePage() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* ---------------------------------------------------------- hero */}
        <section className="relative overflow-hidden bg-brand">
          <HeroSlideshow />

          {/* Two scrims instead of one flat wash: a horizontal one that keeps
              the left column readable, and a lighter vertical one. The photo
              stays legible on the right rather than being crushed to grey. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/25"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70"
          />

          <div className="relative mx-auto max-w-[1240px] px-lg py-[72px] lg:px-xl lg:py-[96px]">
            {/* Date as an event-poster block, not a badge. */}
            <div className="flex items-center gap-lg">
              <div className="flex items-baseline gap-[2px] text-white">
                <span className="text-[38px] font-extrabold leading-none tracking-[-0.03em]">
                  10
                </span>
                <span className="text-[38px] font-extrabold leading-none tracking-[-0.03em] text-accent-orange">
                  –11
                </span>
              </div>
              <span aria-hidden="true" className="h-[34px] w-px bg-white/25" />
              <div className="text-[13px] leading-[18px]">
                <p className="font-semibold text-white">October 2026</p>
                <p className="text-white/60">Saturday – Sunday</p>
              </div>
            </div>

            <h1 className="mt-xl max-w-[16ch] text-[44px] font-bold leading-[1.02] tracking-[-0.02em] text-white lg:text-[72px]">
              {RIDE.name}{" "}
              <span className="text-accent-orange">
                {RIDE.hairpins} hairpin bends
              </span>
            </h1>

            <p className="mt-lg max-w-[56ch] text-[18px] leading-[30px] text-white/70">
              Two days in the {RIDE.region} hills. You ride, we handle the rest
              — camp, breakfast and dinner, a bonfire night with music, and a
              waterfall on the way home.
            </p>

            {/* price + CTA, above the fold */}
            <div className="mt-[40px] flex flex-col gap-lg sm:flex-row sm:items-center">
              <div className="flex items-baseline gap-md">
                <span className="text-[40px] font-bold leading-none text-white lg:text-[48px]">
                  {RIDE.priceNow}
                </span>
                <span className="text-[20px] text-white/40 line-through">
                  {RIDE.priceWas}
                </span>
                <span className="text-label-sm rounded-half bg-accent-orange px-md py-xs text-[#1a0d06]">
                  Save {RIDE.saving}
                </span>
              </div>

              <a
                href={RIDE.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-label-lg inline-flex items-center justify-center rounded-half bg-white px-[32px] py-lg text-text-primary transition-opacity hover:opacity-90 sm:ml-auto"
              >
                Book now
              </a>
            </div>

            {/* the facts nobody should have to hunt for */}
            <div className="mt-[48px] grid gap-lg border-t border-white/15 pt-xl sm:grid-cols-2 lg:grid-cols-4">
              <QuickFact icon={IconClock} label="Duration" value={RIDE.duration} />
              <QuickFact icon={IconPin} label="Starts from" value={RIDE.startFrom} />
              <QuickFact icon={IconRoute} label="Distance" value={RIDE.distance} />
              <QuickFact icon={IconUsers} label="Spots" value={RIDE.seatsNote} />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ included */}
        <section className="relative overflow-hidden px-lg py-[80px] lg:px-xl">
          <Glow className="-right-[140px] top-[60px]" size={480} opacity={0.18} />

          <div className="mx-auto max-w-[1240px]">
            <Eyebrow>What&rsquo;s included</Eyebrow>
            <h2 className="mt-lg max-w-[20ch] text-[30px] font-bold leading-[1.2] tracking-[-0.01em] text-text-primary lg:text-[36px]">
              Everything except the riding.
            </h2>

            <div className="mt-[40px] grid gap-lg sm:grid-cols-2 lg:grid-cols-3">
              {INCLUDED.map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-border-default bg-card p-xl shadow-card"
                >
                  <item.icon className="text-accent-orange-ink" />
                  <h3 className="text-label-lg mt-md text-text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-sm text-[15px] leading-[24px] text-text-secondary">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Entry fees are on us — stated as its own promise, because
                "no surprise costs" is what stops people hesitating. */}
            <div className="mt-lg flex flex-col items-start gap-md rounded-3xl border border-border-success-subtle bg-success-subtle p-xl sm:flex-row sm:items-center sm:gap-lg">
              <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-half bg-white text-icon-success">
                <IconTicket />
              </span>
              <div>
                <h3 className="text-label-lg text-text-primary">
                  Entry fees are on us
                </h3>
                <p className="mt-xs text-[15px] leading-[24px] text-text-secondary">
                  Every stop on the itinerary — the falls, the viewpoints, the
                  optional boat house or botanical garden. You won&rsquo;t be
                  asked for cash at a gate all weekend.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------- itinerary */}
        <section className="px-lg pb-[80px] lg:px-xl">
          <div className="mx-auto max-w-[1240px]">
            <Eyebrow>The plan</Eyebrow>
            <h2 className="mt-lg text-[30px] font-bold leading-[1.2] tracking-[-0.01em] text-text-primary lg:text-[36px]">
              Two days, start to finish.
            </h2>

            <div className="mt-[40px] grid gap-lg lg:grid-cols-2">
              {ITINERARY.map((day) => (
                <div
                  key={day.day}
                  className="rounded-3xl border border-border-default bg-card p-xl lg:p-[32px]"
                >
                  <div className="flex items-baseline gap-md">
                    <span className="text-[28px] font-extrabold leading-none text-accent-orange-ink">
                      {day.day}
                    </span>
                    <span className="text-caption-md text-text-tertiary">
                      {day.date}
                    </span>
                  </div>
                  <h3 className="mt-sm text-[22px] font-bold text-text-primary">
                    {day.title}
                  </h3>

                  <p className="text-caption-md mt-md inline-flex items-center gap-sm rounded-lg bg-brand-subtle px-md py-sm text-text-secondary">
                    <IconPlate className="h-[16px] w-[16px] text-accent-orange-ink" />
                    {day.meals}
                  </p>

                  <ol className="mt-xl flex flex-col gap-lg">
                    {day.stops.map((stop) => (
                      <li key={stop.label} className="flex gap-md">
                        <span className="mt-[2px] flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-half bg-brand-subtle text-accent-orange-ink">
                          <stop.icon className="h-[19px] w-[19px]" />
                        </span>
                        <div>
                          <p className="text-label-lg text-text-primary">
                            {stop.label}
                          </p>
                          <p className="mt-xs text-[15px] leading-[24px] text-text-secondary">
                            {stop.body}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>

            {/* timings sit right under the itinerary, where they're wanted */}
            <div className="mt-lg grid gap-lg rounded-3xl bg-brand-subtle p-xl sm:grid-cols-2">
              <div className="flex items-start gap-md">
                <IconClock className="mt-[2px] text-accent-orange-ink" />
                <div>
                  <p className="text-caption-sm uppercase tracking-[0.08em] text-text-tertiary">
                    Departure
                  </p>
                  <p className="text-label-md mt-xs text-text-primary">
                    {RIDE.departure}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-md">
                <IconPin className="mt-[2px] text-accent-orange-ink" />
                <div>
                  <p className="text-caption-sm uppercase tracking-[0.08em] text-text-tertiary">
                    Back in Bangalore
                  </p>
                  <p className="text-label-md mt-xs text-text-primary">
                    {RIDE.returnBy}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- gallery */}
        <section className="relative overflow-hidden px-lg pb-[80px] lg:px-xl">
          <Glow className="-left-[160px] top-[80px]" size={520} opacity={0.16} />

          <div className="mx-auto max-w-[1240px]">
            <Eyebrow>The weekend</Eyebrow>
            <h2 className="mt-lg max-w-[18ch] text-[30px] font-bold leading-[1.2] tracking-[-0.01em] text-text-primary lg:text-[36px]">
              What you&rsquo;re actually signing up for.
            </h2>
            <p className="mt-md max-w-[62ch] text-[17px] leading-[28px] text-text-secondary">
              The climb, the camp, the fire, the fog, and the falls — roughly in
              the order you&rsquo;ll meet them. Campsite shots are from previous
              Trilyt rides.
            </p>

            <div className="mt-xl">
              <RideGallery />
            </div>
          </div>
        </section>

        {/* -------------------------------------------- included / not incl */}
        <section className="px-lg pb-[80px] lg:px-xl">
          <div className="mx-auto grid max-w-[1240px] gap-lg lg:grid-cols-2">
            <div className="rounded-3xl border border-border-success-subtle bg-success-subtle p-xl lg:p-[32px]">
              <h3 className="text-[20px] font-bold text-text-primary">
                Covered by your {RIDE.priceNow}
              </h3>
              <ul className="mt-lg flex flex-col gap-md">
                {COVERED.map((item) => (
                  <li key={item} className="flex items-start gap-md">
                    <IconCheck className="mt-[1px] h-[19px] w-[19px] text-icon-success" />
                    <span className="text-[15px] leading-[24px] text-text-secondary">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-border-default bg-card p-xl lg:p-[32px]">
              <h3 className="text-[20px] font-bold text-text-primary">
                Not included
              </h3>
              <ul className="mt-lg flex flex-col gap-md">
                {NOT_INCLUDED.map((item) => (
                  <li key={item} className="flex items-start gap-md">
                    <IconMinus className="mt-[1px] h-[19px] w-[19px] text-text-tertiary" />
                    <span className="text-[15px] leading-[24px] text-text-secondary">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------- faq */}
        <section className="px-lg pb-[80px] lg:px-xl">
          <div className="mx-auto max-w-[860px]">
            <Eyebrow>Before you book</Eyebrow>
            <h2 className="mt-lg text-[30px] font-bold leading-[1.2] tracking-[-0.01em] text-text-primary lg:text-[36px]">
              The things people ask.
            </h2>

            <div className="mt-xl flex flex-col gap-md">
              {FAQS.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-lg border border-border-default bg-card px-xl py-lg"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-lg text-[17px] font-semibold leading-[26px] text-text-primary [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <svg
                      viewBox="0 0 24 24"
                      className="h-[20px] w-[20px] shrink-0 text-icon-secondary transition-all duration-200 group-open:-rotate-180 group-open:text-accent-orange-ink"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </summary>
                  <p className="mt-md text-[15px] leading-[26px] text-text-secondary">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- closing cta */}
        <section className="px-lg pb-[80px] lg:px-xl">
          <div className="mx-auto max-w-[1240px] overflow-hidden rounded-3xl bg-brand px-xl py-[56px] text-center lg:px-[64px] lg:py-[72px]">
            <h2 className="mx-auto max-w-[20ch] text-[30px] font-bold leading-[1.15] tracking-[-0.01em] text-white lg:text-[40px]">
              {RIDE.hairpins} bends, one night, and a group worth riding with.
            </h2>
            <p className="mt-lg text-[17px] text-white/60">
              {RIDE.dateLabel} · from {RIDE.startFrom} · {RIDE.priceNow}
            </p>
            <a
              href={RIDE.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-label-lg mt-xl inline-flex items-center justify-center rounded-half bg-accent-orange px-[36px] py-lg text-[#1a0d06] transition-opacity hover:opacity-90"
            >
              Book now
            </a>
            <p className="text-caption-md mt-md text-white/40">
              Limited spots &mdash; book early to hold yours.
            </p>
          </div>
        </section>
      </main>

      <RideBookingBar
        priceWas={RIDE.priceWas}
        priceNow={RIDE.priceNow}
        seatsNote={RIDE.seatsNote}
        bookingUrl={RIDE.bookingUrl}
      />

      <Footer />
    </>
  );
}
