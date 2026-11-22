import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Newsreader, Instrument_Serif, DM_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-editorial",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "forma — OpenRouter for Web Design",
  description:
    "Connect Claude, Cursor, or Codex. Describe your project and cross the world's best websites into a custom, zero-slop design system.",
  openGraph: {
    title: "forma — OpenRouter for Web Design",
    description:
      "Turn AI coding agents into world-class web designers by crossing curated & live-scraped design genomes.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "forma — OpenRouter for Web Design",
    description:
      "Connect your agent, describe your idea, and synthesize a custom brand & web format from 140+ elite references.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${newsreader.variable} ${instrumentSerif.variable} ${dmMono.variable}`}
    >
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
