import type { ReactNode } from "react";
import type { Metadata } from "next";
import { DemoProvider } from "@/components/ui/Demo";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: { default: "TGB SHOP — Demo", template: "%s | TGB SHOP — Demo" },
  icons: {
    icon: [
      { url: "/images/brand/tgb-shop-favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/brand/tgb-shop-favicon-48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: { url: "/images/brand/tgb-shop-apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link
          rel="preload"
          href="/fonts/inter-latin.woff2"
          as="font"
          fetchPriority="low"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/inter-vietnamese.woff2"
          as="font"
          fetchPriority="low"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/inter-latin-ext.woff2"
          as="font"
          fetchPriority="low"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-page text-secondary">
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:p-3"
          href="#main"
        >
          Bỏ qua điều hướng
        </a>
        <DemoProvider>{children}</DemoProvider>
      </body>
    </html>
  );
}
