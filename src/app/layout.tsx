import React, { Suspense } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata = {
  title: "TOPSIS Kosan - Sistem Penunjang Keputusan",
  description: "Temukan kosan terbaik dengan sistem penunjang keputusan TOPSIS berbasis Python",
  generator: "v0.app",
};

// Perhatikan tipe children
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  );
}

