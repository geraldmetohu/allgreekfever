import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AllGreekFever | Bouzouki Nights & Greek Events UK",
  description:
    "Book VIP tables, experience live bouzouki nights, and enjoy unforgettable Greek music events in the UK. Reserve your spot with AllGreekFever today.",
  keywords: [
    "Greek events UK",
    "Bouzouki night",
    "VIP table booking",
    "Greek party UK",
    "AllGreekFever",
    "book Greek table",
    "live Greek music",
    "Greek club night"
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "AllGreekFever | Greek Music Events & Bouzouki Nights",
    description:
      "See your table before you book. Reserve VIP, Gold, Silver, or Bronze tables for the hottest Greek events in the UK.",
    url: "https://www.allgreekfever.com",
    siteName: "AllGreekFever",
    images: [
      {
        url: "https://www.allgreekfever.com/allgreekfever_logo.png",
        width: 1200,
        height: 630,
        alt: "AllGreekFever Logo",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Google Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "AllGreekFever",
              url: "https://www.allgreekfever.com",
              logo: "https://www.allgreekfever.com/allgreekfever_logo.png",
              description:
                "Discover Greek events in the UK. Book tables for bouzouki nights and Greek music parties online.",
              sameAs: [
                "https://www.instagram.com/allgreek_fever/",
                "https://www.facebook.com/share/16sZD4TNPY/?mibextid=wwXIfr",
                "https://www.tiktok.com/@allgreek_fever?_t=ZM-8xCiFF9MphG&_r=1"
              ]
            }),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-900 to-black`}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        {children}
      </body>
    </html>
  );
}
