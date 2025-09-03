export function isAdmin(req: Request) {
  const h = req.headers.get("authorization") || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : "";
  return token && token === process.env.ADMIN_TOKEN;
}