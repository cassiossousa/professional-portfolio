export type ContentType = 'blog' | 'projects' | 'work';

export interface BaseFrontmatter {
  title?: string;
  date?: string;
  start?: string;
  end?: string;
  company?: string;
  role?: string;
  location?: string;
}

export interface ContentEntry {
  slug: string;
  type: ContentType;
  frontmatter: BaseFrontmatter;
  content: string;
  readingTime?: number;
}
