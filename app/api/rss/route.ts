import { generateRSS } from '../../../lib/rss';

export async function GET() {
  const xml = generateRSS('https://cassiossousa.github.io');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
