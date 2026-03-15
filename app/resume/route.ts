import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import React, { ReactElement } from 'react';
import { renderToBuffer } from '@react-pdf/renderer';

import { getAllEntries } from '../../lib/content';
import { getDictionary } from '../../i18n/dictionaries';
import { renderResumeData } from '../../lib/resume/renderResumeData';
import { ResumeDocument } from '../../lib/resume/ResumeDocument';

import { Locale } from '../../i18n/types';

export const runtime = 'nodejs';

export async function GET() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('lang')?.value as Locale) ?? 'en';
  const roles = await getAllEntries('work', locale);
  const t = await getDictionary(locale);
  const data = renderResumeData(roles, t);
  const element: ReactElement = React.createElement(ResumeDocument, { data });
  const buffer = await renderToBuffer(element);
  const body = new Uint8Array(buffer);

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="resume.pdf"',
    },
  });
}
