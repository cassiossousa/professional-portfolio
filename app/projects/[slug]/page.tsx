import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import ReactMarkdown from 'react-markdown';

import { getProject } from '../../../lib/projects/getProjects';

import type { Locale } from '../../../i18n/types';

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
    <article className="container-main prose dark:prose-invert max-w-3xl">
      <header className="mb-8">
        <h1>{project.title}</h1>

        {project.summary && (
          <ul className="mt-4 list-disc list-inside">
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
          {project.stars && <span>⭐ {project.stars}</span>}

          {project.repo && (
            <a href={project.repo} target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          )}

          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer">
              Live Demo
            </a>
          )}
        </div>
      </header>

      {project.highlights && (
        <section className="mb-8">
          <h2>Highlights</h2>

          <ul>
            {project.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {project.description && (
        <section>
          <ReactMarkdown>{project.description}</ReactMarkdown>
        </section>
      )}
    </article>
  );
}
