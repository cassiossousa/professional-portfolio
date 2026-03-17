import { ResumeData } from './renderResumeData';
import { Translation } from '../../i18n/types';

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
      (r) => `
      <div class="role">

        <div class="role-header">
          <h3 class="company">${escapeHtml(r.company)}</h3>

          <div class="title">${escapeHtml(r.title)}</div>

          <div class="meta">
            ${r.location ? `${escapeHtml(r.location)} | ` : ''}${escapeHtml(r.period)}
          </div>
        </div>

        <div class="role-bullets">
          <ul>
            ${r.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
          </ul>
        </div>

      </div>
    `,
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>

<meta charset="utf-8" />

<style>

body {
  font-family: system-ui, -apple-system, sans-serif;
  margin: 40px;
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
}

/* --- ROLE BLOCK --- */

.role {
  margin-bottom: 14px;
}

/* keep company/title/meta together */

.role-header {
  break-inside: avoid;
  page-break-inside: avoid;
}

/* keep bullet list together */

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

/* avoid bullet splitting */

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
<p>${escapeHtml(data.summary)}</p>

<h2>${escapeHtml(t.resume.experienceTitle)}</h2>

${rolesHtml}

<h2>${escapeHtml(t.resume.languagesTitle)}</h2>

<ul>
${data.languages.map((l) => `<li>${escapeHtml(l)}</li>`).join('')}
</ul>

</body>
</html>
`;
}
