import type { Metadata } from "next";
import { PageShell, Section } from "@/components/site/PageShell";
import {
  APP_STORE_URL,
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  TRILYT_INSTAGRAM_URL,
  TRILYT_LINKEDIN_URL,
  PLAY_STORE_URL,
} from "@/lib/links";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the team behind Trilyt — email contact@accelryde.com.",
};

export default function ContactPage() {
  return (
    <PageShell
      title="Contact"
      intro="One inbox, read by the people who build Trilyt."
    >
      <Section heading="Email">
        <p>
          <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a> reaches us for
          everything — support, bug reports, feature requests, partnerships,
          press, or privacy questions.
        </p>
        <p>
          If you&rsquo;re reporting a problem with the app, it helps to include
          your device and OS version, the app version, and what you were doing
          when it happened.
        </p>
      </Section>

      <Section heading="Social">
        <ul>
          <li>
            <a href={TRILYT_LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={TRILYT_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </li>
        </ul>
      </Section>

      <Section heading="Get the app">
        <ul>
          <li>
            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
              Trilyt on the App Store
            </a>
          </li>
          <li>
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
              Trilyt on Google Play
            </a>
          </li>
        </ul>
      </Section>

      <Section heading="Company">
        <p>
          Trilyt is built and operated by <strong>AccelRyde Technologies
          LLP</strong>.
        </p>
        {/* TODO: add the registered business address and LLP identification
            number — both are typically required on a company contact page and
            by the app stores. */}
      </Section>
    </PageShell>
  );
}
