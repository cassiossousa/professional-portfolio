import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import { ContentEntry, ContentType } from '../types/content';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

function resolveFile(type: ContentType, slug: string, locale: string) {
  const dir = path.join(CONTENT_ROOT, type);

  const localized = path.join(dir, `${slug}.${locale}.mdx`);

  const fallback = path.join(dir, `${slug}.en.mdx`);

  if (fs.existsSync(localized)) return localized;

  return fallback;
}

export function getSlugs(type: ContentType) {
  const dir = path.join(CONTENT_ROOT, type);

  const files = fs.readdirSync(dir);

  return [...new Set(files.map((file) => file.split('.')[0]))];
}

export function getEntry(
  type: ContentType,
  slug: string,
  locale: string,
): ContentEntry {
  const filePath = resolveFile(type, slug, locale);

  const source = fs.readFileSync(filePath, 'utf8');

  const { content, data } = matter(source);

  return {
    slug,
    type,
    frontmatter: data,
    content,
  };
}

export function getAllEntries(
  type: ContentType,
  locale: string,
): ContentEntry[] {
  const slugs = getSlugs(type);

  return slugs.map((slug) => getEntry(type, slug, locale));
}
