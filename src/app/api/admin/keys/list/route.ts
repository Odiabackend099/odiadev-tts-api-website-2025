import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { isAdmin } from "@/lib/adminAuth";
const prisma = new PrismaClient();

export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const keys = await prisma.apiKey.findMany({ orderBy: { createdAt: "desc" } });
  // do NOT return hashes
  return NextResponse.json(keys.map(k => ({
    id: k.id, name: k.name, type: k.type, prefix: k.prefix, scopes: k.scopes,
    ratePerMin: k.ratePerMin, dailyQuota: k.dailyQuota, domainAllow: k.domainAllow,
    createdAt: k.createdAt, revokedAt: k.revokedAt, lastUsedAt: k.lastUsedAt
  })));
}