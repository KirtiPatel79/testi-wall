"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-helpers";
import { createProjectSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export type CreateProjectState = { success: boolean; error: string | null };

export async function createProjectAction(
  _prevState: CreateProjectState,
  formData: FormData
): Promise<CreateProjectState> {
  const userId = await requireUserId();

  const rawName = String(formData.get("name") || "").trim();
  const rawSlug = String(formData.get("slug") || "").trim();
  const parsed = createProjectSchema.safeParse({
    name: rawName,
    slug: slugify(rawSlug || rawName),
    theme: String(formData.get("theme") || "light"),
    layout: String(formData.get("layout") || "grid"),
    brandColor: String(formData.get("brandColor") || "#0ea5e9"),
  });

  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const msg = first.slug?.[0] ?? first.name?.[0] ?? "Invalid input. Please check your fields.";
    return { success: false, error: msg };
  }

  const slug = parsed.data.slug;
  const existing = await prisma.project.findUnique({ where: { slug } });
  if (existing) {
    return { success: false, error: "This URL slug is already taken. Try a different one." };
  }

  await prisma.project.create({
    data: {
      userId,
      name: parsed.data.name,
      slug,
      theme: parsed.data.theme,
      layout: parsed.data.layout,
      brandColor: parsed.data.brandColor,
      forms: {
        create: {
          publicId: randomUUID(),
          submissionLimitTotal: 0,
          closeWhenLimitReached: true,
          requireInviteToken: false,
          isActive: true,
        },
      },
    },
  });

  revalidatePath("/app/projects");
  return { success: true, error: null };
}
