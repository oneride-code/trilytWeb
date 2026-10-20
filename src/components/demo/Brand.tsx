"use client";

import Image from "next/image";
import Link from "next/link";
import { useDemo } from "@/lib/demo/store";

/** The Trilyt mark (exported from Figma into /public/images), dark on light surfaces and vice versa. */
export function TrilytMark({ height = 24, className = "" }: { height?: number; className?: string }) {
  const { theme } = useDemo();
  const dark = theme === "dark";
  return (
    <Image src={dark ? "/images/logo-light.png" : "/images/logo-dark.png"} alt="Trilyt" width={dark ? 672 : 550} height={dark ? 553 : 452}
      className={`w-auto ${className}`} style={{ height }} priority />
  );
}

export function TrilytLogo({ height = 24, href = "/demo", sub, className = "" }: { height?: number; href?: string; sub?: string; className?: string }) {
  return (
    <Link href={href} className={`flex items-center gap-2.5 ${className}`} aria-label="Trilyt">
      <TrilytMark height={height} />
      {sub && <span className="text-[13px] text-[var(--d-ink-3)]">{sub}</span>}
    </Link>
  );
}
