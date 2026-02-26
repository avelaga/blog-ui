import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getPost(slug) {
  const res = await fetch(`${API_URL}/api/posts/by-slug/${slug}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Post not found");
  return res.json();
}

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;
    const post = await getPost(slug);
    return {
      title: post.title,
      description: post.meta_description || undefined,
      openGraph: {
        title: post.title,
        description: post.meta_description || undefined,
        images: post.og_image ? [post.og_image] : undefined,
      },
    };
  } catch {
    return { title: "Post not found" };
  }
}

export default async function PostPage({ params, searchParams }) {
  const { slug } = await params;
  const { from } = await searchParams;
  const post = await getPost(slug);

  const backHref = from ? `/tag/${encodeURIComponent(from)}` : "/";
  const backLabel = from ? `Back to "${from}"` : "Back to posts";

  return (
    <main className="blog-container">
      <Link href={backHref} className="back-link">
        &larr; {backLabel}
      </Link>
      <article className="blog-post">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <time>
            {new Date(post.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {post.tags && post.tags.length > 0 && (
            <div className="post-tags">
              {post.tags.map((tag) => (
                <Link key={tag} href={`/tag/${tag}`} className="tag tag-link">{tag}</Link>
              ))}
            </div>
          )}
        </div>
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </main>
  );
}
