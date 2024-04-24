import { GBFlag, NLFlag } from 'mantine-flagpack';

export const LANGUAGES = [
  {
    key: 'en',
    name: 'English',
    flag: GBFlag,
    default: true,
  },
  {
    key: 'nl',
    name: 'Nederlands',
    flag: NLFlag,
  },
];

export const DEFAULT_LANGUAGE = (() => {
  const defaultLanguage = LANGUAGES.find(l => l.default)?.key;
  if (!defaultLanguage) {
    throw new Error('No default language found');
  }
  return defaultLanguage;
})();
