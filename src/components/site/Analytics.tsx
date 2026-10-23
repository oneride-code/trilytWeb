import Script from "next/script";
import { GA_MEASUREMENT_ID, META_PIXEL_ID } from "@/lib/analytics";
import { MetaPixelPageView } from "./MetaPixelPageView";

/**
 * Google Analytics (gtag.js) and the Meta Pixel, mounted once in the root layout.
 *
 * Production only: local dev and preview traffic would otherwise show up as
 * real visits. Page views on client-side navigation and clicks on outbound
 * links (e.g. "Book now") are picked up by GA4's enhanced
 * measurement, so no per-page code is needed. The pixel needs its own
 * PageView on navigation (MetaPixelPageView); leads are sent by trackLead.
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
      {META_PIXEL_ID && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
          </Script>
          <MetaPixelPageView />
        </>
      )}
    </>
  );
}
