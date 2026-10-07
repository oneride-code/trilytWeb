import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Features } from "@/components/site/Features";
import { DownloadCta } from "@/components/site/DownloadCta";
import { Faqs } from "@/components/site/Faqs";
import { UpcomingRide } from "@/components/site/UpcomingRide";
import { Footer } from "@/components/site/Footer";

export default function Home() {
  return (
    <>
      {/* Bar and nav travel together — the ride stays one tap away
          however far down the page someone scrolls. */}
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <Header sticky={false} />
      </div>
      <main className="flex-1">
        <Hero />
        <UpcomingRide />
        <About />
        <Features />
        <DownloadCta />
        <Faqs />
      </main>
      <Footer />
    </>
  );
}
