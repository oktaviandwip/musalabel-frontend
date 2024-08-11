import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Server from "./Server";

export default function page({ params }: { params: { slug: string } }) {
  return (
    <>
      <Header />
      <Server params={params} />
      <Footer />
    </>
  );
}
