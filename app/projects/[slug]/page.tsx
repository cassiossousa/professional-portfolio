import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { getProject } from '../../../lib/projects/getProjects';

import type { Locale } from '../../../types/i18n';

function Section({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>

      <ul className="list-disc list-inside space-y-1">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const locale = (await cookies()).get('lang')?.value as Locale;

  const project = await getProject(slug, locale);

  if (!project) notFound();

  return (
    <article className="container-main max-w-3xl">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">{project.title}</h1>

        {project.description && (
          <p className="mt-3 text-lg">{project.description}</p>
        )}

        {project.summary && (
          <ul className="mt-4 list-disc list-inside space-y-1">
            {project.summary.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        )}

        {project.technologies && (
          <div className="flex flex-wrap gap-2 mt-4">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-xs px-2 py-1 bg-neutral-200 dark:bg-neutral-700 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-6 text-sm">
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              GitHub
            </a>
          )}

          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Live Demo
            </a>
          )}
        </div>
      </header>

      <Section title="Highlights" items={project.highlights} />
    </article>
  );
}
