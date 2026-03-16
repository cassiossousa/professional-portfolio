import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { getAllEntries } from '../../lib/content';
import { getDictionary } from '../../i18n/dictionaries';

import { renderResumeData } from '../../lib/resume/renderResumeData';
import { getCachedPdf, setCachedPdf } from '../../lib/resume/pdfCache';
import { getBrowserConfig } from '../../lib/resume/browserConfig';

import { Locale } from '../../i18n/types';
import { mapContentToWorkRoles } from '../../lib/work/workModel';
import { renderResumeHtml } from '../../lib/resume/renderResumeHtml';

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
    const browserConfig = await getBrowserConfig();

    const puppeteer = process.env.VERCEL
      ? await import('puppeteer-core')
      : await import('puppeteer');

    browser = await puppeteer.launch({
      ...browserConfig,
      timeout: 60000,
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
