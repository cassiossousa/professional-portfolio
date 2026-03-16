import type { Project } from '../../types/project';
import type { GitHubRepo } from '../../types/github';

function extractStack(repo: GitHubRepo): string[] {
  const stack = new Set<string>();

  if (repo.language) stack.add(repo.language);

  if (repo.topics) {
    for (const topic of repo.topics) {
      if (!['featured', 'portfolio', 'demo'].includes(topic)) {
        stack.add(topic);
      }
    }
  }

  return [...stack];
}

export function normalizeGithubRepo(repo: GitHubRepo): Project {
  return {
    slug: repo.name,
    title: repo.name,
    description: repo.description ?? '',
    repo: repo.html_url,
    demo: repo.homepage ?? undefined,
    stars: repo.stargazers_count > 0 ? repo.stargazers_count : undefined,
    stack: extractStack(repo),
  };
}
