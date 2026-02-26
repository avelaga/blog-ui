import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getPosts() {
  const res = await fetch(`${API_URL}/api/posts`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export default async function Home() {
  const { posts, pagination } = await getPosts();

  return (
    <main className="blog-container">
      <h1 className="blog-title">Blog</h1>
      {posts.length === 0 ? (
        <p className="empty">No posts published yet.</p>
      ) : (
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.id} className="post-item">
              <Link href={`/posts/${post.slug}`}>
                <h2>{post.title}</h2>
                <time>{new Date(post.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
              </Link>
              {post.tags && post.tags.length > 0 && (
                <div className="post-tags">
                  {post.tags.map((tag) => (
                    <Link key={tag} href={`/tag/${tag}`} className="tag tag-link">{tag}</Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
