import { cookies } from 'next/headers';
import { MDXRemote } from 'next-mdx-remote/rsc';

import { getEntry, getSlugs } from '../../../lib/content';
import { ContentEntry } from '../../../types/content';

export function generateStaticParams() {
  return getSlugs('experience').map((slug) => ({
    slug,
  }));
}

export default function ExperienceRolePage({
  params,
}: {
  params: { slug: string };
}) {
  const locale = cookies().get('lang')?.value ?? 'en';

  const entry: ContentEntry = getEntry('experience', params.slug, locale);

  const { role, company, location, start, end } = entry.frontmatter;

  const period = end ? `${start} – ${end}` : `${start} – Present`;

  return (
    <article className="container-main prose dark:prose-invert">
      <h1>{role}</h1>

      <p>
        <strong>{company}</strong>

        {location && ` • ${location}`}
      </p>

      <p>{period}</p>

      <MDXRemote source={entry.content} />
    </article>
  );
}
