import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import chromium from '@sparticuz/chromium';

import { getAllEntries } from '../../lib/content';
import { getDictionary } from '../../i18n/dictionaries';

import { renderResumeData } from '../../lib/resume/renderResumeData';
import { renderResumeHtml } from '../../lib/resume/renderResumeHtml';
import { getCachedPdf, setCachedPdf } from '../../lib/resume/pdfCache';

import { Locale } from '../../i18n/types';
import { mapContentToWorkRoles } from '../../lib/work/workModel';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('lang')?.value as Locale) ?? 'en';

  const t = await getDictionary(locale);
  const entries = await getAllEntries('work', locale);
  const roles = mapContentToWorkRoles(entries, t);

  const data = renderResumeData(roles, t);

  const cachedPdf = getCachedPdf(data, locale);

  if (cachedPdf) {
    return new NextResponse(new Uint8Array(cachedPdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="resume.pdf"',
      },
    });
  }

  const html = renderResumeHtml(data, t);

  let browser;

  try {
    const isVercel = !!process.env.VERCEL;

    const puppeteer = isVercel
      ? await import('puppeteer-core')
      : await import('puppeteer');

    browser = await puppeteer.launch(
      isVercel
        ? {
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: true,
            timeout: 60000,
          }
        : {
            headless: true,
          },
    );

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

    setCachedPdf(data, locale, new Uint8Array(pdfBuffer));

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="resume.pdf"',
      },
    });
  } catch (error) {
    console.error('PDF generation failed:', error);

    return new NextResponse(
      `Failed to generate PDF: ${
        error instanceof Error ? error.message : String(error)
      }`,
      { status: 500 },
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
