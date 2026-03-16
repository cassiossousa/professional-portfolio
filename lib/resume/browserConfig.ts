import chromium from '@sparticuz/chromium';

export interface BrowserConfig {
  args?: string[];
  executablePath?: string;
  headless: boolean;
}

export async function getBrowserConfig(): Promise<BrowserConfig> {
  const isVercel = !!process.env.VERCEL;

  if (isVercel) {
    const executablePath = await chromium.executablePath();

    return {
      args: chromium.args,
      executablePath,
      headless: true,
    };
  }

  // Local development: use puppeteer's bundled Chromium with default settings
  return {
    headless: true,
  };
}
