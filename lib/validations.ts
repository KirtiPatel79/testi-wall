import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens are allowed."),
  theme: z.enum(["light", "dark"]).default("light"),
  layout: z.enum(["grid", "list", "carousel"]).default("grid"),
  brandColor: z.string().regex(/^#([0-9a-fA-F]{6})$/, "Use hex color like #0ea5e9"),
});

export const updateProjectSchema = createProjectSchema.partial();

export const formSettingsSchema = z.object({
  submissionLimitTotal: z.coerce.number().int().min(0).default(0),
  closeWhenLimitReached: z.coerce.boolean().default(true),
  requireInviteToken: z.coerce.boolean().default(false),
});

export const publicSubmitSchema = z.object({
  customer_name: z.string().min(1).max(120),
  rating: z
    .union([
      z.literal(""),
      z.coerce
        .number()
        .min(1)
        .max(5)
        .refine((value) => Number.isInteger(value * 2), "Rating must be in 0.5 steps"),
    ])
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  testimonial_text: z.string().min(10).max(5000),
  consent: z.string().refine((v) => v === "on", { message: "Consent is required." }),
});

export const moderationUpdateSchema = z.object({
  name: z.string().min(1).max(120),
  text: z.string().min(5).max(5000),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});
