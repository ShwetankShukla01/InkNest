import { db, auth } from "hatchable";
export const access = "public";
export const methods = ["GET", "PUT", "DELETE"];
export default async function (req, res) {
  const id = req.params.id;
  if (req.method === "GET") {
    const { rows } = await db.query("SELECT p.id, p.title, p.excerpt, p.content, p.category, p.author_id, p.author_name, p.created_at, p.updated_at, (SELECT count(*) FROM comments c WHERE c.post_id = p.id) AS comment_count FROM posts p WHERE p.id = $1", [id]);
    if (!rows.length) return res.status(404).json({ error: "Story not found." });
    return res.json({ post: rows[0] });
  }
  const user = await auth.getUser(req);
  if (!user) return res.status(401).json({ error: "Sign in first." });
  if (req.method === "PUT") {
    const title = String(req.body?.title || "").trim();
    const content = String(req.body?.content || "").trim();
    const category = String(req.body?.category || "Ideas").trim().slice(0, 40);
    if (title.length < 4 || content.length < 20) return res.status(400).json({ error: "Please provide a longer title and story." });
    const { rows } = await db.query("UPDATE posts SET title = $1, excerpt = $2, content = $3, category = $4, updated_at = now() WHERE id = $5 AND author_id = $6 RETURNING id, title, excerpt, content, category, author_id, author_name, created_at, updated_at", [title, content.slice(0, 180), content, category, id, user.id]);
    if (!rows.length) return res.status(404).json({ error: "Story not found or you do not own it." });
    return res.json({ post: rows[0] });
  }
  const result = await db.query("DELETE FROM posts WHERE id = $1 AND author_id = $2 RETURNING id", [id, user.id]);
  if (!result.rowCount) return res.status(404).json({ error: "Story not found or you do not own it." });
  return res.json({ ok: true });
}