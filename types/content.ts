export type ContentType = 'work-experience' | 'projects';

export interface BaseFrontmatter {
  title?: string;
  date?: string;
  start?: string;
  end?: string;
  company?: string;
  role?: string;
  location?: string;
}

export interface ProjectFrontmatter extends BaseFrontmatter {
  repo?: string;
  demo?: string;
  stars?: number;

  featured?: boolean;

  technologies?: string[];
  summary?: string[];
  highlights?: string[];

  topics?: string[];
}

export interface ContentEntry<T extends BaseFrontmatter = BaseFrontmatter> {
  slug: string;
  type: ContentType;
  frontmatter: T;
  content: string;
  readingTime?: number;
}

export type ProjectEntry = ContentEntry<ProjectFrontmatter>;
