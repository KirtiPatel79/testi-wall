import { getBaseUrl } from "@/lib/utils";

export function JsonLd() {
  const baseUrl = getBaseUrl();

  const organization = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TestiWall",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "The easiest way to gather social proof and showcase it on your website. Set up in minutes, embed anywhere with one line of code.",
    url: baseUrl,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TestiWall",
    url: baseUrl,
    description: "Collect, moderate, and embed testimonials in minutes. No code required.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organization),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(website),
        }}
      />
    </>
  );
}
