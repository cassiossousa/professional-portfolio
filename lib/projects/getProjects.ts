import { getRepos, getRepoReadme } from '../github';
import { getAllEntries, getEntry } from '../content';

import type { Locale } from '../../i18n/types';
import type { Project } from '../../types/project';
import type { ProjectEntry } from '../../types/content';

import { normalizeGithubRepo } from './githubMapper';

function fromProjectEntry(entry: ProjectEntry): Project {
  return {
    slug: entry.slug,
    title: entry.frontmatter.title ?? entry.slug,
    description: entry.content,
    repo: entry.frontmatter.repo,
    demo: entry.frontmatter.demo,
    stars: entry.frontmatter.stars,
    technologies: entry.frontmatter.technologies,
    summary: entry.frontmatter.summary,
    highlights: entry.frontmatter.highlights,
  };
}

export async function getProjects(locale: Locale): Promise<Project[]> {
  const repos = await getRepos().catch(() => null);

  if (repos) {
    const featured = repos.filter((r) => r.topics?.includes('featured'));

    if (featured.length) {
      const projects = await Promise.all(
        featured.map(async (repo) => {
          const readme = await getRepoReadme(repo.name);

          return normalizeGithubRepo(repo, readme ?? undefined);
        }),
      );

      return projects;
    }
  }

  const entries = (await getAllEntries('projects', locale)) as ProjectEntry[];

  return entries.map(fromProjectEntry);
}

export async function getProject(
  slug: string,
  locale: Locale,
): Promise<Project | null> {
  const repos = await getRepos().catch(() => null);

  if (repos) {
    const repo = repos.find((r) => r.name === slug);

    if (repo) {
      const readme = await getRepoReadme(repo.name);

      return normalizeGithubRepo(repo, readme ?? undefined);
    }
  }

  const entry = getEntry('projects', slug, locale) as ProjectEntry | undefined;

  if (!entry) return null;

  return fromProjectEntry(entry);
}
