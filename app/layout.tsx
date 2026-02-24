import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const siteUrl = "https://amnesia-web-psi.vercel.app";

const shareDescription =
  "2020 yılında bir virüs gezegenimizi işgal etti. Seçkin birkaç raver ise yok oluştan kurtulmak için yeraltına kaçmıştı. Bu sağ kalan grup, halen rave sahnesini kurtarmak için mücadele veriyorlar. Geldiğiniz yer ise... Sıfır Noktası. Tek bir kural: Ya dans edin, ya ölün.";

export const metadata: Metadata = {
  title: "Amnesia",
  description: shareDescription,
  openGraph: {
    title: "Amnesia",
    description: shareDescription,
    url: siteUrl,
    siteName: "Amnesia",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amnesia",
    description: shareDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="min-h-screen flex flex-col bg-background text-text antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
