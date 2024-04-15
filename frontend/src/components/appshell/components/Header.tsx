import { NotificationPopover } from '@/components/notificationpopover';
import { Burger } from '@mantine/core';
import type { FC } from 'react';
import styles from '../styles/appshell.module.scss';
import { useAppshellStore } from '../stores/useAppshellStore';
import { LanguagePopOver } from '@/components/languagepopover';

export const Header: FC = () => {
  const [collapsed, setCollapsed] = useAppshellStore(s => [
    s.sidebarCollapsed,
    s.setSidebarCollapsed,
  ]);

  return (
    <div className={styles.appshell__header}>
      <Burger
        opened={!collapsed}
        onClick={() => {
          setCollapsed(s => !s);
        }}
        color='var(--mantine-color-primary-0)'
      />
      <div className={styles.actions}>
        <LanguagePopOver />
        <NotificationPopover />
      </div>
    </div>
  );
};
