import { generateRSS } from '../../../lib/rss';

export async function GET() {
  const xml = generateRSS('https://professional-portfolio-mu-gray.vercel.app');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
