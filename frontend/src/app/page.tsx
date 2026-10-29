import { AboutSection } from "@/components/AboutSection";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { OrderSection } from "@/components/OrderSection";
import { basePath } from "@/lib/config";
import { catalog } from "@/lib/site-data";

export default function HomePage() {
  const works = catalog.works;
  const featured = works.filter((w) => w.featured && w.available);
  const heroItems = featured.length > 0 ? featured : works.filter((w) => w.available);

  return (
    <main className="min-h-screen bg-background">
      <Header siteName={catalog.site.name} />
      <Hero
        siteName={catalog.site.name}
        featured={heroItems}
        tagline={catalog.site.tagline}
        basePath={basePath}
      />
      <Gallery works={works} basePath={basePath} />
      <AboutSection siteName={catalog.site.name} />
      <OrderSection />
      <Footer siteName={catalog.site.name} instagram={catalog.site.instagram} />
    </main>
  );
}
