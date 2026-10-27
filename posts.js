import { db, auth } from "hatchable";
export const access = "public";
export const methods = ["GET", "POST"];
export default async function (req, res) {
  if (req.method === "GET") {
    const q = String(req.query?.q || "").trim();
    const { rows } = await db.query(
      "SELECT p.id, p.title, p.excerpt, p.content, p.category, p.author_id, p.author_name, p.created_at, p.updated_at, (SELECT count(*) FROM comments c WHERE c.post_id = p.id) AS comment_count FROM posts p WHERE ($1 = '' OR p.title ILIKE '%' || $1 || '%' OR p.content ILIKE '%' || $1 || '%' OR p.category ILIKE '%' || $1 || '%') ORDER BY p.created_at DESC LIMIT 100",
      [q]
    );
    return res.json({ posts: rows });
  }
  const user = await auth.getUser(req);
  if (!user) return res.status(401).json({ error: "Sign in to publish a story." });
  const title = String(req.body?.title || "").trim();
  const content = String(req.body?.content || "").trim();
  const category = String(req.body?.category || "Ideas").trim().slice(0, 40);
  if (title.length < 4 || content.length < 20) return res.status(400).json({ error: "Title must be 4+ characters and story 20+ characters." });
  const authorName = String(user.name || user.email?.split("@")[0] || "Writer").slice(0, 80);
  const { rows } = await db.query(
    "INSERT INTO posts (title, excerpt, content, category, author_id, author_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title, excerpt, content, category, author_id, author_name, created_at, updated_at",
    [title, content.slice(0, 180), content, category, user.id, authorName]
  );
  return res.status(201).json({ post: rows[0] });
}