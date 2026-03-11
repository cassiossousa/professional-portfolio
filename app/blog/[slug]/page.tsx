import { MDXRemote } from 'next-mdx-remote/rsc';

import { cookies } from 'next/headers';
import { getEntry, getSlugs } from '../../../lib/content';

export function generateStaticParams() {
  return getSlugs('blog').map((slug) => ({
    slug,
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const locale = (await cookies()).get('lang')?.value ?? 'en';
  const post = getEntry('blog', params.slug, locale);

  return (
    <article className="container-main prose dark:prose-invert">
      <h1>{post.frontmatter.title}</h1>
      {post.frontmatter.date && (
        <p className="opacity-70">{post.frontmatter.date}</p>
      )}
      <MDXRemote source={post.content} />
    </article>
  );
}
