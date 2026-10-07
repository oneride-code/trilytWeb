/**
 * Soft orange radial bloom used throughout the page background.
 * Purely decorative — never in the accessibility tree.
 */
export function Glow({
  className = "",
  size = 520,
  opacity = 0.22,
}: {
  className?: string;
  size?: number;
  opacity?: number;
}) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute -z-10 rounded-full blur-[110px] ${className}`}
      style={{
        width: size,
        height: size,
        opacity,
        background:
          "radial-gradient(circle, #ffd9a0 0%, #ffb878 45%, transparent 72%)",
      }}
    />
  );
}
