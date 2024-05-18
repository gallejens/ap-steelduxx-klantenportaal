import type { FC } from 'react';
import styles from '../styles/languageselector.module.scss';
import type { FlagProps } from 'mantine-flagpack';

type Props = {
  width: string;
  flag: FC<FlagProps>;
};

export const LanguageFlag: FC<Props> = props => {
  return (
    <div
      className={styles.language_selector_flag}
      style={{ width: props.width }}
    >
      <props.flag />
    </div>
  );
};
