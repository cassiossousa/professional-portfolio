import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import chromium from '@sparticuz/chromium';

import { getAllEntries } from '../../lib/content';
import { getDictionary } from '../../i18n/dictionaries';
import { getProjects } from '../../lib/projects/getProjects';

import { renderResumeData } from '../../lib/resume/renderResumeData';
import { renderResumeHtml } from '../../lib/resume/renderResumeHtml';

import { Locale } from '../../types/i18n';
import { mapContentToWorkRoles } from '../../lib/work-experience/workModel';
import dayjs from 'dayjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function launchBrowserWithRetry(
  puppeteer: any,
  options: any,
  retries = 3,
) {
  let lastError;

  for (let i = 0; i < retries; i++) {
    try {
      return await puppeteer.launch(options);
    } catch (err: any) {
      lastError = err;

      const message = String(err?.message || err);

      if (!message.includes('ETXTBSY')) {
        throw err;
      }

      // wait briefly before retrying
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  throw lastError;
}

export async function GET() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('lang')?.value as Locale) ?? 'en';

  const t = await getDictionary(locale);
  const entries = await getAllEntries('work-experience', locale);
  const roles = mapContentToWorkRoles(entries, t);

  const projects = await getProjects(locale);
  const resumeProjects = projects.filter((p) => p.topics?.includes('resume'));

  const data = renderResumeData(roles, t);

  // Generate timestamp up to minutes
  const normalizedLocale = locale.replace('-', '');
  const timestamp = dayjs().format('YYYY_MM_DD_HHmm');
  const filename = `CV_${normalizedLocale}_Cassio_dos_Santos_Sousa_${timestamp}.pdf`;

  const html = renderResumeHtml(data, resumeProjects, t);

  let browser;

  try {
    const isVercel = !!process.env.VERCEL;

    const puppeteer = isVercel
      ? await import('puppeteer-core')
      : await import('puppeteer');

    const launchOptions = isVercel
      ? {
          args: chromium.args,
          executablePath: await chromium.executablePath(),
          headless: true,
          timeout: 60000,
        }
      : {
          headless: true,
        };

    browser = await launchBrowserWithRetry(puppeteer, launchOptions);

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: false,
      margin: {
        top: '30px',
        bottom: '30px',
        left: '20px',
        right: '20px',
      },
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
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
