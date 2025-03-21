'use client';

import { useEffect, useState } from 'react';
import { initI18n } from './config';

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initI18n();
        setIsI18nInitialized(true);
      } catch (error) {
        console.error('Failed to initialize i18n:', error);
        // Still set as initialized to prevent infinite loading
        setIsI18nInitialized(true);
      }
    };
    init();
  }, []);

  if (!isI18nInitialized) {
    // You can show a loading spinner or placeholder here
    return <div></div>;
  }

  return <>{children}</>;
}