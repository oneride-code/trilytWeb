"use client";

import { useEffect, useRef, useState } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Glow } from "@/components/ui/Glow";
import { PhoneFrame, maxScrollPct } from "@/components/ui/PhoneFrame";

type Feature = (typeof FEATURES)[number];

const FEATURES = [
  {
    number: "01",
    title: "Ride Your Way",
    body:
      "Ride solo or with your crew. Whether you're heading out alone or joining a group, Trilyt keeps the experience connected.",
    screen: {
      src: "/screens/ride-your-way.png",
      width: 780,
      height: 3740,
      alt: "Trilyt app — explore and join rides",
    },
  },
  {
    number: "02",
    title: "Plan Your Trip",
    body:
      "Build your journey before you leave. Organise destinations, routes, stops, and the details that make your ride yours.",
    screen: {
      src: "/screens/trip-plan.png",
      width: 780,
      height: 3602,
      alt: "Trilyt app — trip plan with route, stops and expenses",
    },
  },
  {
    number: "03",
    title: "Know Your Budget",
    body:
      "Get an estimated view of what your trip could cost, whether you're travelling solo or sharing the journey with others.",
    screen: {
      src: "/screens/trip-budget.png",
      width: 780,
      height: 2084,
      alt: "Trilyt app — trip budget and cost breakdown",
    },
  },
  {
    number: "04",
    title: "Find Your Community",
    body:
      "Discover rides and connect with people who share the same passion for exploring and riding.",
    screen: {
      src: "/screens/community.png",
      width: 780,
      height: 2090,
      alt: "Trilyt app — riding communities",
    },
  },
];

/**
 * One feature step. The outer element is taller than the viewport and the inner
 * one is sticky, so the row pins while the page scrolls through that extra
 * height — and the phone's screen scrolls top-to-bottom across exactly that
 * span. The page only moves on once the screen has been read all the way down.
 *
 * Extra height scales with how much screen there is to read, so short screens
 * don't hold the viewer longer than they need to.
 */
function FeatureRow({ feature, index }: { feature: Feature; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const phoneFirst = index % 2 === 1;

  const extraVh = Math.round(
    30 + maxScrollPct(feature.screen.width, feature.screen.height) * 1.2
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const distance = el.offsetHeight - window.innerHeight;
      if (distance <= 0) {
        setProgress(0);
        return;
      }
      const p = -el.getBoundingClientRect().top / distance;
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-sticky-scroll
      className="relative"
      style={{ height: `calc(100vh + ${extraVh}vh)` }}
    >
      <div data-sticky-inner className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto w-full max-w-[1240px] px-lg lg:px-xl">
          <div className="relative grid items-center gap-[32px] lg:grid-cols-2 lg:gap-[80px]">
            <Glow
              className={phoneFirst ? "-left-[60px] top-[40px]" : "-right-[60px] top-[40px]"}
              size={460}
              opacity={0.22}
            />

            <div className={phoneFirst ? "lg:order-2" : "lg:order-1"}>
              <div className="flex items-center gap-lg">
                <span
                  className="text-[52px] font-extrabold leading-none lg:text-[80px]"
                  style={{
                    background:
                      "linear-gradient(160deg, #FFD9A0 0%, #FF9A56 55%, #FF6B35 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                  aria-hidden="true"
                >
                  {feature.number}
                </span>
                <h3 className="text-[22px] font-bold leading-[1.2] text-text-primary lg:text-[28px]">
                  {feature.title}
                </h3>
              </div>
              <p className="mt-md max-w-[460px] text-[16px] leading-[26px] text-text-secondary lg:mt-lg lg:text-[18px] lg:leading-[30px]">
                {feature.body}
              </p>
            </div>

            <div
              className={`flex justify-center ${phoneFirst ? "lg:order-1 lg:justify-start" : "lg:order-2 lg:justify-end"}`}
            >
              <PhoneFrame
                src={feature.screen.src}
                alt={feature.screen.alt}
                width={feature.screen.width}
                height={feature.screen.height}
                progress={progress}
                priority={index === 0}
                className="w-[200px] sm:w-[240px] lg:w-[300px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section id="why" className="relative">
      <div className="mx-auto max-w-[1240px] px-lg pt-[96px] lg:px-xl">
        <div className="flex flex-col items-center text-center">
          <Eyebrow>Why Trilyt</Eyebrow>
          <h2 className="mt-xl text-[32px] font-bold leading-[1.2] tracking-[-0.01em] text-text-primary lg:text-[36px]">
            Everything you need for the ride.
          </h2>
          <p className="mt-lg max-w-[820px] text-[18px] leading-[30px] text-text-secondary">
            From planning your next trip to riding with your community, Trilyt
            brings the tools you need into one simple experience.
          </p>
        </div>
      </div>

      {FEATURES.map((feature, i) => (
        <FeatureRow key={feature.number} feature={feature} index={i} />
      ))}
    </section>
  );
}
