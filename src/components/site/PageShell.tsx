import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

/**
 * Shell for the standalone content pages (about, careers, contact, legal).
 * Keeps them on the same header/footer and type scale as the landing page.
 */
export function PageShell({
  title,
  intro,
  lastUpdated,
  children,
}: {
  title: string;
  intro?: string;
  lastUpdated?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 px-lg py-[72px] lg:px-xl lg:py-[96px]">
        <div className="mx-auto max-w-[760px]">
          <h1 className="text-[36px] font-bold leading-[1.15] tracking-[-0.02em] text-text-primary lg:text-[44px]">
            {title}
          </h1>

          {lastUpdated && (
            <p className="text-caption-md mt-md text-text-tertiary">
              Last updated: {lastUpdated}
            </p>
          )}

          {intro && (
            <p className="mt-lg text-[18px] leading-[30px] text-text-secondary">
              {intro}
            </p>
          )}

          <div className="mt-[48px] flex flex-col gap-[40px]">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}

/** A titled block within a content page. */
export function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-[22px] font-bold leading-[1.3] text-text-primary">
        {heading}
      </h2>
      <div className="mt-md flex flex-col gap-md text-[16px] leading-[28px] text-text-secondary [&_a]:text-accent-orange-ink [&_a]:underline [&_a]:underline-offset-2 [&_li]:pl-xs [&_strong]:font-semibold [&_strong]:text-text-primary [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-sm [&_ul]:pl-xl">
        {children}
      </div>
    </section>
  );
}
