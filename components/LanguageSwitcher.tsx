'use client';

export default function LanguageSwitcher() {
  function change(lang: string) {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.location.href = url.toString();
  }

  return (
    <div className="flex gap-2">
      <button onClick={() => change('en')}>EN</button>
      <button onClick={() => change('pt-BR')}>PT-BR</button>
    </div>
  );
}
