import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DemoStoreProvider } from "@/lib/demo/store";
import { ThemeBoot } from "@/components/demo/ThemeBoot";
import { Toast } from "@/components/demo/ui";
import { Tour } from "@/components/demo/Tour";
import "./demo.css";

const sans = Geist({ variable: "--font-sans", subsets: ["latin"], display: "swap" });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Trilyt for operators",
  description: "Bookings, departures, payments and refunds for Indian travel operators. Product demo with sample data.",
};

/**
 * Everything under /demo is the product demo: its own tokens, a theme toggle
 * and an in-memory store. The marketing site outside /demo stays pinned light.
 */
export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`demo ${sans.variable} ${mono.variable} min-h-dvh`}>
      <DemoStoreProvider initialTheme="light">
        <ThemeBoot />
        {children}
        <Tour />
        <Toast />
      </DemoStoreProvider>
    </div>
  );
}
