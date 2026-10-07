/**
 * Every FAQ row is collapsed in the Figma design, so the answer copy is not in
 * the source. The answers below are drafted from the rest of the page copy and
 * MUST be reviewed/replaced with the real answers before launch.
 */
const FAQS = [
  {
    q: "What is Trilyt?",
    a: "Trilyt is a platform for people who love to ride and explore. Plan trips, discover routes, ride solo or with your community, and get a clear estimate of your trip budget before you go.",
  },
  {
    q: "Who is behind Trilyt?",
    a: "Trilyt is built and operated by AccelRyde Technologies LLP.",
  },
  {
    q: "Can I plan a solo trip?",
    a: "Yes. Trilyt works the same whether you're heading out alone or joining a group — plan your route, stops and budget entirely on your own.",
  },
  {
    q: "Can I connect with other riders?",
    a: "Yes. Discover rides and connect with people who share the same passion for exploring and riding.",
  },
  {
    q: "Can I plan a trip with my friends?",
    a: "Yes. Organise destinations, routes and stops together, invite your group, and keep everyone on the same plan.",
  },
  {
    q: "Can I estimate my trip budget?",
    a: "Yes. Get an estimated view of what your trip could cost, whether you're travelling solo or sharing the journey with others.",
  },
  {
    q: "Is Trilyt only for motorcycle riders?",
    a: "No. Trilyt is built with riders in mind, but the planning, routing and budgeting tools work for any kind of road trip.",
  },
];

export function Faqs() {
  return (
    <section id="faqs" className="px-lg py-[96px] lg:px-xl">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-[32px] font-bold leading-[1.2] tracking-[-0.01em] text-text-primary lg:text-[36px]">
            FAQs
          </h2>
          <p className="mt-sm text-[18px] leading-[30px] text-text-secondary">
            Everything you need to know about Trilyt.
          </p>
        </div>

        <div className="mt-xl flex flex-col gap-md">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-lg border border-border-default bg-card px-xl py-lg"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-lg text-[18px] font-semibold leading-[28px] text-text-primary [&::-webkit-details-marker]:hidden">
                {faq.q}
                <svg
                  viewBox="0 0 24 24"
                  className="h-[20px] w-[20px] shrink-0 text-icon-secondary transition-all duration-200 group-open:-rotate-180 group-open:text-accent-orange-ink"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <p className="mt-md max-w-[900px] text-body-lg text-text-secondary">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
