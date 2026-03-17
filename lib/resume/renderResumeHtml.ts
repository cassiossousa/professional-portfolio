import { ResumeData } from './renderResumeData';
import { Translation } from '../../i18n/types';
import { skills } from '../skills';

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export function renderResumeHtml(data: ResumeData, t: Translation) {
  const rolesHtml = data.roles
    .map(
      (role) => `
      <div class="role">
        <div class="role-header">
          <h3 class="company">${escapeHtml(role.company)}</h3>
          <div class="title">${escapeHtml(role.title)}</div>
          <div class="meta">
            ${role.location ? `${escapeHtml(role.location)} | ` : ''}${escapeHtml(role.period)}
          </div>
        </div>

        <div class="role-bullets">
          <ul>
            ${role.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}
          </ul>
        </div>
      </div>
    `,
    )
    .join('');

  const skillsHtml = Object.keys(skills)
    .map(
      (key) => `
        <li>
          <strong>${escapeHtml(t.skills[key as keyof Translation['skills']])}:</strong>
          ${escapeHtml(skills[key as keyof typeof skills].join(', '))}
        </li>
      `,
    )
    .join('');

  const pageTitle = `${t.home.name} - CV`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />

      <title>${escapeHtml(pageTitle)}</title>

      <meta name="description" content="${escapeHtml(
        `${t.home.name} - ${t.home.title}`,
      )}" />

      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          margin: 30px 20px;
          font-size: 13px;
          line-height: 1.5;
        }

        h1 {
          font-size: 28px;
          margin-bottom: 4px;
        }

        h2 {
          margin-top: 24px;
          font-size: 18px;
          page-break-after: avoid;
        }

        .summary {
          text-align: justify;
        }

        /* --- ROLE BLOCK --- */

        .role {
          margin-bottom: 14px;
          break-inside: avoid;
        }

        .role-header {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .role-bullets {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .company {
          margin-bottom: 0;
        }

        .title {
          font-weight: 600;
        }

        .meta {
          font-size: 12px;
          color: #555;
          margin-bottom: 4px;
        }

        ul {
          margin: 6px 0 0 0;
          padding: 0 0 0 24px;
        }

        li {
          font-size: 12px;
          text-align: justify;
          break-inside: avoid;
          page-break-inside: avoid;
        }
      </style>
    </head>

    <body>
      <h1>${escapeHtml(t.home.name)}</h1>
      <div>${escapeHtml(t.home.title)} | ${escapeHtml(t.home.subtitle)}</div>

      <h2>${escapeHtml(t.resume.summaryTitle)}</h2>
      <p class="summary">${escapeHtml(t.resume.summary)}</p>

      <h2>${escapeHtml(t.resume.experienceTitle)}</h2>
      ${rolesHtml}

      <h2>${escapeHtml(t.skills.title)}</h2>
      <ul>
      ${skillsHtml}
      </ul>

      <h2>${escapeHtml(t.resume.languagesTitle)}</h2>
      <ul>
      ${Object.values(t.resume.languages)
        .map((l) => `<li>${escapeHtml(l)}</li>`)
        .join('')}
      </ul>
    </body>
  </html>
  `;
}
