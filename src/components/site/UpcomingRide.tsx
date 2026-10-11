import Image from "next/image";
import Link from "next/link";
import { UPCOMING_RIDE as RIDE } from "@/lib/rides";
import { DaysToGo } from "@/components/site/DaysToGo";

/**
 * The next ride, on the homepage.
 *
 * Sits directly below the hero rather than further down: the rides are the
 * thing people actually buy, they're date-limited, and the feature section
 * underneath runs to several screens of pinned scrolling — anything placed
 * after it is effectively hidden.
 */
export function UpcomingRide() {
  return (
    <section id="next-ride" className="px-lg pb-[80px] lg:px-xl">
      <div className="mx-auto max-w-[1240px] overflow-hidden rounded-3xl bg-brand">
        <div className="grid lg:grid-cols-[1.05fr_1fr]">
          {/* photo */}
          <div className="relative min-h-[260px] lg:min-h-[480px]">
            <Image
              src="/gallery/sunrise-camp.jpg"
              alt="Sunrise over the camp at Kolli Hills, mist in the valley below"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/40"
            />
          </div>

          {/* details */}
          <div className="p-xl lg:p-[48px]">
            <div className="flex items-center gap-md">
              <span className="text-label-sm rounded-half bg-accent-orange px-md py-[3px] text-[#1a0d06]">
                Next ride
              </span>
              <span className="text-caption-md text-white/50">
                {RIDE.seatsNote} <DaysToGo className="text-accent-orange" />
              </span>
            </div>

            {/* same poster-style date block as the ride page */}
            <div className="mt-xl flex items-center gap-lg">
              <div className="flex items-baseline gap-[2px] text-white">
                <span className="text-[32px] font-extrabold leading-none tracking-[-0.03em]">
                  {RIDE.dayStart}
                </span>
                <span className="text-[32px] font-extrabold leading-none tracking-[-0.03em] text-accent-orange">
                  –{RIDE.dayEnd}
                </span>
              </div>
              <span aria-hidden="true" className="h-[30px] w-px bg-white/25" />
              <div className="text-[13px] leading-[18px]">
                <p className="font-semibold text-white">{RIDE.monthYear}</p>
                <p className="text-white/55">{RIDE.weekdays}</p>
              </div>
            </div>

            <h2 className="mt-lg text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-white lg:text-[40px]">
              {RIDE.name}{" "}
              <span className="text-accent-orange">
                {RIDE.hairpins} hairpin bends
              </span>
            </h2>

            <p className="mt-md max-w-[48ch] text-[16px] leading-[26px] text-white/65">
              {RIDE.summary}
            </p>

            <ul className="mt-lg flex flex-wrap gap-sm">
              {RIDE.highlights.map((item) => (
                <li
                  key={item}
                  className="text-caption-md rounded-half border border-white/15 px-md py-xs text-white/75"
                >
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-xl flex flex-wrap items-center gap-lg">
              <div className="flex items-baseline gap-sm">
                <span className="text-[30px] font-bold leading-none text-white">
                  {RIDE.priceNow}
                </span>
                <span className="text-[16px] text-white/35 line-through">
                  {RIDE.priceWas}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-md">
                <Link
                  href={RIDE.href}
                  className="text-label-md rounded-half bg-white px-xl py-md text-text-primary transition-opacity hover:opacity-90"
                >
                  See the full ride
                </Link>
                <a
                  href={RIDE.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-label-md rounded-half border border-white/25 px-xl py-md text-white transition-colors hover:border-white/60"
                >
                  Book now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
