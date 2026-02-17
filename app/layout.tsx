import type { Metadata } from "next";
import { Oxanium, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/top-nav";
import { ConditionalNav } from "@/components/conditional-nav";
import { ThemeProvider } from "@/components/theme-provider";

const oxanium = Oxanium({
  variable: "--font-oxanium",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TestiWall",
  description: "Collect, moderate, and embed testimonials in minutes.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${oxanium.variable} ${sourceCodePro.variable} font-sans min-h-screen bg-background text-foreground antialiased`}>
        <ThemeProvider>
          <ConditionalNav><TopNav /></ConditionalNav>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
