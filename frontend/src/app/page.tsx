import { AboutSection } from "@/components/AboutSection";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { OrderSection } from "@/components/OrderSection";
import { fetchWorks } from "@/lib/api";

export default async function HomePage() {
  let works: Awaited<ReturnType<typeof fetchWorks>> = [];

    try {
      works = await fetchWorks();
      console.log("Работы загружены:", works);
    } catch (error) {
      console.error("Ошибка загрузки работ:", error);
    }

  const featured = works.filter((w) => w.featured);
  const heroItems = featured.length > 0 ? featured : works;

  return (
    <main className="min-h-screen">
      <Header />
      <Hero featured={heroItems} />
      <Gallery works={works} />
      <AboutSection />
      <OrderSection />
      <Footer />
    </main>
  );
}
