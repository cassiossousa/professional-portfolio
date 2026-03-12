'use client';

import Link from 'next/link';
import { useState } from 'react';

import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '../i18n/useTranslation';

export default function Navbar() {
  const { t } = useTranslation('nav');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Single source of truth for nav links
  const links = [
    { href: '/', label: 'Home' },
    { href: '/work', label: t('work') },
    { href: '/projects', label: t('projects') },
    { href: '/blog', label: t('blog') },
  ];

  return (
    <nav className="container-main flex justify-between items-center py-6 relative">
      {/* Desktop nav */}
      <div className="hidden md:flex gap-6">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="hover:underline">
            {link.label}
          </Link>
        ))}
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden px-3 py-2 border rounded"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? '✕' : '☰'}
      </button>

      {/* Language switcher */}
      <div className="flex gap-2 ml-4">
        <LanguageSwitcher />
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="absolute top-full left-0 w-full bg-background dark:bg-neutral-900 shadow-md md:hidden z-10 transition-all duration-300">
          <div className="flex flex-col p-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:underline"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
