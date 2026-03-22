import matter from 'gray-matter';

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

function getSection(content: string, title: string): string | undefined {
  const regex = new RegExp(`## ${title}[\\s\\S]*?(?=\\n## |$)`, 'i');
  const match = content.match(regex);

  if (!match) return;

  return match[0];
}

function extractBullets(section?: string): string[] | undefined {
  if (!section) return;

  const bullets = [...section.matchAll(/^- (.*)/gm)];

  if (!bullets.length) return;

  return bullets.map((b) => b[1].trim());
}

function extractTechnologies(section?: string): string[] | undefined {
  if (!section) return;

  const bullets = [...section.matchAll(/^- (.*)/gm)];

  if (!bullets.length) return;

  return bullets.map((b) =>
    b[1].replace(/\*\*/g, '').replace(/:.*/, '').trim(),
  );
}

function removeTopHeading(markdown: string): string {
  const lines = markdown.split('\n');

  let i = 0;

  while (i < lines.length && lines[i].trim() === '') i++;

  if (lines[i]?.startsWith('# ')) {
    lines.splice(i, 1);
  }

  return lines.join('\n').trim();
}

function extractDescription(content: string): string | undefined {
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) continue;
    if (trimmed.startsWith('## ')) break;

    return trimmed;
  }
}

function parseReadme(readme?: string) {
  if (!readme) return {};

  try {
    const parsed = matter(readme);

    const data = parsed.data as {
      title?: string;
      demo?: string;
      technologies?: string[];
      summary?: string[];
      highlights?: string[];
      featured?: boolean;
    };

    let content = removeTopHeading(parsed.content.trim());

    const techSection = getSection(content, 'Tech Stack');

    return {
      title: data.title,
      demo: data.demo,

      description: extractDescription(content),

      technologies: data.technologies ?? extractTechnologies(techSection),

      summary:
        data.summary ?? extractBullets(getSection(content, 'Project Summary')),

      highlights:
        data.highlights ??
        extractBullets(getSection(content, 'Architecture Highlights')),

      architecture: extractBullets(
        getSection(content, 'Architecture Highlights'),
      ),

      features: extractBullets(getSection(content, 'Key Features')),

      quality: extractBullets(getSection(content, 'Quality')),

      featured: data.featured,
    };
  } catch {
    return {};
  }
}

export function normalizeGithubRepo(
  repo: GitHubRepo,
  readme?: string,
): Project {
  const parsed = parseReadme(readme);

  return {
    slug: repo.name,

    title: parsed.title ?? repo.name,

    description: parsed.description ?? repo.description ?? '',

    repo: repo.html_url,

    demo: parsed.demo ?? repo.homepage ?? undefined,

    stars: repo.stargazers_count || undefined,

    technologies: parsed.technologies ?? extractStack(repo),

    summary: parsed.summary,

    highlights: parsed.highlights,

    architecture: parsed.architecture,

    features: parsed.features,

    quality: parsed.quality,

    featured: parsed.featured ?? repo.topics?.includes('featured'),
  };
}
