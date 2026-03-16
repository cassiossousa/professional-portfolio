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

export interface WorkRoleValidationError {
  field: string;
  message: string;
}

function parseBullets(content: string): string[] {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function validateDate(dateString?: string): Date | null {
  if (!dateString) return null;

  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

function buildPeriod(start?: string, end?: string, t?: Translation): string {
  if (!start) return '';

  const startDate = validateDate(start);
  const endDate = validateDate(end);

  if (!startDate) return start; // Return as-is if invalid

  const startStr = startDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });

  if (!end) return `${startStr} - ${t?.workExperience.present ?? 'Present'}`;

  if (!endDate) return `${startStr} - ${end}`; // Return end as-is if invalid

  const endStr = endDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });

  return `${startStr} - ${endStr}`;
}

export function validateWorkRole(
  entry: ContentEntry,
): WorkRoleValidationError[] {
  const errors: WorkRoleValidationError[] = [];
  const { company, role, start, end } = entry.frontmatter;

  if (!company || company.trim() === '') {
    errors.push({ field: 'company', message: 'Company is required' });
  }

  if (!role || role.trim() === '') {
    errors.push({ field: 'role', message: 'Role title is required' });
  }

  if (start && !validateDate(start)) {
    errors.push({ field: 'start', message: 'Invalid start date format' });
  }

  if (end && !validateDate(end)) {
    errors.push({ field: 'end', message: 'Invalid end date format' });
  }

  if (start && end) {
    const startDate = validateDate(start);
    const endDate = validateDate(end);
    if (startDate && endDate && startDate > endDate) {
      errors.push({
        field: 'end',
        message: 'End date must be after start date',
      });
    }
  }

  return errors;
}

export function mapContentToWorkRoles(
  entries: ContentEntry[],
  t: Translation,
): WorkRole[] {
  const validRoles: WorkRole[] = [];

  for (const entry of entries) {
    const { company, role, location, start, end } = entry.frontmatter;

    // Validate before processing
    const errors = validateWorkRole(entry);
    if (errors.length > 0) {
      console.warn(`Invalid work entry for ${company || 'unknown'}:`, errors);
      continue;
    }

    validRoles.push({
      company: company ?? '',
      title: role ?? '',
      location,
      start,
      end,
      period: buildPeriod(start, end, t),
      bullets: parseBullets(entry.content),
    });
  }

  return validRoles;
}

export function sortRolesByStart(roles: WorkRole[]): WorkRole[] {
  return roles.sort((a, b) => {
    const aDate = validateDate(a.start);
    const bDate = validateDate(b.start);

    if (!aDate && !bDate) return 0;
    if (!aDate) return 1;
    if (!bDate) return -1;

    return bDate.getTime() - aDate.getTime();
  });
}
