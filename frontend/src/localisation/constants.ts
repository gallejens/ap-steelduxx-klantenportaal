import { GBFlag, NLFlag, type FlagProps } from 'mantine-flagpack';
import type { FC } from 'react';

export const LANGUAGES: {
  key: string;
  label: string; // ex: 'English'
  shortLabel: string; // ex: 'EN'
  flag: FC<FlagProps>;
  default?: boolean;
}[] = [
  {
    key: 'en',
    label: 'English',
    shortLabel: 'EN',
    flag: GBFlag,
    default: true,
  },
  {
    key: 'nl',
    label: 'Nederlands',
    shortLabel: 'NL',
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
