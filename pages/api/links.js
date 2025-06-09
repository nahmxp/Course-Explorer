import { getDb } from "@/lib/db";

export default async function handler(req, res) {
  const db = await getDb();
  const col = db.collection("links");
  if (req.method === "GET") {
    const items = await col.find({}).toArray();
    res.status(200).json(items);
  } else if (req.method === "POST") {
    const { link } = req.body;
    if (!link) return res.status(400).json({ error: "Missing link" });
    await col.insertOne({ link, created: new Date() });
    res.status(201).json({ success: true });
  } else {
    res.status(405).end();
  }
}
