import { NextRequest } from "next/server";
import { getVisitorInfo } from "@/lib/visitor-info";
import { sendVisitToDiscord } from "@/lib/discord-webhook";

type Bucket = { count: number; resetAt: number };

const WINDOW_MS = 60_000;
const LIMIT_PER_WINDOW = 10;
const visitBuckets = new Map<string, Bucket>();

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = visitBuckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    visitBuckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (bucket.count >= LIMIT_PER_WINDOW) return true;
  bucket.count += 1;
  return false;
}

function sameOriginAllowed(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    // Allow same-origin Next.js fetches that don't send Origin (older UA / SSR)
    // but only when Sec-Fetch-Site explicitly indicates same-origin.
    const secFetchSite = request.headers.get("sec-fetch-site");
    return secFetchSite === "same-origin" || secFetchSite === "same-site";
  }
  try {
    const reqOrigin = new URL(request.url).origin;
    return origin === reqOrigin;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!sameOriginAllowed(request)) {
    return Response.json({ ok: false }, { status: 403 });
  }

  const ip = clientIp(request);
  if (rateLimited(ip)) {
    return Response.json({ ok: false }, { status: 429 });
  }

  try {
    const body = await request.json();
    const rawPage = typeof body?.page === "string" ? body.page : "/";
    // Only accept in-site paths; never let an external URL land in Discord.
    const page = rawPage.startsWith("/") ? rawPage.slice(0, 256) : "/";

    const info = await getVisitorInfo(page);
    await sendVisitToDiscord(info);

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
