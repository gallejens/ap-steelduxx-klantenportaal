import type { FC } from 'react';
import styles from '../styles/languageselector.module.scss';
import { IconCheck } from '@tabler/icons-react';
import { Text } from '@mantine/core';
import type { FlagProps } from 'mantine-flagpack';
import { LanguageFlag } from './LanguageFlag';

type Props = {
  selected: boolean;
  flag: FC<FlagProps>;
  label: string;
  onClick: () => void;
};

export const LanguageOption: FC<Props> = props => {
  return (
    <div
      className={styles.language_selector_option}
      onClick={props.onClick}
    >
      {props.selected && <IconCheck size={18} />}
      <LanguageFlag
        flag={props.flag}
        width='1.3rem'
      />
      <Text size='sm'>{props.label}</Text>
    </div>
  );
};
