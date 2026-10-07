import { TRILYT_INSTAGRAM_DM_URL } from "@/lib/links";

/**
 * Always-visible booking bar pinned to the bottom of the viewport.
 *
 * The brief was that nothing important should have to be hunted for — so the
 * price and the way to book travel with the reader the whole way down the page,
 * rather than living only in the hero and the footer.
 */
export function RideBookingBar({
  priceWas,
  priceNow,
  seatsNote,
}: {
  priceWas: string;
  priceNow: string;
  seatsNote?: string;
}) {
  return (
    <div className="sticky bottom-0 z-40 border-t border-border-default bg-page/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-lg px-lg py-md lg:px-xl">
        <div className="min-w-0">
          <div className="flex items-baseline gap-sm">
            <span className="text-[22px] font-bold leading-none text-text-primary lg:text-[26px]">
              {priceNow}
            </span>
            <span className="text-body-sm text-text-tertiary line-through">
              {priceWas}
            </span>
          </div>
          {seatsNote && (
            <p className="text-caption-sm mt-xs truncate text-accent-orange-ink">
              {seatsNote}
            </p>
          )}
        </div>

        <a
          href={TRILYT_INSTAGRAM_DM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-label-md shrink-0 rounded-half bg-brand px-xl py-md text-text-on-brand transition-opacity hover:opacity-90"
        >
          Book on Instagram
        </a>
      </div>
    </div>
  );
}
