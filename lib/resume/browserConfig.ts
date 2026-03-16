import chromium from '@sparticuz/chromium';

export interface BrowserConfig {
  args: string[];
  executablePath: string;
  headless: boolean;
}

export async function getBrowserConfig(): Promise<BrowserConfig> {
  const isVercel = !!process.env.VERCEL;
  const isLocalDev = process.env.NODE_ENV === 'development';

  if (isVercel) {
    // Vercel serverless environment
    return {
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    };
  }

  if (isLocalDev) {
    // Local development - try to find Chrome automatically
    const localChromePath = await findLocalChrome();
    if (localChromePath) {
      return {
        args: [],
        executablePath: localChromePath,
        headless: true,
      };
    }
  }

  // Fallback to system Chrome (cross-platform)
  const systemChromePath = getSystemChromePath();
  if (systemChromePath) {
    return {
      args: [],
      executablePath: systemChromePath,
      headless: true,
    };
  }

  throw new Error(
    'Chrome/Chromium not found. Please install Chrome or set CHROME_PATH environment variable.',
  );
}

async function findLocalChrome(): Promise<string | null> {
  // Try common Chrome locations
  const possiblePaths = [
    // Windows
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    // macOS
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    // Linux
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ];

  for (const path of possiblePaths) {
    try {
      // Check if file exists (simplified check)
      if (path.includes('C:\\') || path.includes('/Applications/')) {
        return path; // Assume it exists for Windows/macOS
      }
    } catch {
      continue;
    }
  }

  return null;
}

function getSystemChromePath(): string | null {
  // Environment variable override
  const envPath = process.env.CHROME_PATH;
  if (envPath) {
    return envPath;
  }

  // Default to 'chrome' or 'google-chrome' command
  return process.platform === 'win32' ? 'chrome' : 'google-chrome';
}
