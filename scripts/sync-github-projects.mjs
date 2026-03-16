import fs from 'fs/promises';
import path from 'path';

import { getRepos, getRepoReadme } from '../lib/github.ts';
import { normalizeGithubRepo } from '../lib/projects/githubProject.ts';

/**
 * @typedef {import('../types/github').GitHubRepo} GitHubRepo
 */

async function run() {
  /** @type {GitHubRepo[]} */
  const repos = await getRepos();

  const featured = repos.filter((repo) => repo.topics?.includes('featured'));

  const dir = path.join(process.cwd(), 'content/projects');

  await fs.mkdir(dir, { recursive: true });

  for (const repo of featured) {
    const project = normalizeGithubRepo(repo);

    const readme = await getRepoReadme(repo.name);

    const file = `---
title: ${project.title}
repo: ${project.repo ?? ''}
demo: ${project.demo ?? ''}
stars: ${project.stars ?? ''}
stack: [${(project.stack ?? []).join(', ')}]
---

${readme ?? project.description}
`;

    await fs.writeFile(path.join(dir, `${project.slug}.mdx`), file);
  }

  console.log(`Synced ${featured.length} GitHub projects.`);
}

run();
