import type { NextConfig } from "next";

const sharedSecurityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const appOnlyHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const embedOnlyHeaders = [
  { key: "Content-Security-Policy", value: "frame-ancestors *" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.qrserver.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
  },
  async headers() {
    return [
      {
        // Embed routes (script + iframe) must be framable by any origin.
        source: "/:path(embed\\.js|embed/.*)",
        headers: [...sharedSecurityHeaders, ...embedOnlyHeaders],
      },
      {
        // Everything else: block framing and set restrictive COOP.
        source: "/:path((?!embed\\.js$|embed/).*)",
        headers: [...sharedSecurityHeaders, ...appOnlyHeaders],
      },
    ];
  },
};

export default nextConfig;
