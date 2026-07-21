import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NeuroScan AI — Brain Tumor MRI Classification Benchmark",
    template: "%s | NeuroScan AI",
  },
  description: "Automated brain tumor classification from MR images using advanced pre-trained CNN transfer learning backbones.",
  openGraph: {
    title: "NeuroScan AI — Brain Tumor MRI Classification",
    description: "Automated brain tumor classification from MR images using advanced pre-trained CNN transfer learning backbones.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "NeuroScan AI — Brain Tumor MRI Classification",
    description: "Automated brain tumor classification from MR images using advanced pre-trained CNN transfer learning backbones.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-bg-deep text-text-primary antialiased">
        <Nav />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
