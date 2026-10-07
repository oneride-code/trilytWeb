"use client";

import { useSyncExternalStore } from "react";
import { UPCOMING_RIDE } from "@/lib/rides";

/** Never notifies — the value only needs to differ between server and client. */
const subscribe = () => () => {};

function computeLabel(): string | null {
  const ride = new Date(`${UPCOMING_RIDE.dateISO}T00:00:00+05:30`);
  const days = Math.ceil((ride.getTime() - Date.now()) / 86_400_000);

  if (days > 1) return `${days} days to go`;
  if (days === 1) return "Tomorrow";
  if (days === 0) return "Today";
  return null; // the ride has been and gone
}

/**
 * Days remaining until the ride, resolved in the browser.
 *
 * The pages are statically prerendered, so a countdown baked in at build time
 * goes stale overnight — a page still promising "8 days to go" a fortnight later
 * is worse than no countdown. `useSyncExternalStore` returns null during the
 * server render and the real value on the client, so there's no hydration
 * mismatch and no state update in an effect.
 */
export function DaysToGo({ className = "" }: { className?: string }) {
  const label = useSyncExternalStore(subscribe, computeLabel, () => null);

  if (!label) return null;
  return <span className={className}>{label}</span>;
}
