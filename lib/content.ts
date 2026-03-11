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

export function getSlugs(type: ContentType) {
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
  return getSlugs(type).map((slug) => getEntry(type, slug, locale));
}
