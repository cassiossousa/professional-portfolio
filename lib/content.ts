import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import { ContentEntry, ContentType } from '../types/content';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

function getDir(type: ContentType) {
  return path.join(CONTENT_ROOT, type);
}

function resolveFile(dir: string, slug: string, locale: string) {
  const localized = path.join(dir, `${slug}.${locale}.mdx`);
  const base = path.join(dir, `${slug}.mdx`);

  if (locale !== 'en' && fs.existsSync(localized)) {
    return localized;
  }

  if (fs.existsSync(base)) {
    return base;
  }

  throw new Error(`Content not found: ${slug}`);
}

function calculateReadingTime(text: string) {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ✅ Updated getSlugs to skip generating "slugs" for work content
export function getSlugs(type: ContentType) {
  if (type === 'work') {
    // No individual work slugs
    return [];
  }

  const dir = getDir(type);

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.mdx'))
    .filter((file) => file.split('.').length === 2)
    .map((file) => file.replace('.mdx', ''));
}

export function getEntry(
  type: ContentType,
  slug: string,
  locale: string,
): ContentEntry {
  const dir = getDir(type);
  const file = resolveFile(dir, slug, locale);

  const source = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(source);

  const normalizedDate =
    data.date instanceof Date ? data.date.toISOString() : data.date;

  return {
    slug,
    type,
    frontmatter: {
      ...data,
      date: normalizedDate,
    },
    content,
    readingTime: calculateReadingTime(content),
  };
}

// ✅ getAllEntries still works for work, returning all entries
export function getAllEntries(type: ContentType, locale: string) {
  const slugs =
    type === 'work'
      ? // For work, get all files in directory
        fs
          .readdirSync(getDir(type))
          .filter((file) => file.endsWith('.mdx'))
          .map((file) => file.replace(/(\.[a-z]{2}(-[A-Z]{2})?)?\.mdx$/, ''))
      : getSlugs(type);

  return slugs.map((slug) => getEntry(type, slug, locale));
}
