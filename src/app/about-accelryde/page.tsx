import type { Metadata } from "next";
import { PageShell, Section } from "@/components/site/PageShell";
import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  TRILYT_INSTAGRAM_URL,
  TRILYT_LINKEDIN_URL,
} from "@/lib/links";

export const metadata: Metadata = {
  title: "About AccelRyde",
  description:
    "AccelRyde Technologies LLP builds software for people who ride — including Trilyt.",
};

export default function AboutAccelrydePage() {
  return (
    <PageShell
      title="About AccelRyde"
      intro="AccelRyde Technologies LLP builds software for people who ride. Trilyt is our product."
    >
      <Section heading="Why we exist">
        <p>
          Five riders. Five different routes. The same destination, supposedly.
          Somebody is twenty kilometres behind, somebody else took the turn
          nobody agreed on, and the plan is spread across a group chat, a maps
          screenshot and a spreadsheet.
        </p>
        <p>
          We built AccelRyde because we lived every one of those moments. The
          chaos is real. The fix should be too.
        </p>
      </Section>

      <Section heading="What we build">
        <p>
          Riders juggle a handful of apps that were never designed to work
          together — one for chat, one for routes, one for splitting costs.
          We&rsquo;re replacing that patchwork with tools built for the way
          people actually ride:
        </p>
        <ul>
          <li>
            <strong>Routes that hold up.</strong> Plan with fuel stops, scenic
            detours and chai breaks built in. Share the route once and everyone
            follows the same path.
          </li>
          <li>
            <strong>Plans everyone can see.</strong> Destinations, stops and
            timings in one place, so nobody is working from a screenshot.
          </li>
          <li>
            <strong>Costs worked out up front.</strong> Know what a trip is
            likely to cost, solo or split across the group, before you leave.
          </li>
          <li>
            <strong>Communities worth joining.</strong> Find local riding
            groups, weekend crews, or build your own.
          </li>
        </ul>
      </Section>

      <Section heading="Trilyt">
        <p>
          Trilyt is our platform for people who love to ride and explore — plan
          trips, discover routes, ride solo or with your community, and get a
          clear estimate of your trip budget before you go. It&rsquo;s
          available on the App Store and Google Play.
        </p>
      </Section>

      <Section heading="How we use AI">
        <p>
          AI sits at the core of how Trilyt helps people decide where to go.
          We use it today in three places:
        </p>
        <ul>
          <li>
            <strong>Recommending the right places.</strong> Our recommendation
            layer surfaces the destinations, stops and experiences most worth a
            rider&rsquo;s time, ranked for the trip they are planning rather
            than by generic popularity.
          </li>
          <li>
            <strong>Learning rider preferences.</strong> Trilyt learns from how
            each rider plans, saves and rides, and uses those signals to
            personalise what it suggests next.
          </li>
          <li>
            <strong>Growing our places database.</strong> When a rider looks
            for a tourist spot we don&rsquo;t yet cover, AI gathers information
            about it from across the web and returns it in a clean, structured
            format. That shows up for the rider straight away and helps us add
            new, verified places to the Explore feature, so our coverage keeps
            growing with our community.
          </li>
        </ul>
        <p>
          This is our foundation. We are building towards deeper AI-driven
          trip planning, smarter routing and richer personalisation across the
          whole riding experience.
        </p>
      </Section>

      <Section heading="Team">
        <ul>
          <li>
            <strong>Piyush Choudhary</strong>, Co-Founder &amp; Director (
            <a
              href="https://www.linkedin.com/in/piyush-choudhary3008/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            )
          </li>
          <li>
            <strong>Soumik Barua</strong>, Co-Founder &amp; Director
          </li>
        </ul>
      </Section>

      <Section heading="Company details">
        <p>
          <strong>AccelRyde Technologies LLP</strong>
          <br />
          LLP Identification Number: ACY-1852
          <br />
          Incorporated in India under the Limited Liability Partnership Act,
          2008
          <br />
          Registered in Delhi, India
        </p>
      </Section>

      <Section heading="Get in touch">
        <p>
          For anything at all — partnerships, press, support, or just to say
          hello — email us at{" "}
          <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a>.
        </p>
        <p>
          You can also follow Trilyt on{" "}
          <a href={TRILYT_LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>{" "}
          and{" "}
          <a href={TRILYT_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          .
        </p>
      </Section>
    </PageShell>
  );
}
