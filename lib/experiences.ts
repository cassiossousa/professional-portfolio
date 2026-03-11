import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Experience } from '../types/experience';

const EXPERIENCE_DIR = path.join(process.cwd(), 'content/experience');

function resolveFile(slug: string, locale: string) {
  const localized = path.join(EXPERIENCE_DIR, `${slug}.${locale}.mdx`);

  const fallback = path.join(EXPERIENCE_DIR, `${slug}.en.mdx`);

  if (fs.existsSync(localized)) return localized;

  return fallback;
}

export function getAllExperience(locale: string): Experience[] {
  const files = fs.readdirSync(EXPERIENCE_DIR);
  const slugs = new Set(files.map((file) => file.split('.')[0]));
  const roles = [...slugs].map((slug) => {
    const filePath = resolveFile(slug, locale);
    const source = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(source);

    return {
      slug,
      ...data,
    } as Experience;
  });

  return roles.sort(
    (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime(),
  );
}

export function getExperience(slug: string, locale: string) {
  const filePath = resolveFile(slug, locale);
  const source = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(source);

  return {
    frontmatter: data as Experience,
    content,
  };
}
