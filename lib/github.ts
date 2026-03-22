import type { GitHubRepo } from '../types/github';

const BASE = 'https://api.github.com';
const USERNAME = process.env.GITHUB_USERNAME;
const TOKEN = process.env.GITHUB_TOKEN;
const FAIL_RATE = 0.2;

const headers: HeadersInit = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'portfolio-sync',
  ...(TOKEN && {
    Authorization: `token ${TOKEN}`,
  }),
};

function simulateFailure() {
  if (Math.random() < FAIL_RATE) {
    throw new Error(`Simulated GitHub failure (${FAIL_RATE * 100}%)`);
  }
}

async function fetchJson(url: string, bypassFailRate: boolean) {
  if (!bypassFailRate) {
    simulateFailure();
  }

  const res = await fetch(url, { headers });

  if (!res.ok) {
    throw new Error(`GitHub request failed (${res.status})`);
  }

  return res.json();
}

export async function getRepos(
  bypassFailRate: boolean = false,
): Promise<GitHubRepo[]> {
  if (!USERNAME) throw new Error('Missing GITHUB_USERNAME');

  return fetchJson(
    `${BASE}/users/${USERNAME}/repos?per_page=100&sort=updated&type=owner`,
    bypassFailRate,
  );
}

export async function getRepoReadme(
  repo: string,
  bypassFailRate: boolean = false,
): Promise<string | undefined> {
  if (!USERNAME) return;

  try {
    const data = await fetchJson(
      `${BASE}/repos/${USERNAME}/${repo}/readme`,
      bypassFailRate,
    );

    if (!data?.content) return;

    return Buffer.from(data.content, 'base64').toString('utf8');
  } catch {
    return;
  }
}
