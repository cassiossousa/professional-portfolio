import { ResumeData } from './renderResumeData';
import { Translation } from '../../i18n/types';
import { skills } from '../skills';
import { Project } from '../../types/project';

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

function renderProjects(
  projects?: {
    title: string;
    technologies?: string[];
    summary?: string[];
    repo?: string;
  }[],
) {
  if (!projects?.length) return '';

  return `
    <h2>Projects</h2>

    ${projects
      .map(
        (p) => `
      <div class="role">

        <div class="role-header">
          <div class="title">
            ${escapeHtml(p.title)}
            ${
              p.technologies
                ? `<span class="tech">(${escapeHtml(
                    p.technologies.join(', '),
                  )})</span>`
                : ''
            }
          </div>
        </div>

        ${
          p.summary
            ? `
        <ul>
          ${p.summary
            .slice(0, 2)
            .map((s) => `<li>${escapeHtml(s)}</li>`)
            .join('')}
        </ul>
        `
            : ''
        }

      </div>
    `,
      )
      .join('')}
  `;
}

export function renderResumeHtml(
  data: ResumeData,
  projects: Project[],
  t: Translation,
) {
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

  const contacts = [
    `<a href="https://github.com/${escapeHtml(t.home.username)}">github.com/${escapeHtml(
      t.home.username,
    )}</a>`,
    `<a href="https://linkedin.com/in/${escapeHtml(
      t.home.username,
    )}">linkedin.com/in/${escapeHtml(t.home.username)}</a>`,
  ]
    .filter(Boolean)
    .join('<span class="separator">•</span>');

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>${escapeHtml(`${t.home.name} - CV`)}</title>
    <style>
      body{
        font-family: system-ui;
        margin: 30px 20px;font-size:13px;line-height:1.5}
      
      .resume-header {
        text-align: center;
        margin-bottom: 18px;
      }
      
      h1{
        font-size:28px;
        margin-bottom:4px;
      }
      
      .headline{
        font-size:14px;
        font-weight:500;
        margin-bottom:6px;
      }
      
      .contact{
        font-size:12px;
      }
      
      .separator{
        margin:0 6px;
        color:#888;
      }
      
      h2{
        margin-top:24px;
        font-size:18px;
      }
      
      .role{
        margin-bottom:14px;
      }
      
      .title{
        font-weight:600;
      }
      
      .meta{
        font-size:12px;
        color:#555;
      }
      
      ul{
        margin:6px 0 0 0;
        padding-left:24px;
      }
      
      li{
        font-size:12px;
      }
      
      .tech{
        font-weight:400;
        color:#555;
        font-size:11px;
        margin-left:4px;
      }
    </style>
  </head>

  <body>
    <header class="resume-header">
      <h1>${escapeHtml(t.home.name)}</h1>

      <div class="headline">
        ${escapeHtml(t.home.title)} • ${escapeHtml(t.home.subtitle)}
      </div>

      <div class="contact">
        ${contacts}
      </div>
    </header>

    <h2>${escapeHtml(t.resume.summaryTitle)}</h2>
    <p>${escapeHtml(t.resume.summary)}</p>

    <h2>${escapeHtml(t.resume.experienceTitle)}</h2>
    ${rolesHtml}

    ${renderProjects(projects)}
    <h2>${escapeHtml(t.skills.title)}</h2>
    <ul>${skillsHtml}</ul>
  </body>
</html>
`;
}
