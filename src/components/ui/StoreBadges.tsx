import Image from "next/image";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/links";

/**
 * Google Play / App Store badges — the official artwork as uploaded to Figma,
 * pulled at source resolution via `download_assets`.
 */
export function StoreBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-md ${className}`}>
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get Trilyt on Google Play"
        className="inline-block transition-opacity hover:opacity-85"
      >
        <Image
          src="/images/badge-google-play.png"
          alt="Get it on Google Play"
          width={810}
          height={240}
          className="h-[48px] w-auto"
        />
      </a>
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download Trilyt on the App Store"
        className="inline-block transition-opacity hover:opacity-85"
      >
        <Image
          src="/images/badge-app-store.png"
          alt="Download on the App Store"
          width={360}
          height={120}
          className="h-[48px] w-auto"
        />
      </a>
    </div>
  );
}
