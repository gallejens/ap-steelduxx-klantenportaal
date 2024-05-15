import { DEFAULT_LANGUAGE, LANGUAGES } from '@/localisation/constants';
import { Popover, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles/languageselector.module.scss';
import { LanguageOption } from './components/LanguageOption';
import { LanguageFlag } from './components/LanguageFlag';

type Props = {
  color?: string;
  showBorder?: boolean;
};

export const LanguageSelector: FC<Props> = props => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useLocalStorage({
    key: 'lang',
    defaultValue: DEFAULT_LANGUAGE,
  });
  const [open, setOpen] = useState(false);

  const onOptionClick = (lang: string) => {
    setOpen(false);

    if (lang === currentLanguage) return;

    setCurrentLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const currentLanguageObj = LANGUAGES.find(
    lang => lang.key === currentLanguage
  );

  if (!currentLanguageObj) {
    console.error('Language not found');
    return null;
  }

  return (
    <Popover
      position='bottom-end'
      withArrow
      shadow='md'
      opened={open}
      width={250}
    >
      <Popover.Target>
        <div
          className={styles.language_selector_target}
          onClick={() => setOpen(s => !s)}
          style={{
            backgroundColor: props.color,
            border: props.showBorder
              ? '1px solid var(--mantine-color-default-border)'
              : 'none',
          }}
        >
          <LanguageFlag
            flag={currentLanguageObj.flag}
            width='1.4rem'
          />
          <Text
            c={'primary.0'}
            size='sm'
          >
            {currentLanguageObj.shortLabel}
          </Text>
        </div>
      </Popover.Target>
      <Popover.Dropdown bg='var(--mantine-color-body)'>
        <div className={styles.language_selector_dropdown}>
          {LANGUAGES.map(lang => (
            <LanguageOption
              key={`lang_option_${lang.key}`}
              selected={lang.key === currentLanguage}
              flag={lang.flag}
              label={lang.label}
              onClick={() => onOptionClick(lang.key)}
            />
          ))}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};
