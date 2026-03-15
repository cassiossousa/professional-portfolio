import { cookies } from 'next/headers';

import { getAllEntries } from '../../lib/content';
import { getDictionary } from '../../i18n/dictionaries';
import { renderResumeData } from '../../lib/resume/renderResumeData';

import { Locale } from '../../i18n/types';

export default async function ResumeHtml() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('lang')?.value as Locale) ?? 'en';

  const roles = await getAllEntries('work', locale);
  const t = await getDictionary(locale);

  const data = renderResumeData(roles, t);

  return (
    <main className="container-main max-w-3xl">
      <h1 className="text-4xl font-bold">Cássio dos Santos Sousa</h1>

      <h2 className="text-xl mb-6">Senior Software Engineer</h2>

      <h3 className="text-2xl mt-6 mb-2">{t.resume.summaryTitle}</h3>

      <p>{data.summary}</p>

      <h3 className="text-2xl mt-6 mb-2">{t.resume.experienceTitle}</h3>

      {data.roles.map((role, i) => (
        <div key={i} className="mb-6">
          <h4 className="font-semibold">{role.company}</h4>
          <p className="text-primary">{role.title}</p>
          <p className="text-sm opacity-80">
            {role.location && `${role.location} | `}
            {role.period}
          </p>

          <ul className="list-disc ml-5 mt-2">
            {role.bullets.map((b, j) => (
              <li key={j}>{b}</li>
            ))}
          </ul>
        </div>
      ))}

      <h3 className="text-2xl mt-6 mb-2">{t.resume.languagesTitle}</h3>

      <ul className="list-disc ml-5">
        {data.languages.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </main>
  );
}
