import 'dotenv/config';

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

import { getRepos, getRepoReadme } from '../lib/github.ts';
import { normalizeGithubRepo } from '../lib/projects/githubMapper.ts';

/**
 * @typedef {import('../types/github').GitHubRepo} GitHubRepo
 */

function clean(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null),
  );
}

function extractListSection(markdown, title) {
  const regex = new RegExp(`##\\s+${title}[\\s\\S]*?(?=\\n##\\s|$)`, 'i');

  const match = markdown.match(regex);
  if (!match) return undefined;

  const bullets = [...match[0].matchAll(/^- (.*)/gm)];

  if (!bullets.length) return undefined;

  return bullets.map((b) => b[1].trim());
}

function extractTechnologies(markdown) {
  const section = extractListSection(markdown, 'Tech Stack');
  if (!section) return undefined;

  return section.map((s) => s.replace(/\*\*/g, '').replace(/:.*/, '').trim());
}

async function clearProjects(dir) {
  try {
    const files = await fs.readdir(dir);

    await Promise.all(
      files
        .filter((f) => f.endsWith('.mdx'))
        .map((f) => fs.unlink(path.join(dir, f))),
    );
  } catch {}
}

async function run() {
  /** @type {GitHubRepo[]} */
  const repos = await getRepos(true);

  const featured = repos.filter(
    (repo) =>
      Boolean(repo.topics?.includes('featured') || repo.featured) ||
      Boolean(repo.topics?.includes('resume')),
  );

  const dir = path.join(process.cwd(), 'content/projects');

  await fs.mkdir(dir, { recursive: true });

  await clearProjects(dir);

  for (const repo of featured) {
    const readme = await getRepoReadme(repo.name, true);

    let readmeContent = '';
    let readmeData = {};

    if (readme) {
      const parsed = matter(readme);

      readmeContent = parsed.content.trim();
      readmeData = parsed.data;
    }

    const project = normalizeGithubRepo(repo, readme);

    const extractedSummary = extractListSection(
      readmeContent,
      'Project Summary',
    );

    const extractedHighlights = extractListSection(
      readmeContent,
      'Architecture Highlights',
    );

    const extractedTechnologies = extractTechnologies(readmeContent);

    const frontmatter = clean({
      title: project.title,
      repo: project.repo,
      demo: project.demo,
      stars: project.stars,
      featured: project.featured,
      topics: repo.topics ?? [],

      technologies: readmeData.technologies ?? extractedTechnologies,

      summary: readmeData.summary ?? extractedSummary,

      highlights: readmeData.highlights ?? extractedHighlights,

      ...readmeData,
    });

    const file = matter.stringify(readmeContent, frontmatter);

    const filePath = path.join(dir, `${project.slug}.mdx`);

    await fs.writeFile(filePath, file);
  }

  console.log(`Synced ${featured.length} GitHub projects.`);
}

run();
