import { Locale } from './config';

export async function getDictionary(locale: Locale) {
  if (locale === 'pt-BR') {
    return (await import('./locales/pt-BR.json')).default;
  }

  return (await import('./locales/en.json')).default;
}
