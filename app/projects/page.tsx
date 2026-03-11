import Link from 'next/link';

import { cookies } from 'next/headers';

import { getAllEntries } from '../../lib/content';

export default async function ProjectsPage() {
  const locale = (await cookies()).get('lang')?.value ?? 'en';
  const projects = await getAllEntries('projects', locale);

  return (
    <section className="container-main">
      <h1 className="text-3xl font-bold mb-8">Projects</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <article key={project.slug} className="card">
            <Link
              href={`/projects/${project.slug}`}
              className="text-xl font-semibold"
            >
              {project.frontmatter.title}
            </Link>

            <p>{project.content}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
