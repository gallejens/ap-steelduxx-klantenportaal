import i18n, { type Resource, type ResourceLanguage } from 'i18next';
import { initReactI18next } from 'react-i18next';

// We import all the language files in the `languages` directory using some trickery
const languageFiles = import.meta.glob('./languages/*.json', { eager: true });

const resources: Resource = {};

for (const [path, fileContent] of Object.entries(languageFiles)) {
  const languageName = path.match(/[^/]+(?=\.)/g);
  if (!languageName) continue;
  resources[String(languageName)] = (
    fileContent as { default: ResourceLanguage }
  ).default;
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // default
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
});

export default i18n;
