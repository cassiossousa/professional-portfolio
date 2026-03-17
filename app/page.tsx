import { getDictionary } from '../i18n/dictionaries';
import { cookies } from 'next/headers';
import { Locale } from '../i18n/types';

export default async function HomePage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('lang')?.value as Locale) ?? 'en';
  const t = await getDictionary(locale);

  return (
    <section className="container-main">
      <h1>{t.home.name}</h1>
      <h2 className="text-xl">{t.home.title}</h2>
      <p className="text-lg mt-2">{t.home.subtitle}</p>
      <p className="mt-4 text-justify">{t.resume.summary}</p>
    </section>
  );
}
