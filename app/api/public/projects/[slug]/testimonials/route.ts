import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toInt } from "@/lib/utils";
import { buildReviewSchema } from "@/lib/public-data";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const url = new URL(request.url);
  const limit = Math.min(Math.max(toInt(url.searchParams.get("limit"), 50), 1), 100);
  const includeSchema = url.searchParams.get("includeSchema") === "true";
  const layoutParam = url.searchParams.get("layout");
  const layout = layoutParam && ["grid", "list", "carousel"].includes(layoutParam) ? layoutParam : undefined;

  const project = await prisma.project.findUnique({
    where: { slug },
    select: {
      name: true,
      slug: true,
      theme: true,
      layout: true,
      carouselAutoplay: true,
      brandColor: true,
      testimonials: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: limit,
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

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404, headers: CORS_HEADERS });
  }

  const schema = includeSchema
    ? buildReviewSchema(
        project.name,
        project.testimonials.map((t) => ({ rating: t.rating, text: t.text, name: t.name }))
      )
    : null;

  return NextResponse.json(
    {
      project: {
        name: project.name,
        slug: project.slug,
        theme: project.theme,
        layout: layout || project.layout,
        carouselAutoplay: project.carouselAutoplay,
        brandColor: project.brandColor,
      },
      testimonials: project.testimonials,
      schema,
    },
    { headers: CORS_HEADERS }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
