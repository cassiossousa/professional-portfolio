import Link from 'next/link';
import { cookies } from 'next/headers';

import { getAllEntries } from '../../lib/content';
import { getDictionary } from '../../i18n/dictionaries';
import { Locale, Translation } from '../../i18n/types';

export default async function ProjectsPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('lang')?.value ?? 'en') as Locale;

  const t: Translation = await getDictionary(locale);
  const projects = await getAllEntries('projects', locale);

  return (
    <section className="container-main">
      <h1 className="text-3xl font-bold mb-8">{t.projects.title}</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <article key={project.slug} className="card">
            <Link
              href={`/projects/${project.slug}`}
              className="text-xl font-semibold hover:underline"
            >
              {project.frontmatter.title}
            </Link>

            <p className="mt-2">{project.content}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
