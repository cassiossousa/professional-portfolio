import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { getEntry } from '../../../lib/content';

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const locale = (await cookies()).get('lang')?.value ?? 'en';

  let post;

  try {
    post = getEntry('blog', slug, locale);
  } catch {
    notFound();
  }

  return (
    <article className="container-main prose dark:prose-invert">
      <h1>{post.frontmatter.title}</h1>

      {post.frontmatter.date && (
        <p className="opacity-70">{post.frontmatter.date.toString()}</p>
      )}

      {post.content
        .split('\n')
        .filter((p) => p.trim())
        .map((p, i) => (
          <p key={i}>{p}</p>
        ))}
    </article>
  );
}
