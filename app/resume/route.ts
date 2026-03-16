import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

import { getAllEntries } from '../../lib/content';
import { getDictionary } from '../../i18n/dictionaries';

import { renderResumeData } from '../../lib/resume/renderResumeData';
import { renderResumeHtml } from '../../lib/resume/renderResumeHtml';

import { Locale } from '../../i18n/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('lang')?.value as Locale) ?? 'en';
  const roles = await getAllEntries('work', locale);
  const t = await getDictionary(locale);
  const data = renderResumeData(roles, t);
  const html = renderResumeHtml(data);
  const isVercel = !!process.env.VERCEL;

  const executablePath = isVercel
    ? await chromium.executablePath()
    : 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  const browser = await puppeteer.launch({
    args: isVercel ? chromium.args : [],
    executablePath,
    headless: true,
  });

  const page = await browser.newPage();

  await page.setContent(html, {
    waitUntil: 'networkidle0',
  });

  const pdfBuffer = await page.pdf({
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

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="resume.pdf"',
    },
  });
}
