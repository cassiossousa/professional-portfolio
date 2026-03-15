import { ContentEntry } from '../../types/content';
import { Translation } from '../../i18n/types';

export interface ResumeRole {
  company: string;
  title: string;
  location?: string;
  period: string;
  bullets: string[];
}

export interface ResumeData {
  summary: string;
  roles: ResumeRole[];
  languages: string[];
}

export function renderResumeData(
  roles: ContentEntry[],
  t: Translation,
): ResumeData {
  const formattedRoles: ResumeRole[] = roles
    .filter((role) => role.frontmatter.company && role.frontmatter.role)
    .map((role) => {
      const { company, role: title, location, start, end } = role.frontmatter;
      const period = end ? `${start} - ${end}` : `${start} - ${t.work.present}`;
      const bullets = role.content
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);

      return {
        company: company!,
        title: title!,
        location,
        period,
        bullets,
      };
    });

  return {
    summary: t.resume.summary,
    roles: formattedRoles,
    languages: [t.resume.languages.portuguese, t.resume.languages.english],
  };
}
