import { getSlugs } from '../lib/content';

export default function sitemap() {
  const base = 'https://cassiossousa.github.io';

  const blog = getSlugs('blog').map((slug) => ({
    url: `${base}/blog/${slug}`,
  }));

  const projects = getSlugs('projects').map((slug) => ({
    url: `${base}/projects/${slug}`,
  }));

  const experience = getSlugs('experience').map((slug) => ({
    url: `${base}/experience/${slug}`,
  }));

  return [
    { url: base },
    { url: `${base}/blog` },
    { url: `${base}/projects` },
    { url: `${base}/experience` },
    ...blog,
    ...projects,
    ...experience,
  ];
}
