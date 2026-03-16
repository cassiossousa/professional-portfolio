import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

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
    <article className="container-main prose dark:prose-invert">
      <h1>{project.title}</h1>

      <p>{project.description}</p>

      {project.stack && (
        <div className="flex flex-wrap gap-2">
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

      {project.stars && project.stars > 0 && <p>⭐ {project.stars}</p>}

      {project.repo && (
        <p>
          <a href={project.repo} target="_blank">
            View on GitHub
          </a>
        </p>
      )}

      {project.demo && (
        <p>
          <a href={project.demo} target="_blank">
            Live Demo
          </a>
        </p>
      )}

      {project.readme && (
        <>
          <h2>README</h2>
          {project.readme
            .split('\n')
            .filter((p) => p.trim())
            .map((p, i) => (
              <p key={i}>{p}</p>
            ))}
        </>
      )}
    </article>
  );
}
