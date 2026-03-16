import { ContentEntry } from '../../types/content';
import { Translation } from '../../i18n/types';

export interface WorkRole {
  company: string;
  title: string;
  location?: string;
  start?: string;
  end?: string;
  period: string;
  bullets: string[];
}

function parseBullets(content: string): string[] {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function buildPeriod(start?: string, end?: string, t?: Translation): string {
  if (!start) return '';
  if (!end) return `${start} - ${t?.work.present ?? 'Present'}`;
  return `${start} - ${end}`;
}

export function mapContentToWorkRoles(
  entries: ContentEntry[],
  t: Translation,
): WorkRole[] {
  return entries.map((entry) => {
    const { company, role, location, start, end } = entry.frontmatter;

    return {
      company: company ?? '',
      title: role ?? '',
      location,
      start,
      end,
      period: buildPeriod(start, end, t),
      bullets: parseBullets(entry.content),
    };
  });
}

export function sortRolesByStart(roles: WorkRole[]): WorkRole[] {
  return roles.sort((a, b) => {
    const aDate = new Date(a.start ?? '');
    const bDate = new Date(b.start ?? '');
    return bDate.getTime() - aDate.getTime();
  });
}
