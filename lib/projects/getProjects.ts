import { getRepos, getRepoReadme } from '../github';
import { getAllEntries, getEntry } from '../content';

import type { Locale } from '../../types/i18n';
import type { Project } from '../../types/project';
import type { ProjectEntry } from '../../types/content';
import type { GitHubRepo } from '../../types/github';

import { normalizeGithubRepo } from './githubMapper';

function clean<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null),
  ) as Partial<T>;
}

function fromProjectEntry(entry: ProjectEntry): Project {
  return {
    slug: entry.slug,

    title: entry.frontmatter.title ?? entry.slug,

    description: entry.content?.split('\n')[0]?.trim(),

    repo: entry.frontmatter.repo,

    demo: entry.frontmatter.demo,

    stars: entry.frontmatter.stars,

    technologies: entry.frontmatter.technologies,

    summary: entry.frontmatter.summary,

    highlights: entry.frontmatter.highlights,

    topics: entry.frontmatter.topics,

    featured:
      entry.frontmatter.featured ??
      entry.frontmatter.topics?.includes('featured'),
  };
}

async function fetchGithubProjects(): Promise<Project[]> {
  const repos = await getRepos();

  const projects = await Promise.all(
    repos.map(async (repo: GitHubRepo) => {
      const readme = await getRepoReadme(repo.name);

      return normalizeGithubRepo(repo, readme ?? undefined);
    }),
  );

  return projects;
}

export async function getProjects(locale: Locale): Promise<Project[]> {
  const entries = (await getAllEntries('projects', locale)) as ProjectEntry[];

  const mdxProjects = entries.map(fromProjectEntry);

  try {
    const githubProjects = await fetchGithubProjects();

    const map = new Map<string, Project>();

    for (const p of mdxProjects) {
      map.set(p.slug, p);
    }

    for (const p of githubProjects) {
      const existing = map.get(p.slug);

      if (!existing) {
        map.set(p.slug, p);
        continue;
      }

      map.set(p.slug, {
        ...existing,
        ...clean(p),
      });
    }

    return [...map.values()];
  } catch {
    return mdxProjects;
  }
}

export async function getProject(
  slug: string,
  locale: Locale,
): Promise<Project | null> {
  const entry = getEntry('projects', slug, locale) as ProjectEntry | undefined;

  const mdxProject = entry ? fromProjectEntry(entry) : null;

  try {
    const repos = await getRepos();

    const repo = repos.find((r) => r.name === slug);

    if (!repo) return mdxProject;

    const readme = await getRepoReadme(repo.name);

    const githubProject = normalizeGithubRepo(repo, readme ?? undefined);

    if (!mdxProject) {
      return {
        slug: githubProject.slug,
        ...clean(githubProject),
      } as Project;
    }

    return {
      ...mdxProject,
      ...clean(githubProject),
    };
  } catch {
    return mdxProject;
  }
}
