import { getAllEntries } from '../../lib/content';
import { getDictionary } from '../../i18n/dictionaries';
import { cookies } from 'next/headers';
import { Locale } from '../../types/i18n';

import { WorkClient } from './WorkClient';

import {
  mapContentToWorkRoles,
  sortRolesByStart,
} from '../../lib/work-experience/workModel';

export default async function WorkPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('lang')?.value ?? 'en') as Locale;
  const t = await getDictionary(locale);
  const entries = await getAllEntries('work-experience', locale);
  const roles = sortRolesByStart(mapContentToWorkRoles(entries, t));

  return <WorkClient roles={roles} t={t} />;
}
