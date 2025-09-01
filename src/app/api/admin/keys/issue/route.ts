import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { issueKey } from "@/lib/keys";

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  const out = await issueKey({
    name: body.name || "Unnamed",
    type: body.type || "pk",
    scopes: body.scopes || ["tts:read"],
    ratePerMin: body.ratePerMin,
    dailyQuota: body.dailyQuota,
    domains: body.domains || [],
    projectId: body.projectId,
    createdBy: "admin"
  });
  return NextResponse.json(out);
}