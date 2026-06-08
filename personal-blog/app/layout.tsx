import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllArticles, siteConfig } from "@/data/articles";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap"
});

const merriweather = Merriweather({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Private Margins — Essays on Ideas, Technology & Philosophy",
    template: "%s | Private Margins"
  },
  description:
    "A personal editorial blog for long essays, research notes, cultural analysis, and reflective writing.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Private Margins",
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Private Margins",
    description: siteConfig.description
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)] antialiased">
        <Header articles={getAllArticles()} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
