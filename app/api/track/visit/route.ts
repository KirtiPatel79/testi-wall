import { NextRequest } from "next/server";
import { getVisitorInfo } from "@/lib/visitor-info";
import { sendVisitToDiscord } from "@/lib/discord-webhook";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const page = typeof body?.page === "string" ? body.page : "/";

    const info = await getVisitorInfo(page);
    await sendVisitToDiscord(info);

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
