import Link from 'next/link';
import { cookies } from 'next/headers';
import { getAllEntries } from '../../lib/content';
import { getDictionary } from '../../i18n/dictionaries';
import { Locale, Translation } from '../../i18n/types';

export default async function BlogPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('lang')?.value ?? 'en') as Locale;

  const t: Translation = await getDictionary(locale);
  const posts = await getAllEntries('blog', locale);

  return (
    <section className="container-main">
      <h1 className="text-3xl font-bold mb-8">{t.blog.title}</h1>

      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="text-xl font-semibold hover:underline"
            >
              {post.frontmatter.title}
            </Link>

            {post.frontmatter.date && (
              <p className="opacity-70 mt-1">{post.frontmatter.date}</p>
            )}

            <p className="mt-2">{post.content}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
