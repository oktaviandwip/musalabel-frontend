import { StoreProvider } from "@/store/StoreProvider";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/providers/Providers";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Musalabel",
  description: "Jual baju wanita muslim berkualitas di Jakarta Timur",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className="font-apercu">
        <StoreProvider>
          <Providers>
            <div>{children}</div>
            <Toaster />
          </Providers>
        </StoreProvider>
      </body>
    </html>
  );
}
