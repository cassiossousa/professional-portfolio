'use client';

import { createContext } from 'react';
import { Translation } from '../types/i18n';

const TranslationContext = createContext<Translation | null>(null);

export function TranslationProvider({
  messages,
  children,
}: {
  messages: Translation;
  children: React.ReactNode;
}) {
  return (
    <TranslationContext.Provider value={messages}>
      {children}
    </TranslationContext.Provider>
  );
}
