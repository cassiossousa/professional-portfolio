import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Locale } from '../i18n/config';
import { getDictionary } from '../i18n/dictionaries';
import { TranslationProvider } from '../i18n/provider';
import './globals.css';

import { cookies } from 'next/headers';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const locale = (cookieStore.get('lang')?.value ?? 'en') as Locale;

  const messages = await getDictionary(locale);

  return (
    <html lang={locale}>
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
