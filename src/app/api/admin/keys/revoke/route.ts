import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { revokeKey } from "@/lib/keys";

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { prefix } = await req.json();
  if (!prefix) return NextResponse.json({ error: "missing_prefix" }, { status: 400 });
  await revokeKey(prefix);
  return NextResponse.json({ ok: true });
}