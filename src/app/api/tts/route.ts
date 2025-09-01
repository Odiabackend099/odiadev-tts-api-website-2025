import { NextRequest, NextResponse } from "next/server";
import { verifyKey } from "@/lib/keys";

export async function POST(req: NextRequest) {
  const odiaKey = req.headers.get("x-odia-key") || "";
  const origin = req.headers.get("origin") || undefined;

  const v = await verifyKey(odiaKey, origin);
  if (!v.ok) return NextResponse.json({ error: "invalid_key", reason: v.reason }, { status: 401 });

  const { text, voice = "naija_female", format = "mp3_48k" } = await req.json();
  if (!text || text.length > 600) {
    return NextResponse.json({ error: "bad_text" }, { status: 400 });
  }

  // (Optional) rate limit: simple in-memory minute window (replace with Redis in prod)
  // ...

  const upstream = await fetch(`${process.env.ODIA_UPSTREAM_BASE}/v1/tts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "audio/mpeg",
      "X-API-Key": process.env.ODIA_UPSTREAM_KEY!
    },
    body: JSON.stringify({ text, voice, format })
  });

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => "");
    return NextResponse.json({ error: "upstream_error", detail }, { status: upstream.status });
  }
  const buf = await upstream.arrayBuffer();
  return new NextResponse(buf, { status: 200, headers: { "Content-Type": "audio/mpeg" } });
}