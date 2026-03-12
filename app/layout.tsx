import { Metadata } from 'next';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { getDictionary } from '../i18n/dictionaries';
import { TranslationProvider } from '../i18n/provider';
import { cookies } from 'next/headers';
import { Locale } from '../i18n/types';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://professional-portfolio-mu-gray.vercel.app'),
  title: {
    default: 'Cássio Sousa - Software Engineer',
    template: '%s | Cássio Sousa',
  },
  description: 'Software engineering portfolio, projects and technical blog.',
  alternates: {
    types: {
      'application/rss+xml': [
        {
          url: '/rss',
          title: 'RSS Feed',
        },
      ],
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('lang')?.value ?? 'en') as Locale;
  const messages = await getDictionary(locale);

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body>
        <TranslationProvider messages={messages}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </TranslationProvider>
      </body>
    </html>
  );
}
