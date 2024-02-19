import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enJSON from './locals/en.json';
import nlJSOn from './locals/nl.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { ...enJSON },
    nl: { ...nlJSOn },
  },
  lng: 'en', // default
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
});

export default i18n;
