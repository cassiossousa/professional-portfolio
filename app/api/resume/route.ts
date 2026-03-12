import { NextResponse } from 'next/server';

export async function GET() {
  const html = `
  <html>
  <body>
  <h1>Cássio dos Santos Sousa</h1>
  <p>Software Engineer</p>
  </body>
  </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
