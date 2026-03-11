import RSS from 'rss';
import { getAllEntries } from './content';

export function generateRSS(locale: string) {
  const posts = getAllEntries('blog', locale);

  const feed = new RSS({
    title: 'Cássio Sousa Blog',
    description: 'Engineering articles and insights',
    site_url: 'https://yourdomain.com',
    feed_url: 'https://yourdomain.com/rss.xml',
    language: locale,
  });

  posts.forEach((post) => {
    feed.item({
      title: post.frontmatter.title ?? '',
      description: post.frontmatter.description ?? '',
      url: `https://yourdomain.com/blog/${post.slug}`,
      date: post.frontmatter.date ?? '',
    });
  });

  return feed.xml();
}
