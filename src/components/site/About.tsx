import { Eyebrow } from "@/components/ui/Eyebrow";
import { Logo } from "@/components/ui/Logo";

export function About() {
  return (
    <section id="about" className="relative px-lg py-[96px] lg:px-xl">
      <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
        <Eyebrow>About Trilyt</Eyebrow>

        <h2 className="mt-xl text-[32px] font-bold leading-[1.2] tracking-[-0.01em] text-text-primary lg:text-[36px]">
          Plan it. Ride it. Experience it.
        </h2>

        <p className="mt-lg text-[18px] leading-[30px] text-text-secondary">
          Trilyt is a platform for people who love to ride and explore. Ride solo
          or with your community, plan trips, discover routes, and get a clear
          estimate of your trip budget before you go.
        </p>

        <div className="mt-[56px] flex flex-col items-center gap-xs text-text-primary">
          <Logo />
          <p className="text-caption-md text-text-tertiary">
            Powered by AccelRyde Technologies LLP
          </p>
        </div>
      </div>
    </section>
  );
}
