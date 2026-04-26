import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { signupSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstMessage =
      fieldErrors.email?.[0] ||
      fieldErrors.password?.[0] ||
      "Please check your email and password.";
    return NextResponse.json({ error: firstMessage }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email is already registered." }, { status: 409 });
  }

  const passwordHash = await hash(parsed.data.password, 10);
  await prisma.user.create({ data: { email, passwordHash } });

  return NextResponse.json({ ok: true });
}
