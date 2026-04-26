import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildReviewSchema, getPublicWall } from "@/lib/public-data";
import { TestimonialWall } from "@/components/testimonial-wall";
import { LayoutGrid, LayoutList, Play, Star } from "lucide-react";
import { cn, safeJsonLd } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicWall(slug);
  if (!project) {
    return {
      title: "Wall not found",
      robots: { index: false, follow: false },
    };
  }
  const title = `${project.name} — Wall of Love`;
  const description = `Real testimonials and customer reviews for ${project.name}. Built with TestiWall.`;
  return {
    title,
    description,
    alternates: { canonical: `/w/${slug}` },
    openGraph: {
      type: "website",
      url: `/w/${slug}`,
      title,
      description,
      siteName: "TestiWall",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PublicWallPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ autoplay?: string; layout?: string }>;
}) {
  const { slug } = await params;
  const { autoplay, layout: layoutOverride } = await searchParams;
  const project = await getPublicWall(slug);
  if (!project) notFound();
  const carouselAutoplay = autoplay === "true" ? true : autoplay === "false" ? false : project.carouselAutoplay;
  const effectiveLayout =
    layoutOverride === "list" || layoutOverride === "grid" || layoutOverride === "carousel"
      ? layoutOverride
      : project.layout;

  const reviewSchema = buildReviewSchema(
    project.name,
    project.testimonials.map((t) => ({ rating: t.rating, text: t.text, name: t.name }))
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      {reviewSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(reviewSchema) }}
        />
      ) : null}
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
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Preview as
          </span>
          {(
            [
              { key: "grid", label: "Grid", icon: LayoutGrid },
              { key: "list", label: "List", icon: LayoutList },
              { key: "carousel", label: "Carousel", icon: Play },
            ] as const
          ).map(({ key, label, icon: Icon }) => {
            const active = effectiveLayout === key;
            const params = new URLSearchParams();
            params.set("layout", key);
            if (autoplay === "true" || autoplay === "false") {
              params.set("autoplay", autoplay);
            }
            return (
              <Link
                key={key}
                href={`?${params.toString()}`}
                scroll={false}
                prefetch={false}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            );
          })}
        </div>
      </header>
      <TestimonialWall
        items={project.testimonials}
        layout={effectiveLayout}
        theme={project.theme}
        brandColor={project.brandColor}
        carouselAutoplay={carouselAutoplay}
      />
    </main>
  );
}
