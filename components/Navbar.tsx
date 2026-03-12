'use client';

import Link from 'next/link';

import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '../i18n/useTranslation';

export default function Navbar() {
  const { t } = useTranslation('nav');

  return (
    <nav className="container-main flex justify-between py-6">
      <div className="flex gap-6">
        <Link href="/">Home</Link>
        <Link href="/work">{t('work')}</Link>
        <Link href="/projects">{t('projects')}</Link>
        <Link href="/blog">{t('blog')}</Link>
      </div>

      <LanguageSwitcher />
    </nav>
  );
}
