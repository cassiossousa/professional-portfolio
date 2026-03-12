import { getAllEntries } from '../../lib/content';
import { ContentEntry } from '../../types/content';
import { getDictionary } from '../../i18n/dictionaries';
import { cookies } from 'next/headers';
import { WorkClient } from './WorkClient';
import { Locale } from '../../i18n/types';

export default async function WorkPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('lang')?.value ?? 'en') as Locale;

  const roles: ContentEntry[] = await getAllEntries('work', locale);
  const t = await getDictionary(locale);

  const sortedRoles = roles.sort((a, b) => {
    const aStart = new Date(a.frontmatter.start ?? '');
    const bStart = new Date(b.frontmatter.start ?? '');
    return bStart.getTime() - aStart.getTime();
  });

  return <WorkClient roles={sortedRoles} t={t} />;
}
