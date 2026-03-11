import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { getEntry } from '../../../lib/content';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const locale = (await cookies()).get('lang')?.value ?? 'en';

  let project;

  try {
    project = getEntry('projects', slug, locale);
  } catch {
    notFound();
  }

  return (
    <article className="container-main prose dark:prose-invert">
      <h1>{project.frontmatter.title}</h1>

      {project.content
        .split('\n')
        .filter((p) => p.trim())
        .map((p, i) => (
          <p key={i}>{p}</p>
        ))}
    </article>
  );
}
