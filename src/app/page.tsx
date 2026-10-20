import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Features } from "@/components/site/Features";
import { ForOperators } from "@/components/site/ForOperators";
import { DownloadCta } from "@/components/site/DownloadCta";
import { Faqs } from "@/components/site/Faqs";
import { Footer } from "@/components/site/Footer";

/**
 * The app first, then the operator software. The Kolli Hills ride section and
 * announcement bar are out for now; the ride page itself stays at /rides/kolli-hills.
 */
export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Features />
        <ForOperators />
        <DownloadCta />
        <Faqs />
      </main>
      <Footer />
    </>
  );
}
