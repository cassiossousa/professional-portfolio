import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import puppeteer from 'puppeteer-core';

import { getAllEntries } from '../../lib/content';
import { getDictionary } from '../../i18n/dictionaries';

import { renderResumeData } from '../../lib/resume/renderResumeData';
import { renderResumeHtml } from '../../lib/resume/renderResumeHtml';
import { getCachedPdf, setCachedPdf } from '../../lib/resume/pdfCache';
import { getBrowserConfig } from '../../lib/resume/browserConfig';

import { Locale } from '../../i18n/types';

import { mapContentToWorkRoles } from '../../lib/work/workModel';

// Initialize chromium for serverless environments
import chromium from '@sparticuz/chromium';

// Set graphics mode for serverless environments
if (process.env.VERCEL) {
  try {
    // @ts-ignore - setGraphicsMode is not in the type definitions but is available at runtime
    chromium.setGraphicsMode = false;
  } catch (error) {
    console.warn('Failed to set chromium graphics mode:', error);
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('lang')?.value as Locale) ?? 'en';
  const t = await getDictionary(locale);
  const entries = await getAllEntries('work', locale);
  const roles = mapContentToWorkRoles(entries, t);

  const data = renderResumeData(roles, t);

  // Check cache first
  const cachedPdf = getCachedPdf(data, locale);
  if (cachedPdf) {
    return new NextResponse(new Uint8Array(cachedPdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="resume.pdf"',
      },
    });
  }

  // Generate PDF if not cached
  const html = renderResumeHtml(data, t);

  let browser;
  try {
    const browserConfig = await getBrowserConfig();
    browser = await puppeteer.launch(browserConfig);
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

    // Cache the generated PDF
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
      `Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`,
      {
        status: 500,
      },
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
