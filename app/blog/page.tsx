import Link from 'next/link';

import { cookies } from 'next/headers';
import { getAllEntries } from '../../lib/content';

export default async function BlogPage() {
  const locale = (await cookies()).get('lang')?.value ?? 'en';
  const posts = await getAllEntries('blog', locale);

  return (
    <section className="container-main">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="text-xl font-semibold hover:underline"
            >
              {post.frontmatter.title}
            </Link>

            {post.frontmatter.date && (
              <p className="opacity-70">{post.frontmatter.date}</p>
            )}
            <p>{post.content}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
