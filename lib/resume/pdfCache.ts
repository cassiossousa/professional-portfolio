import { ResumeData } from './renderResumeData';

interface CacheEntry {
  pdfBuffer: Uint8Array;
  timestamp: number;
  locale: string;
  customContent?: string;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

function generateCacheKey(
  data: ResumeData,
  locale: string,
  customContent?: string,
): string {
  const dataHash = JSON.stringify({ ...data, customContent });
  return `${locale}-${Buffer.from(dataHash).toString('base64').slice(0, 16)}`;
}

export function getCachedPdf(
  data: ResumeData,
  locale: string,
  customContent?: string,
): Buffer | null {
  const key = generateCacheKey(data, locale, customContent);
  const entry = cache.get(key);

  if (!entry) return null;

  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }

  return Buffer.from(entry.pdfBuffer);
}

export function setCachedPdf(
  data: ResumeData,
  locale: string,
  pdfBuffer: Uint8Array,
  customContent?: string,
): void {
  const key = generateCacheKey(data, locale, customContent);
  cache.set(key, {
    pdfBuffer,
    timestamp: Date.now(),
    locale,
    customContent,
  });
}

export function clearCache(): void {
  cache.clear();
}

export function cleanupExpiredCache(): void {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }
}
