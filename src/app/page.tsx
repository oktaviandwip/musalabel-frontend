import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import HeroSection from "@/app/HeroSection";
import ModelListServer from "@/app/ModelListServer";

export default async function Home() {
  return (
    <main className="font-apercu min-h-screen">
      <Header />
      <div className="container pt-28 min-h-screen">
        <HeroSection />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-3 lg:gap-4 mt-28 mb-10">
          <ModelListServer />
        </div>
      </div>
      <Footer />
    </main>
  );
}
