import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import SlugServer from "./SlugServer";

export default function page({ params }: { params: { slug: string } }) {
  return (
    <>
      <Header />
      <SlugServer params={params} />
      <Footer />
    </>
  );
}
