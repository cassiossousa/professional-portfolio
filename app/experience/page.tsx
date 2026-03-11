import Link from 'next/link';
import { cookies } from 'next/headers';

import { getAllEntries } from '../../lib/content';
import { ContentEntry } from '../../types/content';

import { getDictionary } from '../../i18n/dictionaries';
import { Locale } from '../../i18n/config';

export default async function ExperiencePage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('lang')?.value ?? 'en') as Locale;
  const t = await getDictionary(locale);
  const roles: ContentEntry[] = await getAllEntries('experience', locale);

  const sortedRoles = roles.sort((a, b) => {
    const aStart = new Date(a.frontmatter.start ?? '');
    const bStart = new Date(b.frontmatter.start ?? '');
    return bStart.getTime() - aStart.getTime();
  });

  return (
    <section className="container-main">
      <h1 className="text-3xl font-bold mb-10">{t.nav.experience}</h1>

      <div className="space-y-10">
        {sortedRoles.map((role) => {
          const {
            company,
            role: title,
            location,
            start,
            end,
          } = role.frontmatter;

          const period = end
            ? `${start} - ${end}`
            : `${start} - ${t.experience.present}`;

          return (
            <article key={role.slug} className="border-b pb-6">
              <h2 className="text-xl font-semibold">
                <Link
                  href={`/experience/${role.slug}`}
                  className="hover:underline"
                >
                  {title}
                </Link>
              </h2>

              <p className="text-sm opacity-80 mt-1">
                {company}
                {location && ` | ${location}`}
              </p>

              <p className="text-sm opacity-60 mt-1">{period}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
