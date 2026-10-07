import Image from "next/image";
import { StoreBadges } from "@/components/ui/StoreBadges";

export function DownloadCta() {
  return (
    <section id="download" className="px-lg pb-[96px] lg:px-xl">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid items-end gap-xl overflow-hidden rounded-3xl bg-brand-subtle px-xl pt-[56px] lg:grid-cols-[1.1fr_0.9fr] lg:gap-[64px] lg:px-[64px] lg:pt-[72px]">
          <div className="pb-[56px] lg:pb-[72px]">
            <h2 className="text-[32px] font-bold leading-[1.15] tracking-[-0.01em] text-text-primary lg:text-[40px]">
              Download the Trilyt app now
            </h2>
            <p className="mt-lg max-w-[420px] text-[18px] leading-[30px] text-text-secondary">
              Plan your rides, explore new places, and ride with your community
              &mdash; all in one place.
            </p>
            <StoreBadges className="mt-xl" />
          </div>

          {/* Bottom-aligned so the card's edge clips the phone, as in the design. */}
          <div className="flex justify-center self-end lg:justify-end">
            <Image
              src="/images/app-splash.png"
              alt="The Trilyt app running on a phone"
              width={200}
              height={294}
              className="w-[200px] rounded-t-[20px] lg:w-[260px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
