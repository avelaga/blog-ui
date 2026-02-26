import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getPostsByTag(tag) {
  const res = await fetch(`${API_URL}/api/posts/by-tag/${encodeURIComponent(tag)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function generateMetadata({ params }) {
  const { tag } = await params;
  return { title: `Posts tagged "${tag}"` };
}

export default async function TagPage({ params }) {
  const { tag } = await params;
  const { posts } = await getPostsByTag(tag);

  return (
    <main className="blog-container">
      <Link href="/" className="back-link">
        &larr; Back to all posts
      </Link>
      <h1 className="blog-title">Posts tagged &ldquo;{decodeURIComponent(tag)}&rdquo;</h1>
      {posts.length === 0 ? (
        <p className="empty">No posts with this tag yet.</p>
      ) : (
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.id} className="post-item">
              <Link href={`/posts/${post.slug}?from=${encodeURIComponent(tag)}`}>
                <h2>{post.title}</h2>
                <time>{new Date(post.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
