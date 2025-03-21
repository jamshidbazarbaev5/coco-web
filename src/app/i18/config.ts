'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

const initI18n = async () => {
  await i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'uz',
      supportedLngs: ['uz', 'ru', ],
      debug: process.env.NODE_ENV === 'development',
      interpolation: {
        escapeValue: false,
      },
      backend: {
        loadPath: '/locales/{{lng}}/translation.json',
      },
      detection: {
        order: ['path', 'localStorage', 'cookie', 'navigator'],
        lookupFromPathIndex: 0,
        caches: ['localStorage', 'cookie'],
      },
    });
};

export { initI18n };
export default i18n;