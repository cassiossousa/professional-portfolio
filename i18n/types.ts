export const locales = ['en', 'pt-BR'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

// Define translation structure
export interface Translation {
  home: {
    name: string;
    title: string;
    subtitle: string;
    username: string;
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
}

export function defineMessages(messages: Translation) {
  return messages;
}

export function yearsSince(givenYear: number): number {
  const currentYear = new Date().getFullYear();
  return currentYear - givenYear;
}
