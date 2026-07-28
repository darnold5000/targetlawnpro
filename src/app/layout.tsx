import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import "./globals.css";

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const displayFont = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  ...createPageMetadata({
    title: `${siteConfig.name} | Lawn Care & Landscaping in Zionsville`,
    description: siteConfig.description,
    path: "/",
  }),
  title: {
    default: `${siteConfig.name} | Lawn Care & Landscaping in Zionsville`,
    template: `%s | ${siteConfig.name}`,
  },
  icons: {
    icon: "/images/weidner/logo/logo-icon.webp",
    apple: "/images/weidner/logo/logo-icon.webp",
  },
};

export const viewport: Viewport = {
  themeColor: "#1f3d2b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
