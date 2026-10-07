import type { Metadata } from "next";
import { PageShell, Section } from "@/components/site/PageShell";
import { CONTACT_EMAIL, CONTACT_MAILTO, LEGAL_LAST_UPDATED } from "@/lib/links";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Trilyt privacy policy: what we collect, why we collect it, and how we handle it.",
};

/**
 * DRAFT — NEEDS REVIEW BEFORE PUBLISHING.
 *
 * Adapted from the AccelRyde site policy (accelrydeUI-V2/src/app/privacy),
 * which describes a marketing site and a beta waitlist. Trilyt is a shipped app
 * on both stores, so the substance here was rewritten around what the app
 * actually does. Every claim marked CONFIRM below is an inference from the
 * product surface, not something verified against the backend.
 *
 * CONFIRM before publishing:
 *  - the exact account fields collected at sign-up (and any social logins)
 *  - whether location is collected in the background or only in-app
 *  - the analytics/crash SDKs in the app (Firebase? Sentry? none?)
 *  - where data is hosted and in which region
 *  - actual retention windows
 *  - whether the store listings' data-safety forms match this page
 */
export default function PrivacyPage() {
  return (
    <PageShell
      title="Privacy Policy"
      lastUpdated={LEGAL_LAST_UPDATED}
      intro="This policy explains what Trilyt collects, why, and how we handle it. It's written in plain language and is not intended as legal advice."
    >
      <Section heading="Who we are">
        <p>
          Trilyt is built and operated by <strong>AccelRyde Technologies
          LLP</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;).
          This policy covers the Trilyt mobile app and this website.
        </p>
      </Section>

      <Section heading="What we collect">
        <ul>
          <li>
            <strong>Account information</strong> — the details you give us when
            you create an account, such as your name, email address and profile
            photo.
          </li>
          <li>
            <strong>Trip content</strong> — the trips you create: destinations,
            routes, stops, dates and any notes you add.
          </li>
          <li>
            <strong>Budget entries</strong> — the cost figures you enter to
            estimate or track what a trip costs, including how it is split
            across a group.
          </li>
          <li>
            <strong>Location</strong> — used to plan routes and, where you
            enable it, to share your position with people on a ride with you.
            See below.
          </li>
          <li>
            <strong>Community activity</strong> — the communities you join or
            create, and requests you send.
          </li>
          <li>
            <strong>Device and usage information</strong> — standard server logs
            may record browser or device type, operating system and IP address.
            These are used for security and debugging.
          </li>
        </ul>
      </Section>

      <Section heading="Location data">
        <p>
          Location is central to route planning, so the app asks for it. You
          control it: you can decline, and you can change or revoke the
          permission at any time in your device settings. Revoking it will limit
          route and live-sharing features but will not delete your account.
        </p>
        <p>
          Location shared with a group is visible only to people on that ride,
          and only while sharing is switched on.
        </p>
      </Section>

      <Section heading="Why we collect it">
        <ul>
          <li>To provide the features you are using — planning, routing, budgeting and communities.</li>
          <li>To sync your trips across your devices.</li>
          <li>To improve the product and fix problems.</li>
          <li>To keep the service secure and working.</li>
        </ul>
      </Section>

      <Section heading="What we don't do">
        <p>
          <strong>We do not sell your data.</strong> We do not use your trip
          content or location to target advertising, and we do not share it with
          advertisers or data brokers.
        </p>
      </Section>

      <Section heading="Sharing">
        <p>
          Content you deliberately share — a trip you invite others to, a
          community you post in — is visible to the people you share it with.
          That is the feature working as intended.
        </p>
        <p>
          Beyond that, we share data only with service providers who help us run
          Trilyt (hosting, crash reporting, email delivery), acting on our
          instructions and under their own privacy terms; or where we are
          legally required to.
        </p>
      </Section>

      <Section heading="Retention">
        <p>
          We keep your account and trip content for as long as your account is
          active. Delete a trip and it is removed from your account; delete your
          account and we remove your personal data, other than anything we must
          keep for legal or accounting reasons. Server logs are retained for up
          to 90 days.
        </p>
      </Section>

      <Section heading="Your choices">
        <ul>
          <li>Access or correct your information from within the app.</li>
          <li>Turn location permissions on or off in your device settings.</li>
          <li>
            Request a copy of your data, or ask us to delete your account, by
            emailing <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a>.
          </li>
        </ul>
      </Section>

      <Section heading="Security">
        <p>
          We take reasonable technical and organisational measures to protect
          your data. No system is perfectly secure, but if a breach affects your
          personal data we will tell you and the relevant authorities as
          required.
        </p>
      </Section>

      <Section heading="Children">
        <p>
          Trilyt is not intended for children under 13, and we do not knowingly
          collect their personal data. If you believe a child has given us
          information, email us and we will remove it.
        </p>
      </Section>

      <Section heading="Changes to this policy">
        <p>
          We may update this policy from time to time. Changes will be posted on
          this page with a new &ldquo;last updated&rdquo; date, and we&rsquo;ll
          flag anything significant in the app.
        </p>
      </Section>

      <Section heading="Contact">
        <p>
          Questions about this policy, or about your data? Email{" "}
          <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a>.
        </p>
      </Section>
    </PageShell>
  );
}
