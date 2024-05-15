import type { FC } from 'react';
import styles from '../styles/publicpagewrapper.module.scss';
import { IconButton } from '@/components/iconbutton';
import { IconArrowLeft } from '@tabler/icons-react';
import { LanguageSelector } from '@/components/languageselector';
import { Text } from '@mantine/core';

type Props = {
  title: string;
  showBackButton: boolean;
  showLanguageSelector: boolean;
};

export const Header: FC<Props> = props => {
  return (
    <div className={styles.header}>
      {props.showBackButton && (
        <div className={styles.back_button}>
          <IconButton
            tooltipKey='publicPageWrapper:goBack'
            onClick={() => history.go(-1)}
            icon={<IconArrowLeft />}
          />
        </div>
      )}
      <Text>{props.title}</Text>
      <div className={styles.lang_selector}>
        {props.showLanguageSelector && (
          <LanguageSelector color='var(--mantine-primary-color-9)' />
        )}
      </div>
    </div>
  );
};
