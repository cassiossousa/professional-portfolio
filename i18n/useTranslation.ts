'use client';

import { useMessages } from './provider';

export function useTranslation(namespace: string) {
  const messages = useMessages();

  function t(key: string) {
    return messages?.[namespace]?.[key] ?? key;
  }

  return { t };
}
