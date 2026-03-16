import Link from 'next/link';
import { cookies } from 'next/headers';

import { getProjects } from '../../lib/projects/getProjects';
import { getDictionary } from '../../i18n/dictionaries';

import type { Locale, Translation } from '../../i18n/types';
import type { Project } from '../../types/project';

export default async function ProjectsPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('lang')?.value ?? 'en') as Locale;

  const t: Translation = await getDictionary(locale);

  const projects: Project[] = await getProjects(locale);

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
              {project.title}
            </Link>

            <p className="mt-2">{project.description}</p>

            {project.stack && project.stack.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2 py-1 bg-neutral-200 dark:bg-neutral-700 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-3 flex gap-4 text-sm">
              {project.stars && project.stars > 0 && (
                <span>⭐ {project.stars}</span>
              )}

              {project.repo && (
                <a href={project.repo} target="_blank">
                  GitHub
                </a>
              )}

              {project.demo && (
                <a href={project.demo} target="_blank">
                  Demo
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
