import { getSlugs } from '../lib/content';

export default function sitemap() {
  const base = 'https://professional-portfolio-mu-gray.vercel.app';

  const blog = getSlugs('blog').map((slug) => ({
    url: `${base}/blog/${slug}`,
  }));

  const projects = getSlugs('projects').map((slug) => ({
    url: `${base}/projects/${slug}`,
  }));

  const work = getSlugs('work').map((slug) => ({
    url: `${base}/work/${slug}`,
  }));

  return [
    { url: base },
    { url: `${base}/blog` },
    { url: `${base}/projects` },
    { url: `${base}/work` },
    ...blog,
    ...projects,
    ...work,
  ];
}
