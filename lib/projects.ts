import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Project } from '../types/project';

const PROJECT_DIR = path.join(process.cwd(), 'content/projects');

export function getAllProjects(): Project[] {
  const files = fs.readdirSync(PROJECT_DIR);

  return files.map((file) => {
    const slug = file.replace('.mdx', '');

    const source = fs.readFileSync(path.join(PROJECT_DIR, file), 'utf8');

    const { data } = matter(source);

    return {
      slug,
      ...data,
    } as Project;
  });
}

export function getProject(slug: string) {
  const filePath = path.join(PROJECT_DIR, `${slug}.mdx`);
  const source = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(source);

  return {
    content,
    frontmatter: data as Project,
  };
}
