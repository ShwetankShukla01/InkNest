import { db, auth } from "hatchable";
export const access = "public";
export const methods = ["GET", "POST", "DELETE"];
export default async function (req, res) {
  if (req.method === "GET") {
    const postId = String(req.query?.post_id || "");
    if (!postId) return res.status(400).json({ error: "post_id is required." });
    const { rows } = await db.query("SELECT id, post_id, author_id, author_name, content, created_at FROM comments WHERE post_id = $1 ORDER BY created_at ASC LIMIT 200", [postId]);
    return res.json({ comments: rows });
  }
  const user = await auth.getUser(req);
  if (!user) return res.status(401).json({ error: "Sign in to join the conversation." });
  if (req.method === "POST") {
    const postId = String(req.body?.post_id || "");
    const content = String(req.body?.content || "").trim();
    if (content.length < 2 || content.length > 1200) return res.status(400).json({ error: "Comment must be between 2 and 1200 characters." });
    const exists = await db.query("SELECT id FROM posts WHERE id = $1", [postId]);
    if (!exists.rows.length) return res.status(404).json({ error: "Story not found." });
    const authorName = String(user.name || user.email?.split("@")[0] || "Reader").slice(0, 80);
    const { rows } = await db.query("INSERT INTO comments (post_id, author_id, author_name, content) VALUES ($1, $2, $3, $4) RETURNING id, post_id, author_id, author_name, content, created_at", [postId, user.id, authorName, content]);
    return res.status(201).json({ comment: rows[0] });
  }
  const id = String(req.body?.id || "");
  const result = await db.query("DELETE FROM comments WHERE id = $1 AND author_id = $2 RETURNING id", [id, user.id]);
  if (!result.rowCount) return res.status(404).json({ error: "Comment not found or you do not own it." });
  return res.json({ ok: true });
}