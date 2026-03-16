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
  if (type === 'work-experience') {
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

export function getAllEntries(type: ContentType, locale: string) {
  const dir = getDir(type);

  const files = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.mdx'))
    // Keep only files for the current locale or base files
    .filter((file) => {
      if (type !== 'work-experience') return true;

      const isLocaleFile = file.endsWith(`.${locale}.mdx`);
      const isBaseFile = !file.match(/\.[a-z]{2}(-[A-Z]{2})?\.mdx$/);

      return isLocaleFile || isBaseFile;
    });

  // Map to unique slugs
  const slugs = Array.from(
    new Set(
      files.map((file) => file.replace(/(\.[a-z]{2}(-[A-Z]{2})?)?\.mdx$/, '')),
    ),
  );

  return slugs.map((slug) => getEntry(type, slug, locale));
}
