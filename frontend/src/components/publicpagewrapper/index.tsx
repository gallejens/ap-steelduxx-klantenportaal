import { ActionIcon, Divider, Text } from '@mantine/core';
import type { FC, PropsWithChildren } from 'react';
import styles from './styles/publicpagewrapper.module.scss';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from '@tanstack/react-router';

type Props = {
  title: string;
  footer: JSX.Element;
  panelWidth: string;
};

export const PublicPageWrapper: FC<PropsWithChildren<Props>> = props => {
  const { history } = useRouter();

  return (
    <div className={styles.public_page_wrapper}>
      <div
        className={styles.panel}
        style={{ width: props.panelWidth }}
      >
        <div className={styles.header}>
          <ActionIcon
            onClick={() => history.go(-1)}
            className={styles.back_button}
          >
            <IconArrowLeft />
          </ActionIcon>
          <Text>{props.title}</Text>
          {/* TODO: Add language selector */}
        </div>
        <Divider className={styles.divider} />
        {props.children}
        <Divider className={styles.divider} />
        {props.footer}
      </div>
    </div>
  );
};
