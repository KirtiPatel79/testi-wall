import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicWall } from "@/lib/public-data";
import { TestimonialWall } from "@/components/testimonial-wall";
import { Star } from "lucide-react";

export default async function PublicWallPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ autoplay?: string }>;
}) {
  const { slug } = await params;
  const { autoplay } = await searchParams;
  const project = await getPublicWall(slug);
  if (!project) notFound();
  const carouselAutoplay = autoplay === "true" ? true : autoplay === "false" ? false : project.carouselAutoplay;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        ← TestiWall
      </Link>
      <header className="mb-10">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <Star className="h-4 w-4" />
          <span>Wall of Love</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          What people say about {project.name}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Real testimonials from real customers.
        </p>
      </header>
      <TestimonialWall
        items={project.testimonials}
        layout={project.layout}
        theme={project.theme}
        brandColor={project.brandColor}
        carouselAutoplay={carouselAutoplay}
      />
    </main>
  );
}
