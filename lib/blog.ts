import fs from 'fs';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'content/blog');

type PostMeta = {
  title: string;
  date: string;
  description: string;
  slug: string;
};

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(postsDirectory);

  return files.map((file) => {
    const slug = file.replace('.md', '');

    const fullPath = path.join(postsDirectory, file);

    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const match = fileContents.match(/---([\s\S]*?)---/);

    const meta = match?.[1] ?? '';

    const title = meta.match(/title:\s*(.*)/)?.[1] ?? '';
    const date = meta.match(/date:\s*(.*)/)?.[1] ?? '';
    const description = meta.match(/description:\s*(.*)/)?.[1] ?? '';

    return {
      slug,
      title,
      date,
      description,
    };
  });
}

export function getPostBySlug(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);

  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const match = fileContents.match(/---([\s\S]*?)---/);

  const meta = match?.[1] ?? '';

  const content = fileContents.replace(/---([\s\S]*?)---/, '');

  const title = meta.match(/title:\s*(.*)/)?.[1] ?? '';
  const date = meta.match(/date:\s*(.*)/)?.[1] ?? '';
  const description = meta.match(/description:\s*(.*)/)?.[1] ?? '';

  return {
    slug,
    title,
    date,
    description,
    content,
  };
}
