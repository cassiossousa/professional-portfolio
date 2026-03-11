'use client';

import { useEffect, useState } from 'react';
import { Locale } from '../i18n/config';

export default function LanguageSwitcher() {
  const [current, setCurrent] = useState<Locale>();

  useEffect(() => {
    const lang = document.documentElement.lang as Locale;
    setCurrent(lang);
  }, []);

  function change(lang: string) {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.location.href = url.toString();
    setCurrent(lang as Locale);
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => change('en')}
        className={`px-2 py-1 rounded ${
          current === 'en' ? 'bg-black text-white' : 'opacity-60'
        }`}
      >
        🇺🇸
      </button>
      <button
        onClick={() => change('pt-BR')}
        className={`px-2 py-1 rounded ${
          current === 'pt-BR' ? 'bg-black text-white' : 'opacity-60'
        }`}
      >
        🇧🇷
      </button>
    </div>
  );
}
