import { NextRequest, NextResponse } from "next/server";

type Bucket = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 60_000;
const LIMIT = 15;

const store = new Map<string, Bucket>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export function proxy(request: NextRequest) {
  if (request.method !== "POST" || !request.nextUrl.pathname.startsWith("/api/public/forms/")) {
    return NextResponse.next();
  }

  const ip = getClientIp(request);
  const now = Date.now();
  const bucket = store.get(ip);

  if (!bucket || now > bucket.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return NextResponse.next();
  }

  if (bucket.count >= LIMIT) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  bucket.count += 1;
  store.set(ip, bucket);
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/public/forms/:path*/submit"],
};
