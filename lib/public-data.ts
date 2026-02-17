import { prisma } from "@/lib/prisma";

export async function getPublicWall(slug: string) {
  const project = await prisma.project.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      theme: true,
      layout: true,
      carouselAutoplay: true,
      brandColor: true,
      testimonials: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          rating: true,
          text: true,
          photoUrl: true,
          createdAt: true,
        },
      },
    },
  });

  if (!project) return null;

  return project;
}

export function buildReviewSchema(projectName: string, reviews: Array<{ rating: number | null; text: string; name: string }>) {
  const rated = reviews.filter((r) => typeof r.rating === "number");
  if (rated.length === 0) return null;

  const avg = rated.reduce((sum, item) => sum + (item.rating || 0), 0) / rated.length;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: projectName,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Number(avg.toFixed(2)),
      reviewCount: rated.length,
    },
    review: rated.slice(0, 20).map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.name },
      reviewBody: review.text,
      reviewRating: { "@type": "Rating", ratingValue: review.rating, bestRating: 5, worstRating: 1 },
    })),
  };
}
