import type { Metadata, Viewport } from "next";
import { Oxanium, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/top-nav";
import { ConditionalNav } from "@/components/conditional-nav";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/session-provider";
import { JsonLd } from "@/components/json-ld";
import { getBaseUrl } from "@/lib/utils";

const oxanium = Oxanium({
  variable: "--font-oxanium",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "TestiWall – Collect & Embed Testimonials Without the Friction",
    template: "%s | TestiWall",
  },
  description:
    "The easiest way to gather social proof and showcase it on your website. Set up in minutes, embed anywhere with one line of code. Collect, moderate, and display testimonials.",
  keywords: [
    "testimonials",
    "social proof",
    "customer reviews",
    "embed testimonials",
    "testimonial widget",
    "wall of love",
    "landing page testimonials",
  ],
  authors: [{ name: "TestiWall" }],
  creator: "TestiWall",
  publisher: "TestiWall",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "TestiWall",
    title: "TestiWall – Collect & Embed Testimonials Without the Friction",
    description:
      "The easiest way to gather social proof and showcase it on your website. Set up in minutes, embed anywhere with one line of code.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TestiWall – Collect & Embed Testimonials Without the Friction",
    description:
      "The easiest way to gather social proof and showcase it on your website. Set up in minutes, embed anywhere.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: baseUrl,
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<Record<string, string | string[]>>;
}>) {
  await params;
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${oxanium.variable} ${sourceCodePro.variable} font-sans min-h-screen bg-background text-foreground antialiased`}>
        <JsonLd />
        <SessionProvider>
          <ThemeProvider>
            <ConditionalNav><TopNav /></ConditionalNav>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
