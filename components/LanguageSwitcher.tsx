'use client';

export default function LanguageSwitcher() {
  function change(lang: string) {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.location.href = url.toString();
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => change('en')}
        className="px-2 py-1 rounded opacity-60"
      >
        🇺🇸
      </button>
      <button
        onClick={() => change('pt-BR')}
        className="px-2 py-1 rounded opacity-60"
      >
        🇧🇷
      </button>
    </div>
  );
}
