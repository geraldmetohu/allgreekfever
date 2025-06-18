import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "All Greek Fever | Greek Music Events UK",
  description:
    "Experience the best Greek parties and events in the UK. Hosted by All Greek Fever. Book your ticket now!",
  metadataBase: new URL("https://www.allgreekfever.com"),
  openGraph: {
    title: "All Greek Fever | Greek Music Events UK",
    description:
      "Discover unforgettable Greek nightlife and cultural events across the UK. Powered by All Greek Fever.",
    url: "https://www.allgreekfever.com",
    siteName: "All Greek Fever",
    images: [
      {
        url: "/allgreekfever_logo.png", // Your logo as fallback OG image
        width: 800,
        height: 800,
        alt: "All Greek Fever Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Greek Fever | Greek Music Events UK",
    description: "Join the hottest Greek parties in the UK. Powered by All Greek Fever.",
    images: ["/allgreekfever_logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/allgreekfever_logo.png", // Fallback apple touch icon
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
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/allgreekfever_logo.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Script type="application/ld+json" id="structured-data" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "All Greek Fever",
            url: "https://www.allgreekfever.com",
            logo: "https://www.allgreekfever.com/allgreekfever_logo.png",
            sameAs: [
              "https://www.instagram.com/allgreek_fever/",
              "https://www.facebook.com/share/16sZD4TNPY/?mibextid=wwXIfr",
              "https://www.tiktok.com/@allgreek_fever?_t=ZM-8xCiFF9MphG&_r=1",
              "https://wa.me/+447771894852",
            ],
          })}
        </Script>
      </head>
      <body className={`antialiased bg-zinc-900 text-amber-50 ${geistSans.variable} ${geistMono.variable}`}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        {children}
      </body>
    </html>
  );
}
