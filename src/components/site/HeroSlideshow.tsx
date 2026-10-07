"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Cross-fading backdrop for the ride hero. Landscape frames only — portrait
 * shots crop badly in a wide banner.
 *
 * `hairpins-aerial` is deliberately excluded: its source is 863px, so stretched
 * full-bleed it reads as visibly soft. It still appears in the gallery below,
 * where it renders around 310px wide and holds up fine.
 */
const SLIDES = [
  { src: "/gallery/hairpin-bend.jpg", w: 1080, h: 810 },
  { src: "/gallery/valley-vista.jpg", w: 1080, h: 810 },
  { src: "/gallery/sunrise-camp.jpg", w: 1200, h: 900 },
  { src: "/gallery/hammock-fog.jpg", w: 1200, h: 901 },
];

const INTERVAL_MS = 5000;

export function HeroSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      INTERVAL_MS
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {SLIDES.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt=""
          fill
          sizes="100vw"
          priority={i === 0}
          className={`object-cover transition-opacity duration-[1400ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
