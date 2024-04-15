import { Outlet } from '@tanstack/react-router';
import { type FC } from 'react';
import styles from './styles/appshell.module.scss';
import { UserDisplay } from './components/UserDisplay';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { SteelLogo } from '../steellogo';
import { SIDEBAR_WIDTH } from './constant';
import { useAppshellStore } from './stores/useAppshellStore';

export const AppShell: FC = () => {
  const collapsed = useAppshellStore(s => s.sidebarCollapsed);

  return (
    <div className={styles.appshell}>
      <div
        className={styles.sidebar}
        style={{ width: collapsed ? undefined : `${SIDEBAR_WIDTH}rem` }}
      >
        <div className={styles.logo}>
          <SteelLogo height='100%' />
        </div>
        <Tabs />
        <UserDisplay />
      </div>
      <div className={styles.content}>
        <Header />
        <div className={styles.route}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
