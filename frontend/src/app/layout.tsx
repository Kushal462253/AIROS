import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Providers from "@/providers/Providers";
import InteractiveResearchBackground from "@/components/workspace/InteractiveResearchBackground";
import AmbientResearchEngine from "@/components/workspace/AmbientResearchEngine";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: "AIROS — AI Research Operating System",
  description:
    "A production-grade AI platform that helps researchers discover, analyze, compare, and reason over scientific literature using multiple AI agents.",
  keywords: [
    "AI",
    "research",
    "scientific literature",
    "AI agents",
    "knowledge graph",
  ],
  authors: [{ name: "AIROS Team" }],
  openGraph: {
    title: "AIROS — AI Research Operating System",
    description:
      "Discover, analyze, compare, and reason over scientific literature using multiple AI agents.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <InteractiveResearchBackground />
        <AmbientResearchEngine />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
