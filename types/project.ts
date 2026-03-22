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

  featured?: boolean;

  readme?: string;
}
