/**
 * GA4 web data stream measurement ID. A public identifier, not a secret — it
 * is sent to the browser in every page's HTML — so it lives in source rather
 * than an env var (the Docker build ignores .env files anyway).
 */
export const GA_MEASUREMENT_ID = "G-K63KW1T39H";

/**
 * Meta Pixel (dataset) ID for ad account act_1899227207718701. Public, like the
 * GA ID. Empty means the pixel is not loaded at all.
 */
export const META_PIXEL_ID = "1747757732965207";

type Fbq = (cmd: "track", event: string, params?: Record<string, unknown>) => void;
type Gtag = (cmd: "event", event: string, params?: Record<string, unknown>) => void;

/**
 * A submitted operator enquiry: Meta's standard Lead event (what the ads
 * optimise for) and GA4's recommended generate_lead. Safe to call when either
 * script is missing, e.g. in dev or with an ad blocker.
 */
export function trackLead(source: string) {
  const w = window as unknown as { fbq?: Fbq; gtag?: Gtag };
  w.fbq?.("track", "Lead", { content_name: source });
  w.gtag?.("event", "generate_lead", { form: source });
}
