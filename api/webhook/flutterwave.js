export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
  // TODO: verify signature (verif-hash) and process event
  return res.status(200).json({ received: true });
}