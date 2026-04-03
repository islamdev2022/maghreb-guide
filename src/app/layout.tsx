import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Offline GPS — Maghreb",
  description:
    "Offline GPS, downloadable maps, and cultural points of interest for Algeria, Morocco & Tunisia. Navigate sans internet!",
  keywords: [
    "offline GPS",
    "Maghreb",
    "Algeria",
    "Morocco",
    "Tunisia",
    "maps",
    "POI",
    "navigation",
    "PWA",
  ],
  openGraph: {
    title: "Smart Offline GPS — Maghreb",
    description:
      "Navigate the Maghreb offline — download maps, discover POIs, and find routes without internet.",
    type: "website",
    locale: "fr_FR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#6366f1",
};

import ReactQueryProvider from "@/providers/ReactQueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/icons/icon-192.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/icon-512.png" />
      </head>
      <body>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
