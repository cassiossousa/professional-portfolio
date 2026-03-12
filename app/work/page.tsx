import { getAllEntries } from '../../lib/content';
import { ContentEntry } from '../../types/content';
import { getDictionary } from '../../i18n/dictionaries';
import { WorkClient } from './WorkClient';
import { cookies } from 'next/headers';
import { Locale } from '../../i18n/types';

export default async function WorkPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('lang')?.value ?? 'en') as Locale;
  const t = await getDictionary(locale);

  // Only load entries for the current locale
  const allRoles: ContentEntry[] = await getAllEntries('work', locale);

  // Sort by start date descending
  const sortedRoles = allRoles.sort((a, b) => {
    const aStart = new Date(a.frontmatter.start ?? '');
    const bStart = new Date(b.frontmatter.start ?? '');
    return bStart.getTime() - aStart.getTime();
  });

  return <WorkClient roles={sortedRoles} t={t} />;
}
