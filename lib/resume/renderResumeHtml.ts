import { ResumeData } from './renderResumeData';

export function renderResumeHtml(data: ResumeData) {
  const rolesHtml = data.roles
    .map(
      (r) => `
      <div class="role">
        <h3>${r.company}</h3>
        <div class="title">${r.title}</div>
        <div class="meta">
          ${r.location ? `${r.location} | ` : ''}${r.period}
        </div>

        <ul>
          ${r.bullets.map((b) => `<li>${b}</li>`).join('')}
        </ul>
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

.role {
  margin-bottom: 14px;
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
  margin: 6px 0 0 18px;
}

</style>

</head>

<body>

<h1>Cássio dos Santos Sousa</h1>
<div>Senior Software Engineer</div>

<h2>Professional Summary</h2>
<p>${data.summary}</p>

<h2>Professional Experience</h2>

${rolesHtml}

<h2>Languages</h2>
<ul>
${data.languages.map((l) => `<li>${l}</li>`).join('')}
</ul>

</body>
</html>
`;
}
