export interface Project {
  slug: string;
  title: string;
  description: string;

  repo?: string;
  demo?: string;

  stars?: number;
  stack?: string[];

  readme?: string;
}
