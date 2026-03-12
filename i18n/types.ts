export const locales = ['en', 'pt-BR'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

// Define translation structure
export type Translation = {
  nav: {
    work: string;
    projects: string;
    blog: string;
  };
  home: {
    title: string;
    subtitle: string;
    description: string;
  };
  work: {
    title: string;
    present: string;
  };
  projects: {
    title: string;
  };
  blog: {
    title: string;
  };
};

// Optional: helper for type inference
export function defineMessages(messages: Translation) {
  return messages;
}
