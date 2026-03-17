export const locales = ['en', 'pt-BR'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

// Define translation structure
export interface Translation {
  home: {
    name: string;
    title: string;
    subtitle: string;
  };

  workExperience: {
    title: string;
    present: string;
    previewResume: string;
  };

  skills: {
    title: string;
    frontend: string;
    backend: string;
    databases: string;
    distributed: string;
    cloud: string;
    testing: string;
    practices: string;
  };

  resume: {
    summaryTitle: string;
    summary: string;
    experienceTitle: string;

    languagesTitle: string;

    languages: {
      portuguese: string;
      english: string;
    };
  };

  projects: {
    title: string;
    description: string;
  };

  blog: {
    title: string;
    description: string;
  };
}

// Optional: helper for type inference
export function defineMessages(messages: Translation) {
  return messages;
}
