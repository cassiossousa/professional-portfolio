import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import puppeteer from 'puppeteer';

import { getAllEntries } from '../../lib/content';
import { getDictionary } from '../../i18n/dictionaries';
import { renderResumeHtml } from '../../lib/resumeHtml';

import { Locale } from '../../i18n/types';

export const runtime = 'nodejs';

export async function GET() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('lang')?.value as Locale) ?? 'en';

  const roles = await getAllEntries('work', locale);
  const t = await getDictionary(locale);

  const html = renderResumeHtml(roles, t);

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  await page.setContent(html, {
    waitUntil: 'domcontentloaded',
  });

  // ensure layout finished
  await page.evaluate(() => document.fonts?.ready);

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '40px',
      bottom: '40px',
      left: '40px',
      right: '40px',
    },
  });

  await browser.close();

  // Convert Buffer → Uint8Array (valid BodyInit)
  const buffer = new Uint8Array(pdf);

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="resume.pdf"',
    },
  });
}
