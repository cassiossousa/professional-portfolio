'use client';

import { createContext, useContext } from 'react';

type Messages = Record<string, any>;

const TranslationContext = createContext<Messages>({});

export function TranslationProvider({
  messages,
  children,
}: {
  messages: Messages;
  children: React.ReactNode;
}) {
  return (
    <TranslationContext.Provider value={messages}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useMessages() {
  return useContext(TranslationContext);
}
