import type { Metadata } from "next";
import { PageShell, Section } from "@/components/site/PageShell";
import { CONTACT_EMAIL, CONTACT_MAILTO, LEGAL_LAST_UPDATED } from "@/lib/links";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms that apply when you use Trilyt, from AccelRyde Technologies LLP.",
};

/**
 * DRAFT — NEEDS LEGAL REVIEW BEFORE PUBLISHING.
 *
 * There was no existing terms document in the AccelRyde or oneRyde projects, so
 * this is written from scratch against the product and the voice of the privacy
 * policy. It is a plain-language starting point, not reviewed by a lawyer.
 *
 * CONFIRM before publishing:
 *  - governing law and jurisdiction (assumed India — see "Governing law")
 *  - the registered entity name and address as they should appear
 *  - whether any paid tiers exist (there is no payment language here)
 *  - that the liability and indemnity wording is acceptable to counsel
 */
export default function TermsPage() {
  return (
    <PageShell
      title="Terms & Conditions"
      lastUpdated={LEGAL_LAST_UPDATED}
      intro="These terms apply when you use the Trilyt app or this website. By using Trilyt, you agree to them."
    >
      <Section heading="Who you're agreeing with">
        <p>
          Trilyt is provided by <strong>AccelRyde Technologies LLP</strong>. In
          these terms, &ldquo;we&rdquo; and &ldquo;us&rdquo; mean AccelRyde, and
          &ldquo;you&rdquo; means you, the person using Trilyt.
        </p>
      </Section>

      <Section heading="Your account">
        <ul>
          <li>You need an account to use most of Trilyt, and you must be at least 13 years old.</li>
          <li>Give us accurate information and keep it up to date.</li>
          <li>You are responsible for what happens under your account — keep your login details to yourself.</li>
          <li>Tell us at <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a> if you think someone else has access to it.</li>
        </ul>
      </Section>

      <Section heading="Ride safely — this is the important one">
        <p>
          Trilyt helps you plan and coordinate trips. It does not ride the
          motorcycle for you.
        </p>
        <ul>
          <li>
            <strong>Don&rsquo;t use the app while riding.</strong> Set up your
            route before you set off, or stop somewhere safe.
          </li>
          <li>
            <strong>Routes are suggestions, not instructions.</strong> Road
            conditions, closures, weather and traffic change. Use your own
            judgement, and follow the law and road signs over anything the app
            shows you.
          </li>
          <li>
            <strong>Estimates are estimates.</strong> Budgets, distances and
            arrival times are approximations and will not match reality exactly.
          </li>
          <li>
            You are responsible for your own safety, your licence, insurance,
            and the roadworthiness of your vehicle.
          </li>
        </ul>
      </Section>

      <Section heading="Your content">
        <p>
          Trips, routes, photos and messages you add stay yours. You give us
          permission to host, store and display that content so we can run the
          service — for example, showing your trip to the people you invited.
          That permission ends when you delete the content or your account,
          except for copies in routine backups.
        </p>
      </Section>

      <Section heading="Communities and conduct">
        <p>When using Trilyt with other people, don&rsquo;t:</p>
        <ul>
          <li>harass, threaten or impersonate anyone;</li>
          <li>post content that is unlawful, hateful, or that isn&rsquo;t yours to post;</li>
          <li>share someone else&rsquo;s personal information or location without their consent;</li>
          <li>use Trilyt to organise anything illegal, including unlawful racing on public roads;</li>
          <li>scrape, reverse-engineer, or try to break the service.</li>
        </ul>
        <p>
          We may remove content or suspend accounts that breach these terms. If
          we do, we&rsquo;ll tell you why where we reasonably can.
        </p>
      </Section>

      <Section heading="Other riders">
        <p>
          Trilyt helps you find and connect with other people. We don&rsquo;t
          vet them, and we&rsquo;re not responsible for their conduct. Meeting
          and riding with people you find through Trilyt is your decision — take
          the same precautions you would anywhere else.
        </p>
      </Section>

      <Section heading="Availability">
        <p>
          We&rsquo;re still building Trilyt. Features may change, and the
          service may be unavailable at times for maintenance or reasons outside
          our control. We provide Trilyt &ldquo;as is&rdquo; and don&rsquo;t
          promise it will be uninterrupted or error-free.
        </p>
      </Section>

      <Section heading="Liability">
        <p>
          To the extent the law allows, we are not liable for indirect or
          consequential loss, or for loss arising from your reliance on routes,
          estimates or other information in the app. Nothing here limits
          liability that cannot legally be limited — including for death or
          personal injury caused by our negligence, or for fraud.
        </p>
      </Section>

      <Section heading="Ending things">
        <p>
          You can stop using Trilyt and delete your account at any time. We may
          suspend or close an account that breaches these terms, or if we stop
          offering the service. The sections that by their nature should survive
          — content licences already granted, liability, governing law — do.
        </p>
      </Section>

      <Section heading="Changes to these terms">
        <p>
          We may update these terms. We&rsquo;ll post the new version here with
          a fresh &ldquo;last updated&rdquo; date, and flag material changes in
          the app. Continuing to use Trilyt after a change means you accept it.
        </p>
      </Section>

      <Section heading="Governing law">
        <p>
          These terms are governed by the laws of India, and the courts of India
          have exclusive jurisdiction over any dispute arising from them.
        </p>
      </Section>

      <Section heading="Contact">
        <p>
          Questions about these terms? Email{" "}
          <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a>.
        </p>
      </Section>
    </PageShell>
  );
}
