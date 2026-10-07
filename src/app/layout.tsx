import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Analytics } from "@/components/site/Analytics";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trilyt",
  description: "Trilyt — plan, track and share your trips.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The marketing site is light-only in Figma. Dark tokens exist in
    // globals.css for the app surface, but the site is pinned to light.
    <html
      lang="en"
      data-theme="light"
      className={`${manrope.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
