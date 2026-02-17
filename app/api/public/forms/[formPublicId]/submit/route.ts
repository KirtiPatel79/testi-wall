import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publicSubmitSchema } from "@/lib/validations";
import { sanitizePlainText } from "@/lib/utils";
import { saveUpload } from "@/lib/storage";

function getSafeRedirectPath(rawRedirect: string, requestUrl: string, fallbackPath: string): string {
  const candidate = rawRedirect.trim();
  if (!candidate) return fallbackPath;

  try {
    const resolved = new URL(candidate, requestUrl);
    const base = new URL(requestUrl);

    if (resolved.origin !== base.origin) return fallbackPath;
    if (!resolved.pathname.startsWith("/f/")) return fallbackPath;

    return `${resolved.pathname}${resolved.search}`;
  } catch {
    return fallbackPath;
  }
}

function redirectWithQuery(requestUrl: string, path: string, key: string, value: string) {
  const url = new URL(path, requestUrl);
  url.searchParams.set(key, value);
  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request, { params }: { params: Promise<{ formPublicId: string }> }) {
  const { formPublicId } = await params;
  const formData = await request.formData();
  const fallbackPath = `/f/${formPublicId}`;
  const redirectTo = getSafeRedirectPath(String(formData.get("redirectTo") || ""), request.url, fallbackPath);

  const form = await prisma.form.findUnique({
    where: { publicId: formPublicId },
    include: {
      project: {
        include: {
          _count: { select: { testimonials: true } },
        },
      },
    },
  });

  if (!form) {
    return redirectWithQuery(request.url, redirectTo, "error", "Form not found");
  }

  if (!form.isActive) {
    return redirectWithQuery(request.url, redirectTo, "error", "Form is not accepting submissions");
  }

  const reached = form.submissionLimitTotal > 0 && form.project._count.testimonials >= form.submissionLimitTotal;
  if (reached && form.closeWhenLimitReached) {
    return redirectWithQuery(request.url, redirectTo, "error", "Form closed");
  }

  const parsed = publicSubmitSchema.safeParse({
    customer_name: String(formData.get("customer_name") || ""),
    rating: String(formData.get("rating") || ""),
    testimonial_text: String(formData.get("testimonial_text") || ""),
    consent: String(formData.get("consent") || ""),
  });

  if (!parsed.success) {
    return redirectWithQuery(request.url, redirectTo, "error", "Invalid form data");
  }

  let photoUrl: string | null = null;
  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    try {
      const stored = await saveUpload(photo);
      photoUrl = stored.publicUrl;
    } catch (error) {
      return redirectWithQuery(
        request.url,
        redirectTo,
        "error",
        error instanceof Error ? error.message : "Invalid image"
      );
    }
  }

  const ipHeader = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "";
  const submittedIp = ipHeader.split(",")[0]?.trim() || null;

  await prisma.testimonial.create({
    data: {
      projectId: form.projectId,
      formId: form.id,
      status: "PENDING",
      name: sanitizePlainText(parsed.data.customer_name),
      rating: parsed.data.rating ?? null,
      text: sanitizePlainText(parsed.data.testimonial_text),
      photoUrl,
      consentGiven: true,
      submittedIp,
    },
  });

  return redirectWithQuery(request.url, redirectTo, "submitted", "1");
}
