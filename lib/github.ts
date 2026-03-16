import type { GitHubRepo } from '../types/github';

const USERNAME = 'cassiossousa';

export async function getRepos(): Promise<GitHubRepo[]> {
  const res = await fetch(
    `https://api.github.com/users/${USERNAME}/repos?per_page=100`,
    {
      headers: {
        Accept:
          'application/vnd.github+json, application/vnd.github.mercy-preview+json',
      },
      cache: 'no-store',
    },
  );

  if (!res.ok) {
    throw new Error(`GitHub API failed: ${res.status}`);
  }

  const repos: GitHubRepo[] = await res.json();

  return repos;
}

export async function getRepoReadme(repo: string): Promise<string | null> {
  const res = await fetch(
    `https://api.github.com/repos/${USERNAME}/${repo}/readme`,
    {
      headers: {
        Accept: 'application/vnd.github.raw',
      },
      cache: 'no-store',
    },
  );

  if (!res.ok) return null;

  const text: string = await res.text();

  return text.split('\n').slice(0, 10).join('\n');
}
