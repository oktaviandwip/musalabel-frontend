import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

export const metadata: Metadata = {
  title: "Musalabel",
  description: "Jual baju wanita muslim berkualitas di Jakarta Timur",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-apercu">
        <div className="container mb-10">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
