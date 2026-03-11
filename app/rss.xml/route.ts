import { NextResponse } from 'next/server';
import { generateRSS } from '../../lib/rss';

export async function GET() {
  const xml = generateRSS('en');

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
