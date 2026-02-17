import { notFound } from "next/navigation";
import { getPublicWall } from "@/lib/public-data";
import { TestimonialWall } from "@/components/testimonial-wall";
import { cn } from "@/lib/utils";

export default async function EmbedWallPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ theme?: string; layout?: string; autoplay?: string }>;
}) {
  const { slug } = await params;
  const { theme: themeParam, layout: layoutParam, autoplay: autoplayParam } = await searchParams;
  const project = await getPublicWall(slug);
  if (!project) notFound();

  const theme = themeParam === "dark" ? "dark" : themeParam === "light" ? "light" : project.theme;
  const layout =
    layoutParam === "list"
      ? "list"
      : layoutParam === "carousel"
        ? "carousel"
        : layoutParam === "grid"
          ? "grid"
          : project.layout;

  const isDark = theme === "dark";
  const carouselAutoplay =
    autoplayParam === "true" ? true : autoplayParam === "false" ? false : project.carouselAutoplay;
  return (
    <main className={cn("min-h-40 p-4 md:p-6 bg-transparent", isDark ? "text-slate-100" : "text-slate-900")}>
      <TestimonialWall
        items={project.testimonials}
        layout={layout}
        theme={theme}
        brandColor={project.brandColor}
        carouselAutoplay={carouselAutoplay}
      />
    </main>
  );
}
