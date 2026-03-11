export type ContentType = 'blog' | 'projects' | 'experience';

export type BaseFrontmatter = {
  title?: string;
  description?: string;
  date?: string;
  year?: number;
  tags?: string[];
  company?: string;
  role?: string;
  location?: string;
  start?: string;
  end?: string;
};

export type ContentEntry = {
  slug: string;
  type: ContentType;
  frontmatter: BaseFrontmatter;
  content: string;
};
