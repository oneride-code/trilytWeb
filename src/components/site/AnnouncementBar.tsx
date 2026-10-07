import Link from "next/link";
import { UPCOMING_RIDE as RIDE } from "@/lib/rides";
import { DaysToGo } from "@/components/site/DaysToGo";

/**
 * Slim strip above the header on the homepage. The ride is time-limited and
 * revenue-generating, so it gets one line that is impossible to scroll past —
 * the full pitch lives in the section further down.
 */
export function AnnouncementBar() {
  return (
    <Link
      href={RIDE.href}
      className="group block bg-brand text-text-on-brand transition-colors hover:bg-[#222]"
    >
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-center gap-x-md gap-y-xs px-lg py-sm text-center lg:px-xl">
        <span className="text-label-sm rounded-half bg-accent-orange px-sm py-[2px] text-[#1a0d06]">
          Next ride
        </span>
        <span className="text-label-md text-white">
          {RIDE.name} · {RIDE.dateShort}
        </span>
        <span className="text-label-md text-white/55">
          from {RIDE.priceNow}
        </span>
        <DaysToGo className="text-label-md hidden text-white/55 sm:inline" />
        <span className="text-label-md inline-flex items-center gap-xs text-accent-orange">
          Book now
          <svg
            viewBox="0 0 24 24"
            className="h-[14px] w-[14px] transition-transform group-hover:translate-x-[2px]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
