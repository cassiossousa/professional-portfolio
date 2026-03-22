export interface Project {
  slug: string;

  title: string;

  description?: string;

  repo?: string;
  demo?: string;

  stars?: number;

  technologies?: string[];

  summary?: string[];
  highlights?: string[];

  architecture?: string[];
  features?: string[];
  quality?: string[];

  featured?: boolean;
}
