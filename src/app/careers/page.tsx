import type { Metadata } from "next";
import { PageShell, Section } from "@/components/site/PageShell";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/links";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "We're not hiring for a specific role right now, but we'd still like to hear from great people. Write to us at contact@accelryde.com.",
};

export default function CareersPage() {
  return (
    <PageShell
      title="Careers"
      intro="We don't have any open roles at the moment — but that has never stopped us from talking to the right person."
    >
      <Section heading="No open roles right now">
        <p>
          We&rsquo;re a small team and we hire slowly. Rather than list roles we
          can&rsquo;t fill today, we&rsquo;d rather keep the door open: if
          you&rsquo;re someone we should know about, we want to know about you
          now, not whenever a job posting happens to go up.
        </p>
      </Section>

      <Section heading="Tell us anyway">
        <p>
          Write to{" "}
          <a href={`${CONTACT_MAILTO}?subject=Working%20with%20AccelRyde`}>
            {CONTACT_EMAIL}
          </a>{" "}
          and tell us what you&rsquo;d want to work on. A few things that help:
        </p>
        <ul>
          <li>What you do, and something you&rsquo;ve built that you&rsquo;re proud of.</li>
          <li>Why this problem — riding, routes, groups — interests you.</li>
          <li>A link to your work: GitHub, portfolio, LinkedIn, anything.</li>
        </ul>
        <p>
          A short note beats a long CV. We read everything that comes in, and
          we&rsquo;ll reply if there&rsquo;s a fit — now or when something opens
          up.
        </p>
      </Section>
    </PageShell>
  );
}
