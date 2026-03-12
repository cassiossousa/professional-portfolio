'use client';

import { createContext, useContext } from 'react';
import { Translation } from './types';

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

export function useMessages(): Translation {
  const context = useContext(TranslationContext);
  if (!context) throw new Error('TranslationProvider not found in tree');
  return context;
}
