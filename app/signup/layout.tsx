import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create your free account",
  description:
    "Sign up for TestiWall — collect, moderate, and embed customer testimonials. Free while in beta, no credit card required.",
  alternates: { canonical: "/signup" },
  robots: { index: true, follow: true },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
