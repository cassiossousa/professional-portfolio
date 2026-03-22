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

function removeTopHeading(markdown: string): string {
  const lines = markdown.split('\n');

  let firstContentIndex = 0;

  while (
    firstContentIndex < lines.length &&
    lines[firstContentIndex].trim() === ''
  ) {
    firstContentIndex++;
  }

  if (lines[firstContentIndex]?.startsWith('# ')) {
    lines.splice(firstContentIndex, 1);
  }

  return lines.join('\n').trim();
}

function extractSection(markdown: string, title: string): string[] | undefined {
  const regex = new RegExp(`##\\s+${title}[\\s\\S]*?(?=\\n##\\s|$)`, 'i');

  const match = markdown.match(regex);
  if (!match) return undefined;

  const bullets = [...match[0].matchAll(/^- (.*)/gm)];

  if (!bullets.length) return undefined;

  return bullets.map((b) => b[1].trim());
}

function extractTechnologies(markdown: string): string[] | undefined {
  const stack = extractSection(markdown, 'Tech Stack');

  if (!stack) return undefined;

  return stack.map((line) =>
    line.replace(/\*\*/g, '').replace(/:.*/, '').trim(),
  );
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

    let content = parsed.content.trim();

    content = removeTopHeading(content);

    const extractedSummary =
      data.summary ?? extractSection(content, 'Project Summary');

    const extractedHighlights =
      data.highlights ?? extractSection(content, 'Architecture Highlights');

    const extractedTechnologies =
      data.technologies ?? extractTechnologies(content);

    return {
      title: data.title,
      demo: data.demo,
      technologies: extractedTechnologies,
      summary: extractedSummary,
      highlights: extractedHighlights,
      featured: data.featured,
      description: content,
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

    stars: repo.stargazers_count > 0 ? repo.stargazers_count : undefined,

    technologies: parsed.technologies ?? extractStack(repo),

    summary: parsed.summary,

    highlights: parsed.highlights,

    featured: parsed.featured ?? repo.topics?.includes('featured'),

    readme,
  };
}
