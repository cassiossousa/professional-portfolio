import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { getEntry, getSlugs } from '../../../lib/content';
import { renderMDX } from '../../../lib/mdx';

export function generateStaticParams() {
  const slugs = getSlugs('experience');

  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function ExperienceSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const cookieStore = await cookies();
  const locale = cookieStore.get('lang')?.value ?? 'en';

  let entry;

  try {
    entry = getEntry('experience', slug, locale);
  } catch {
    notFound();
  }

  const MDXContent = await renderMDX(entry.content);

  const { role, company, location, start, end } = entry.frontmatter;
  const period =
    start && end
      ? `${start?.toString()} - ${end.toString()}`
      : start
        ? `${start?.toString()} - Present`
        : '';

  return (
    <article className="container-main prose dark:prose-invert">
      <header className="mb-10">
        <h1>{role}</h1>
        <p>{company}</p>
        {location && <p>{location}</p>}
        {period && <p>{period}</p>}
      </header>

      <MDXContent />
    </article>
  );
}
