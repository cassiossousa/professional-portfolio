import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const formData = await req.formData();
  const lang = formData.get('lang') as string;

  const cookieStore = await cookies();

  cookieStore.set('lang', lang, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });

  return NextResponse.redirect(
    'https://professional-portfolio-mu-gray.vercel.app',
  );
}
