import chromium from '@sparticuz/chromium';

export interface BrowserConfig {
  args: string[];
  executablePath: string;
  headless: boolean;
}

export async function getBrowserConfig(): Promise<BrowserConfig> {
  const isVercel = !!process.env.VERCEL;
  const isLocalDev = process.env.NODE_ENV === 'development';
  const platform = process.platform;

  if (isVercel) {
    // Vercel serverless environment - use optimized chromium
    try {
      // Use Vercel's optimized chromium build
      const executablePath = await chromium.executablePath();

      return {
        args: [
          ...chromium.args,
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-setuid-sandbox',
          '--no-sandbox',
          '--single-process',
          '--disable-extensions',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--disable-background-networking',
          '--disable-default-apps',
          '--disable-extensions',
          '--disable-sync',
          '--disable-translate',
          '--hide-scrollbars',
          '--metrics-recording-only',
          '--mute-audio',
          '--no-first-run',
          '--safebrowsing-disable-auto-update',
        ],
        executablePath,
        headless: true,
      };
    } catch (error) {
      console.error('Vercel chromium setup failed:', error);

      // Fallback with minimal args for serverless
      try {
        const executablePath = await chromium.executablePath();
        return {
          args: [
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--no-sandbox',
            '--single-process',
            '--disable-extensions',
            '--disable-setuid-sandbox',
          ],
          executablePath,
          headless: true,
        };
      } catch (fallbackError) {
        console.error('All chromium approaches failed:', fallbackError);
        throw new Error(
          'Failed to initialize browser in Vercel environment. Please ensure @sparticuz/chromium is properly configured.',
        );
      }
    }
  }

  if (isLocalDev) {
    // Local development - try to find Chrome automatically
    const localChromePath = await findLocalChrome();
    if (localChromePath) {
      return {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: localChromePath,
        headless: true,
      };
    }
  }

  // Fallback to system Chrome (cross-platform)
  const systemChromePath = getSystemChromePath();
  if (systemChromePath) {
    return {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: systemChromePath,
      headless: true,
    };
  }

  throw new Error(
    'Chrome/Chromium not found. Please install Chrome or set CHROME_PATH environment variable.',
  );
}

async function findLocalChrome(): Promise<string | null> {
  const platform = process.platform;

  // Try common Chrome locations based on platform
  const possiblePaths =
    platform === 'win32'
      ? [
          // Windows paths
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Users\\' +
            (process.env.USERNAME || '') +
            '\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
        ]
      : platform === 'darwin'
        ? [
            // macOS paths
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            '/Applications/Chromium.app/Contents/MacOS/Chromium',
          ]
        : [
            // Linux paths
            '/usr/bin/google-chrome',
            '/usr/bin/chromium-browser',
            '/usr/bin/chromium',
            '/snap/bin/chromium',
          ];

  for (const path of possiblePaths) {
    try {
      // For Windows, we can be more confident about the path
      if (platform === 'win32' && path.includes('C:\\')) {
        return path;
      }
      // For macOS/Linux, we'd need to check file existence
      // For now, return the first likely candidate
      if (platform !== 'win32') {
        return path;
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

  // Platform-specific fallback
  const platform = process.platform;
  if (platform === 'win32') {
    return 'chrome';
  } else if (platform === 'darwin') {
    return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  } else {
    return 'google-chrome';
  }
}
