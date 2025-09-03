import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const PEPPER = process.env.KEY_PEPPER!;

function hmac(fullKey: string) {
  return crypto.createHmac("sha256", PEPPER).update(fullKey).digest("base64");
}

function randBase62(n = 32) {
  const buf = crypto.randomBytes(n);
  return buf.toString("base64url"); // ok for urls
}

export function makeKey(type: "pk" | "sk") {
  const prefix = randBase62(6).slice(0, 8);
  const full = `${type}_live_${prefix}_${randBase62(24)}`;
  return { prefix, full, hash: hmac(full) };
}

export async function issueKey(opts: {
  name: string;
  type?: "pk"|"sk";
  scopes?: string[];
  ratePerMin?: number;
  dailyQuota?: number;
  domains?: string[];
  projectId?: string;
  createdBy?: string;
}) {
  const { prefix, full, hash } = makeKey(opts.type || "pk");
  await prisma.apiKey.create({
    data: {
      name: opts.name,
      type: opts.type || "pk",
      prefix,
      hash,
      scopes: opts.scopes || [],
      ratePerMin: opts.ratePerMin ?? 60,
      dailyQuota: opts.dailyQuota ?? 2000,
      domainAllow: opts.domains || [],
      projectId: opts.projectId,
      createdBy: opts.createdBy
    }
  });
  return { apiKey: full, prefix };
}

export async function revokeKey(prefix: string) {
  await prisma.apiKey.updateMany({
    where: { prefix, revokedAt: null },
    data: { revokedAt: new Date() }
  });
}

export function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

export async function verifyKey(fullKey: string, origin?: string) {
  const parts = fullKey.split("_");
  const prefix = parts[2]; // pk_live_<prefix>_<rand>
  if (!prefix) return { ok: false, reason: "bad_format" };
  const rec = await prisma.apiKey.findUnique({ where: { prefix } });
  if (!rec) return { ok: false, reason: "not_found" };
  if (rec.revokedAt) return { ok: false, reason: "revoked" };
  if (origin && Array.isArray(rec.domainAllow) && rec.domainAllow.length) {
    const host = new URL(origin).host;
    const ok = rec.domainAllow.some(d => host === d || host.endsWith(`.${d}`));
    if (!ok) return { ok: false, reason: "origin_denied" };
  }
  if (!safeEqual(rec.hash, hmac(fullKey))) return { ok: false, reason: "bad_sig" };
  return { ok: true, rec };
}