export type ContentType = 'work-experience' | 'projects';

/* -------------------------------- */
/* Base frontmatter (shared fields) */
/* -------------------------------- */

export interface BaseFrontmatter {
  title?: string;
  date?: string;

  start?: string;
  end?: string;

  company?: string;
  role?: string;
  location?: string;
}

/* -------------------------------- */
/* Project frontmatter              */
/* -------------------------------- */

export interface ProjectFrontmatter extends BaseFrontmatter {
  repo?: string;
  demo?: string;

  stars?: number;

  featured?: boolean;
  category?: 'frontend' | 'backend' | 'fullstack' | 'tool' | 'other';

  technologies?: string[];
  summary?: string[];
  highlights?: string[];
}

/* -------------------------------- */
/* Generic content entry            */
/* -------------------------------- */

export interface ContentEntry<T extends BaseFrontmatter = BaseFrontmatter> {
  slug: string;
  type: ContentType;

  frontmatter: T;

  content: string;

  readingTime?: number;
}

/* -------------------------------- */
/* Specialized entries              */
/* -------------------------------- */

export type ProjectEntry = ContentEntry<ProjectFrontmatter>;
