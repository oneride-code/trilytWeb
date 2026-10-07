/**
 * The ride currently on sale. Shared by the dedicated ride page, the homepage
 * section and the announcement bar — one source of truth, so the price and date
 * can't drift apart across the site.
 *
 * STILL TO CONFIRM (currently deliberately non-specific rather than invented):
 *  - seatsNote : replace "Limited spots" with the real number, e.g. "6 of 14 left".
 *  - departure : exact time and meeting point.
 *  - returnBy  : expected arrival time.
 *  - bike      : assumes riders bring their own motorcycle; pillion policy unstated.
 *  - payment   : full vs advance, and the cancellation policy, are not stated anywhere.
 */
export const UPCOMING_RIDE = {
  slug: "kolli-hills",
  /** Used to compute the live countdown. */
  dateISO: "2026-10-10",
  href: "/rides/kolli-hills",
  name: "Kolli Hills",
  region: "Namakkal, Tamil Nadu",

  // Kolli Hills' ghat road is famously 70 hairpin bends — the brief said 80.
  // Using the verifiable figure; change here if you meant something else.
  hairpins: 70,

  dateLabel: "Sat 10 – Sun 11 October 2026",
  dateShort: "10–11 Oct",
  dayNumerals: "10–11",
  monthYear: "October 2026",
  weekdays: "Saturday – Sunday",

  duration: "2 days · 1 night",
  startFrom: "Bangalore",
  distance: "270 km each way",
  departure: "Early morning from Bangalore — exact time and meeting point confirmed on booking",
  returnBy: "Sunday evening, back in Bangalore",
  seatsNote: "Limited spots",

  priceWas: "₹2,999",
  priceNow: "₹2,799",
  saving: "₹200",

  /** One-liner used on the homepage card. */
  summary:
    "Two days in the Tamil Nadu hills — 70 hairpin bends, a night under canvas, bonfire and music, and the Agaya Gangai falls on the way home.",

  /** Short chips for the homepage card. */
  highlights: [
    "Camping",
    "Breakfast & dinner",
    "Bonfire & music",
    "Entry fees covered",
    "Tech-supported ride",
  ],
} as const;
