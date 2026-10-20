"use client";

import { useEffect } from "react";
import { useDemo } from "@/lib/demo/store";

/**
 * Applies the demo theme to <html data-theme> on mount (the root layout pins
 * the marketing site to light) and restores light when leaving /demo.
 */
export function ThemeBoot() {
  const { theme, setTheme } = useDemo();
  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem("trilyt-demo-theme"); } catch {}
    setTheme(saved === "light" || saved === "dark" ? saved : theme);
    return () => { document.documentElement.dataset.theme = "light"; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
