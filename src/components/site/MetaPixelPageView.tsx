"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Meta Pixel PageView on client-side navigation. The first page view is sent
 * by the pixel's init snippet in Analytics, so the first render is skipped.
 */
export function MetaPixelPageView() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    (window as unknown as { fbq?: (cmd: "track", event: string) => void }).fbq?.("track", "PageView");
  }, [pathname]);

  return null;
}
