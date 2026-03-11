import { MDXRemote } from 'next-mdx-remote/rsc';

import { cookies } from 'next/headers';
import { getEntry, getSlugs } from '../../../lib/content';

export function generateStaticParams() {
  return getSlugs('projects').map((slug) => ({
    slug,
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const locale = (await cookies()).get('lang')?.value ?? 'en';
  const project = getEntry('projects', params.slug, locale);

  return (
    <article className="container-main prose dark:prose-invert">
      <h1>{project.frontmatter.title}</h1>
      <MDXRemote source={project.content} />
    </article>
  );
}
