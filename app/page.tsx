'use client';

import { useTranslation } from '../i18n/useTranslation';

export default function HomePage() {
  const { t } = useTranslation('home');

  return (
    <section className="container-main">
      <h1>{t('title')}</h1>

      <p className="text-xl mt-2">{t('subtitle')}</p>

      <p className="mt-4 max-w-xl">{t('description')}</p>
    </section>
  );
}
