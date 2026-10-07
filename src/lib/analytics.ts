/**
 * GA4 web data stream measurement ID. A public identifier, not a secret — it
 * is sent to the browser in every page's HTML — so it lives in source rather
 * than an env var (the Docker build ignores .env files anyway).
 */
export const GA_MEASUREMENT_ID = "G-K63KW1T39H";
