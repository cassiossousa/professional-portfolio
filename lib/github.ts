import type { GitHubRepo } from '../types/github';

const BASE = 'https://api.github.com';
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

const headers: HeadersInit = {
  Accept: 'application/vnd.github+json',
  ...(process.env.GITHUB_TOKEN && {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  }),
};

export async function getRepos(): Promise<GitHubRepo[]> {
  const res = await fetch(
    `${BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
    { headers },
  );

  if (!res.ok) {
    throw new Error(`GitHub repos fetch failed: ${res.status}`);
  }

  return res.json();
}

export async function getRepoReadme(repo: string): Promise<string | undefined> {
  const res = await fetch(`${BASE}/repos/${GITHUB_USERNAME}/${repo}/readme`, {
    headers,
  });

  if (!res.ok) return;

  const data = await res.json();

  return Buffer.from(data.content, 'base64').toString('utf-8');
}
