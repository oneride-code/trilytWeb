import Image from "next/image";

/**
 * Trilyt logo — the real mark, exported from Figma via `download_assets`
 * (source images 01/06) and keyed to a transparent background.
 * `variant` picks the dark mark for light surfaces and vice versa.
 */
export function Logo({
  className = "",
  variant = "dark",
  height = 42,
}: {
  className?: string;
  variant?: "dark" | "light";
  height?: number;
}) {
  const src = variant === "dark" ? "/images/logo-dark.png" : "/images/logo-light.png";
  return (
    <Image
      src={src}
      alt="Trilyt"
      width={variant === "dark" ? 550 : 672}
      height={variant === "dark" ? 452 : 553}
      className={`w-auto ${className}`}
      style={{ height }}
      priority
    />
  );
}
