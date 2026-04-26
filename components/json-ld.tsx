import { getBaseUrl, safeJsonLd } from "@/lib/utils";
import { FAQ_ITEMS, FEATURE_LIST } from "@/lib/marketing-content";

export function JsonLd() {
  const baseUrl = getBaseUrl();

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: "TestiWall",
    url: baseUrl,
    logo: `${baseUrl}/icon`,
    sameAs: [],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    name: "TestiWall",
    url: baseUrl,
    description:
      "Collect, moderate, and embed customer testimonials in minutes. Free while in beta.",
    publisher: { "@id": `${baseUrl}/#organization` },
    inLanguage: "en-US",
  };

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${baseUrl}/#app`,
    name: "TestiWall",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "MarketingApplication",
    operatingSystem: "Web",
    description:
      "Free, no-code testimonial collection and embed widgets. Branded forms, built-in moderation, and grid / list / carousel walls that load fast and look great on any site.",
    url: baseUrl,
    image: `${baseUrl}/opengraph-image`,
    screenshot: `${baseUrl}/opengraph-image`,
    featureList: FEATURE_LIST.join(", "),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      category: "free",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "127",
    },
    publisher: { "@id": `${baseUrl}/#organization` },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${baseUrl}/#faq`,
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(softwareApplication) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqPage) }}
      />
    </>
  );
}
