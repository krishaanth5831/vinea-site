import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SmoothScroll } from "@/components/SmoothScroll";
import { site } from "@/content";
import { CHROME, THEME_KEY } from "@/lib/theme";

import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Labels only, echoing the pixel mark. Self-hosted, Latin subset only:
 * through `next/font/google` it builds with a warning, because Next has no
 * fallback metrics for it.
 */
const geistPixel = localFont({
  src: "../fonts/GeistPixel-Regular.woff2",
  variable: "--font-geist-pixel",
  weight: "400",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.metaTitle,
  description: site.metaDescription,
  openGraph: {
    title: site.metaTitle,
    description: site.metaDescription,
    url: site.url,
    siteName: site.name,
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.metaTitle,
    description: site.metaDescription,
  },
};

export const viewport: Viewport = {
  themeColor: CHROME.dark,
};

/*
 * Runs during parsing, before the first paint. Dark is the default and is
 * what the server renders; a saved choice of light is applied here so the
 * page never paints dark and then flips. It also marks the document as
 * scripted, which is what lets the hero's mark start hidden and assemble.
 */
const themeScript = `(function(){var d=document.documentElement;d.classList.add("js");try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark"){d.dataset.theme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",t==="light"?"${CHROME.light}":"${CHROME.dark}")}}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-GB"
      data-theme="dark"
      className={`${geist.variable} ${geistMono.variable} ${geistPixel.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script
          type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <SmoothScroll />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-fg focus:px-4 focus:py-2 focus:text-sm focus:text-bg"
        >
          Skip to content
        </a>

        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
