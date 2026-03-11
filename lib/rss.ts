import { getAllEntries } from './content';

export function generateRSS(baseUrl: string) {
  const posts = getAllEntries('blog', 'en');
  const items = posts
    .map((post) => {
      const url = `${baseUrl}/blog/${post.slug}`;
      return `
        <item>
          <title>${post.frontmatter.title}</title>
          <link>${url}</link>
          <guid>${url}</guid>
          <pubDate>${post.frontmatter.date}</pubDate>
        </item>
      `;
    })
    .join('\n');

  return `
    <?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>Cássio Sousa Blog</title>
        <link>${baseUrl}</link>
        <description>Engineering blog</description>
        ${items}
      </channel>
    </rss>
  `;
}
