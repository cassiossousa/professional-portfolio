import type { Project } from '../../types/project';
import type { ProjectEntry } from '../../types/content';

export function fromProjectEntry(entry: ProjectEntry): Project {
  return {
    slug: entry.slug,
    title: entry.frontmatter.title ?? entry.slug,
    description: entry.content,
    repo: entry.frontmatter.repo,
    demo: entry.frontmatter.demo,
    stars: entry.frontmatter.stars,
  };
}

export function fromGitHubRepo(repo: {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
}): Project {
  return {
    slug: repo.name,
    title: repo.name,
    description: repo.description ?? '',
    repo: repo.html_url,
    demo: repo.homepage ?? undefined,
    stars: repo.stargazers_count || undefined,
  };
}
