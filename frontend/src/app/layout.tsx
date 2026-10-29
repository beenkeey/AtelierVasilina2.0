import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { catalog } from "@/lib/site-data";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: `${catalog.site.name} — ${catalog.site.tagline}`,
  description: catalog.site.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${cormorant.variable} ${outfit.variable} antialiased`}>
        <div className="grain" aria-hidden />
        {children}
      </body>
    </html>
  );
}
