'use client';

import { useState, useEffect } from 'react';

export default function LanguageSwitcher() {
  const [current, setCurrent] = useState<string>('en');

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const match = document.cookie.match(/lang=([^;]+)/);
      if (match) setCurrent(match[1]);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  function change(lang: string) {
    document.cookie = `lang=${lang}; path=/; max-age=${60 * 60 * 24 * 365}`;
    window.location.reload(); // Reload to fetch server-side content
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => change('en')}
        className={`px-2 py-1 rounded ${
          current === 'en' ? 'bg-blue-500 text-white' : 'opacity-60'
        }`}
      >
        🇺🇸
      </button>
      <button
        onClick={() => change('pt-BR')}
        className={`px-2 py-1 rounded ${
          current === 'pt-BR' ? 'bg-blue-500 text-white' : 'opacity-60'
        }`}
      >
        🇧🇷
      </button>
    </div>
  );
}
