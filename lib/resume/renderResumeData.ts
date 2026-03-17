import { Translation } from '../../i18n/types';
import { profile } from '../profile';
import { WorkRole } from '../work-experience/workModel';

export interface ResumeData {
  name: string;
  title: string;
  summary: string;
  roles: WorkRole[];
  languages: string[];
}

export function renderResumeData(
  roles: WorkRole[],
  t: Translation,
): ResumeData {
  return {
    name: t.home.name,
    title: t.home.title + ' | ' + t.home.subtitle,
    summary: t.resume.summary,
    roles,
    languages: [t.resume.languages.portuguese, t.resume.languages.english],
  };
}
