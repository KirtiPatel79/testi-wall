import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";

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
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        ← TestiWall
      </Link>
      <Card
        className="overflow-hidden border-slate-200/80 shadow-xl shadow-slate-200/30"
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
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <strong>Thank you!</strong> Your testimonial was submitted for review. We&apos;ll let you know once it&apos;s published.
            </div>
          ) : null}
          {query.error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {decodeURIComponent(query.error)}
            </div>
          ) : null}
          {isClosed ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
              {isInactive ? "Submissions are currently disabled." : "The submission limit has been reached."}
            </div>
          ) : (
            <form
              action={`/api/public/forms/${publicId}/submit`}
              method="post"
              encType="multipart/form-data"
              className="space-y-4"
            >
              <input type="hidden" name="redirectTo" value={`/f/${publicId}`} />
              <div className="space-y-2">
                <Label htmlFor="customer_name">Name *</Label>
                <Input id="customer_name" name="customer_name" placeholder="Your name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (1–5 stars, optional)</Label>
                <Input
                  id="rating"
                  type="number"
                  min={1}
                  max={5}
                  step={0.5}
                  name="rating"
                  placeholder="e.g. 5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="testimonial_text">Your testimonial *</Label>
                <Textarea
                  id="testimonial_text"
                  name="testimonial_text"
                  placeholder="Tell us about your experience..."
                  className="min-h-32"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photo">Photo (optional)</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  name="photo"
                  className="h-auto border-dashed py-3 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium"
                />
              </div>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3 transition-colors hover:bg-slate-50">
                <input type="checkbox" name="consent" required className="mt-1" />
                <span className="text-sm text-slate-600">
                  I consent to having this testimonial displayed publicly on {form.project.name}&apos;s website.
                </span>
              </label>
              <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-500">
                Submit testimonial
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
