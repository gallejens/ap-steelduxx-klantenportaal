import { Popover, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import CustomLanguageCard from './LanguageCard';
import { useState } from 'react';
import { languages } from '../languages';
import styles from '../styles/languagepopover.module.scss';

interface LanguagePopOverProps {
  textColor?: string;
  paddingTop?: string;
}

export function LanguagePopOver(props: LanguagePopOverProps) {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem('lang')
  );

  const currentLanguageObj = languages.find(
    lang => lang.key === currentLanguage
  );

  const handleLanguageChange = (lang: string) => {
    localStorage.setItem('lang', lang);
    setCurrentLanguage(lang); // Update the state with the new language
    i18n.changeLanguage(lang);
  };

  return (
    <Popover
      width={200}
      position='bottom'
      withArrow
      shadow='md'
      offset={{ mainAxis: 10, crossAxis: -50 }}
    >
      <Popover.Target>
        <div className={styles.targetContainer}>
          <div
            className={styles.flagContainer}
            onClick={e => e.stopPropagation()}
          >
            {currentLanguageObj?.flag && (
              <currentLanguageObj.flag
                radius={'md'}
                className={styles.flag}
              />
            )}
          </div>
          <Text
            className={styles.lang_name}
            pt={props.paddingTop ?? '0px'}
            c={props.textColor ?? 'white'}
            fw={500}
          >
            {currentLanguageObj?.name}
          </Text>
        </div>
      </Popover.Target>
      <Popover.Dropdown bg='var(--mantine-color-body)'>
        <div>
          {languages.map(lang => (
            <CustomLanguageCard
              key={lang.key}
              flag={lang.flag}
              name={lang.name}
              onClick={() => handleLanguageChange(lang.key)}
              isSelected={lang.key === currentLanguage}
            />
          ))}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
}
