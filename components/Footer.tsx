import { cookies } from 'next/headers';
import Link from 'next/link';
import { Locale } from '../types/i18n';
import { getDictionary } from '../i18n/dictionaries';

export default async function Footer() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('lang')?.value as Locale) ?? 'en';
  const t = await getDictionary(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <p className="font-semibold">{t.home.name}</p>
          <p className="text-sm text-gray-500 mt-1">{t.home.title}</p>
        </div>

        <nav aria-label="Footer navigation">
          <ul className="flex gap-6 text-sm">
            <li>
              <a
                href={`https://github.com/${t.home.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                GitHub
              </a>
            </li>

            <li>
              <a
                href={`https://linkedin.com/in/${t.home.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </nav>

        <p className="text-sm text-gray-500">
          © {year} {t.home.name}
        </p>
      </div>
    </footer>
  );
}
