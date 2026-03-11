import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get('lang');

  if (lang) {
    const response = NextResponse.next();

    response.cookies.set('lang', lang);

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};
