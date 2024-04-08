import { ActionIcon, Popover } from '@mantine/core';
import { IconLanguage } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import CustomLanguageCard from './LanguageCard';
import { languages } from '../languages';

export function LanguagePopOver() {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (lang: string) => {
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
        <div>
          <ActionIcon variant='transparent'>
            <IconLanguage />
          </ActionIcon>
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
            ></CustomLanguageCard>
          ))}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
}
