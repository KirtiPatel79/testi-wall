import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicTestimonialForm } from "@/components/public-form";
import { MessageSquare } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ publicId: string }>;
}): Promise<Metadata> {
  const { publicId } = await params;
  const form = await prisma.form.findUnique({
    where: { publicId },
    select: { project: { select: { name: true } } },
  });
  const projectName = form?.project?.name ?? "TestiWall";
  return {
    title: `Leave a testimonial for ${projectName}`,
    description: `Share your experience with ${projectName}. Submit a testimonial in under a minute — no account required.`,
    // Public form links are unique per-customer; keep them out of search
    // results so private/personalized links never get indexed.
    robots: { index: false, follow: false },
  };
}

export default async function PublicFormPage({
  params,
  searchParams,
}: {
  params: Promise<{ publicId: string }>;
  searchParams: Promise<{ submitted?: string; error?: string }>;
}) {
  const { publicId } = await params;
  const query = await searchParams;

  const form = await prisma.form.findUnique({
    where: { publicId },
    include: {
      project: {
        include: {
          _count: { select: { testimonials: true } },
        },
      },
    },
  });

  if (!form) notFound();

  const reached = form.submissionLimitTotal > 0 && form.project._count.testimonials >= form.submissionLimitTotal;
  const isInactive = !form.isActive;
  const isClosedByLimit = reached && form.closeWhenLimitReached;
  const isClosed = isInactive || isClosedByLimit;

  const accentColor = form.project.brandColor || "#0ea5e9";

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        ← TestiWall
      </Link>
      <Card
          className="overflow-hidden border-border shadow-xl"
        style={{ borderTop: `4px solid ${accentColor}` }}
      >
        <CardHeader>
          <div className="flex items-center gap-2">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${accentColor}20` }}
            >
              <MessageSquare className="h-5 w-5" style={{ color: accentColor }} />
            </div>
            <div>
              <CardTitle className="text-xl">{form.project.name} — Leave a testimonial</CardTitle>
              <CardDescription>Share your experience. Your testimonial may be displayed on our website.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {query.submitted ? (
            <div className="rounded-lg border border-secondary/50 bg-secondary/20 p-4 text-sm text-secondary-foreground">
              <strong>Thank you!</strong> Your testimonial was submitted for review. We&apos;ll let you know once it&apos;s published.
            </div>
          ) : null}
          {query.error ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              {decodeURIComponent(query.error)}
            </div>
          ) : null}
          {isClosed ? (
            <div className="rounded-lg border border-border bg-muted p-6 text-center text-muted-foreground">
              {isInactive ? "Submissions are currently disabled." : "The submission limit has been reached."}
            </div>
          ) : (
            <PublicTestimonialForm
              action={`/api/public/forms/${publicId}/submit`}
              publicId={publicId}
              projectName={form.project.name}
            />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
