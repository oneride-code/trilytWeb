import Image from "next/image";
import { Glow } from "@/components/ui/Glow";
import { StoreBadges } from "@/components/ui/StoreBadges";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-lg pb-[96px] pt-[64px] lg:px-xl">
      <Glow className="-left-[160px] top-[20px]" size={520} opacity={0.2} />
      <Glow className="-right-[200px] top-[320px]" size={580} opacity={0.18} />

      <div className="mx-auto flex max-w-[1240px] flex-col items-center">
        <h1 className="text-center text-[36px] font-bold leading-[1.05] tracking-[-0.02em] text-text-primary sm:text-[48px] lg:text-[clamp(40px,5vw,68px)]">
          <span className="whitespace-nowrap">GO TOGETHER</span>{" "}
          <span className="whitespace-nowrap text-accent-orange-ink">
            PLAN BETTER
          </span>
        </h1>

        <div className="mt-[48px] w-full max-w-[960px] overflow-hidden rounded-3xl bg-card shadow-card">
          <video
            className="aspect-video w-full object-cover"
            poster="/images/hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Riders preparing for a trip with Trilyt"
          >
            <source src="/video/hero.webm" type="video/webm" />
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>
        </div>

        <p className="mt-[40px] max-w-[640px] text-center text-[18px] leading-[28px] text-text-secondary">
          Plan, coordinate, and experience your trips together with trilyt
        </p>

        <StoreBadges className="mt-xl justify-center" />

        <Image
          src="/images/rating-laurel.png"
          alt="Rated 4.8 out of 5 — app rating"
          width={162}
          height={98}
          className="mt-[48px] h-[98px] w-auto"
        />
      </div>
    </section>
  );
}
