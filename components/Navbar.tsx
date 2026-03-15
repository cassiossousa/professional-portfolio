import { cookies } from 'next/headers';

import { getDictionary } from '../i18n/dictionaries';
import { Locale } from '../i18n/types';
import NavbarClient from './NavbarClient';

export default async function Navbar() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('lang')?.value as Locale) ?? 'en';

  const t = await getDictionary(locale);

  return <NavbarClient t={t} />;
}
