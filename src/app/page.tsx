import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/app/HeroSection";
import ModelListServer from "@/app/ModelListServer";

export default function Home() {
  return (
    <main className="font-apercu min-h-screen">
      <Header />
      <div className="container pt-28 min-h-screen">
        <HeroSection />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-3 lg:gap-4 mt-4 md:mt-28 mb-10">
          <ModelListServer />
        </div>
      </div>
      <Footer />
    </main>
  );
}
