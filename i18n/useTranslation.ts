'use client';

import { useMessages } from './provider';
import { Translation } from './types';

export function useTranslation<K extends keyof Translation>(namespace: K) {
  const messages = useMessages();
  return {
    t: (key: keyof Translation[K]) =>
      messages[namespace][key] ?? (key as string),
  };
}
