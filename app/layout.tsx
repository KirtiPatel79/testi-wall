import type { Metadata, Viewport } from "next";
import { Oxanium, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/top-nav";
import { ConditionalNav } from "@/components/conditional-nav";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/session-provider";
import { JsonLd } from "@/components/json-ld";
import { VisitTracker } from "@/components/visit-tracker";
import { getBaseUrl } from "@/lib/utils";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

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

const OG_TITLE =
  "TestiWall — Collect & Embed Customer Testimonials in Minutes";
const OG_DESC =
  "Free, no-code testimonial collection and embed widgets. Branded forms, built-in moderation, and grid / list / carousel walls that load fast and look great on any site.";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: OG_TITLE,
    template: "%s · TestiWall",
  },
  description: OG_DESC,
  applicationName: "TestiWall",
  keywords: [
    "testimonials",
    "customer testimonials",
    "social proof",
    "customer reviews",
    "embed testimonials",
    "testimonial widget",
    "wall of love",
    "landing page testimonials",
    "review collection",
    "no-code testimonials",
    "testimonial form",
    "testimonial carousel",
    "testimonial grid",
    "testimonials.to alternative",
    "senja alternative",
    "free testimonial software",
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
    title: OG_TITLE,
    description: OG_DESC,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "TestiWall — collect and embed customer testimonials",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESC,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  category: "technology",
  referrer: "origin-when-cross-origin",
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
        <VisitTracker />
        <SessionProvider>
          <ThemeProvider>
            <ConditionalNav><TopNav /></ConditionalNav>
            {children}
            <SpeedInsights />
            <Analytics />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
