import { NotificationPopover } from '@/components/notificationpopover';
import { ActionIcon, Burger } from '@mantine/core';
import { IconLanguage } from '@tabler/icons-react';
import type { FC } from 'react';
import styles from '../styles/appshell.module.scss';
import { useAppshellStore } from '../stores/useAppshellStore';

export const Header: FC = () => {
  const [collapsed, setCollapsed] = useAppshellStore(s => [
    s.sidebarCollapsed,
    s.setSidebarCollapsed,
  ]);

  return (
    <div className={styles.appshell__header}>
      <Burger
        opened={collapsed}
        onClick={() => {
          setCollapsed(s => !s);
        }}
        color='var(--mantine-color-primary-0)'
      />
      <div className={styles.actions}>
        <ActionIcon variant='transparent'>
          <IconLanguage color='var(--mantine-color-primary-0)' />
        </ActionIcon>
        <NotificationPopover></NotificationPopover>
      </div>
    </div>
  );
};
