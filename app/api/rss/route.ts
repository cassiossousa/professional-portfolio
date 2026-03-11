import RSS from 'rss';
import { getPosts } from '../../../lib/blog';

export async function GET() {
  const posts = getPosts();

  const feed = new RSS({
    title: 'Cassio Sousa Engineering Blog',
    site_url: 'https://cassiosousa.dev',
    feed_url: 'https://cassiosousa.dev/rss.xml',
  });

  posts.forEach((p) => {
    feed.item({
      title: p.title,
      url: `/blog/${p.slug}`,
      date: p.date,
    });
  });

  return new Response(feed.xml(), {
    headers: { 'Content-Type': 'application/xml' },
  });
}
