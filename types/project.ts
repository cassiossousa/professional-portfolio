export type Project = {
  slug: string;
  title: string;
  description: string;
  year: number;
  tags: string[];
  repo?: string;
  demo?: string;
};
