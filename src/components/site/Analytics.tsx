import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";

/**
 * Google Analytics (gtag.js), mounted once in the root layout.
 *
 * Production only: local dev and preview traffic would otherwise show up as
 * real visits. Page views on client-side navigation and clicks on outbound
 * links (e.g. "Book on Instagram") are picked up by GA4's enhanced
 * measurement, so no per-page code is needed.
 */
export function Analytics() {
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
