import { Divider } from '@mantine/core';
import type { FC, PropsWithChildren } from 'react';
import styles from './styles/publicpagewrapper.module.scss';
import { Header } from './components/Header';

type Props = {
  title?: string;
  footer?: JSX.Element;
  panelWidth?: string;
  hideBackButton?: boolean;
  hideLanguageSelector?: boolean;
};

export const PublicPageWrapper: FC<PropsWithChildren<Props>> = props => {
  const showHeader =
    props.title !== undefined ||
    !props.hideBackButton ||
    !props.hideLanguageSelector;

  return (
    <div className={styles.public_page_wrapper}>
      <div
        className={styles.panel}
        style={{ width: props.panelWidth }}
      >
        {showHeader && (
          <>
            <Header
              title={props.title ?? ''}
              showBackButton={!props.hideBackButton}
              showLanguageSelector={!props.hideLanguageSelector}
            />
            <Divider className={styles.divider} />
          </>
        )}
        {props.children}
        {props.footer !== undefined && (
          <>
            <Divider className={styles.divider} />
            {props.footer}
          </>
        )}
      </div>
      <img
        className={styles.waves}
        src='/public_page_waves.svg'
      ></img>
    </div>
  );
};
