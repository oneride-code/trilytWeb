import Image from "next/image";

/** iPhone screen aspect (390 x 844 pt). */
export const SCREEN_W = 390;
export const SCREEN_H = 844;

/** How far artwork of this aspect can travel, as a % of its own height. */
export function maxScrollPct(width: number, height: number) {
  const artRatio = height / width;
  const viewportRatio = SCREEN_H / SCREEN_W;
  return Math.max(0, (1 - viewportRatio / artRatio) * 100);
}

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** 0 = top of the screen, 1 = bottom. Driven by the section's scroll. */
  progress: number;
  priority?: boolean;
  className?: string;
};

/** A presentational iPhone frame. The caller owns the scroll math. */
export function PhoneFrame({
  src,
  alt,
  width,
  height,
  progress,
  priority = false,
  className = "",
}: Props) {
  const travel = progress * maxScrollPct(width, height);

  return (
    <div
      className={`relative shrink-0 rounded-[46px] bg-[#1a1a1a] p-[10px] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)] ring-1 ring-black/10 ${className}`}
    >
      <div
        className="relative overflow-hidden rounded-[38px] bg-white"
        style={{ aspectRatio: `${SCREEN_W} / ${SCREEN_H}` }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className="absolute left-0 top-0 w-full will-change-transform"
          style={{ transform: `translate3d(0, -${travel}%, 0)` }}
        />
      </div>

      {/* Dynamic Island */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[22px] h-[24px] w-[86px] -translate-x-1/2 rounded-full bg-black"
      />

      {/* side buttons */}
      <span aria-hidden="true" className="absolute -left-[3px] top-[108px] h-[30px] w-[3px] rounded-l bg-[#2e2e2e]" />
      <span aria-hidden="true" className="absolute -left-[3px] top-[152px] h-[52px] w-[3px] rounded-l bg-[#2e2e2e]" />
      <span aria-hidden="true" className="absolute -left-[3px] top-[216px] h-[52px] w-[3px] rounded-l bg-[#2e2e2e]" />
      <span aria-hidden="true" className="absolute -right-[3px] top-[176px] h-[82px] w-[3px] rounded-r bg-[#2e2e2e]" />
    </div>
  );
}
