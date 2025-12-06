import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? "platform.localhost";
const platformProtocol = process.env.NEXT_PUBLIC_PLATFORM_PROTOCOL ?? "https";

export const metadata: Metadata = {
  metadataBase: new URL(`${platformProtocol}://${platformDomain}`),
  title: {
    template: "%s | Multi-tenant Docs Platform",
    default: "Multi-tenant Docs Platform",
  },
  description:
    "Reference implementation of Vercel's multi-tenant architecture using Next.js and custom domains.",
  openGraph: {
    title: "Multi-tenant Docs Platform",
    description:
      "Serve every customer's documentation under their own domain on a single Vercel project.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Multi-tenant Docs Platform",
    description:
      "Edge-aware Next.js starter that mirrors Vercel's multi-tenant platform pattern.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-50`}
      >
        {children}
      </body>
    </html>
  );
}
