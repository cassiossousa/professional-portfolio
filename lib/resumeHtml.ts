import { Translation } from '../i18n/types';
import { ContentEntry } from '../types/content';

import { resumeProfile, resumeSkills } from './resumeModel';

export function renderResumeHtml(roles: ContentEntry[], t: Translation) {
  // Sort roles newest first
  const sortedRoles = [...roles].sort((a, b) => {
    const aStart = new Date(a.frontmatter.start ?? '');
    const bStart = new Date(b.frontmatter.start ?? '');
    return bStart.getTime() - aStart.getTime();
  });

  const experience = sortedRoles
    .map((role) => {
      const { company, role: title, location, start, end } = role.frontmatter;

      const period = end ? `${start} – ${end}` : `${start} – ${t.work.present}`;

      const bullets = role.content
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .map((b) => `<li>${b}</li>`)
        .join('');

      return `
        <section class="role">
          <h3>${title}</h3>
          <div class="company">${company}</div>
          <div class="meta">
            ${location ? location + ' | ' : ''}${period}
          </div>

          <ul>
            ${bullets}
          </ul>
        </section>
      `;
    })
    .join('');

  const skillSections = Object.entries(resumeSkills)
    .map(
      ([key, values]) => `
      <div class="skill-group">
        <strong>${t.skills[key as keyof typeof resumeSkills]}</strong>:
        ${values.join(', ')}
      </div>
    `,
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>

<meta charset="utf-8"/>

<title>${resumeProfile.name} – Resume</title>

<style>

body{
font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
padding:48px;
max-width:850px;
margin:auto;
line-height:1.55;
color:#111;
}

header{
margin-bottom:34px;
}

h1{
font-size:32px;
margin-bottom:6px;
}

.subtitle{
font-size:16px;
color:#444;
margin-bottom:10px;
}

.contact{
font-size:14px;
color:#555;
}

.section-title{
font-size:20px;
margin-top:34px;
margin-bottom:12px;
border-bottom:1px solid #ddd;
padding-bottom:4px;
}

.role{
margin-bottom:20px;
}

.role h3{
font-size:16px;
margin-bottom:2px;
}

.company{
font-weight:600;
}

.meta{
font-size:13px;
color:#666;
margin-bottom:6px;
}

ul{
padding-left:20px;
margin-top:4px;
}

li{
margin-bottom:4px;
}

.skill-group{
margin-bottom:6px;
font-size:14px;
}

a{
color:#0a66c2;
text-decoration:none;
}

</style>

</head>

<body>

<header>

<h1>${resumeProfile.name}</h1>

<div class="subtitle">
${resumeProfile.title}
</div>

<div class="contact">
LinkedIn: <a href="${resumeProfile.linkedinUrl}" target="_blank">${resumeProfile.linkedin}</a>
</div>

</header>


<h2 class="section-title">
${t.resume.summaryTitle}
</h2>

<p>
${t.resume.summary}
</p>


<h2 class="section-title">
${t.resume.experienceTitle}
</h2>

${experience}


<h2 class="section-title">
${t.skills.title}
</h2>

${skillSections}


<h2 class="section-title">
${t.resume.languagesTitle}
</h2>

<ul>
<li>${t.resume.languages.portuguese}</li>
<li>${t.resume.languages.english}</li>
</ul>


</body>
</html>
`;
}
