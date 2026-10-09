import type { ReactNode } from "react";
import type { Metadata } from "next";
import { DemoProvider } from "@/components/ui/Demo";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: { default: "TTG SHOP — Demo", template: "%s | TTG SHOP — Demo" },
  icons: { icon: "/images/brand/logo_ttgshop-logo-27122025-1-91346259.webp" },
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
      <body className="bg-[#f5f5f5] text-secondary">
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
