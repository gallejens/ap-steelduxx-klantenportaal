import { type FC } from 'react';
import styles from '../styles/appshell.module.scss';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { TABS } from '../constant';
import { useAppshellStore } from '../stores/useAppshellStore';

export const Tabs: FC = () => {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { t } = useTranslation();
  const collapsed = useAppshellStore(s => s.sidebarCollapsed);

  return (
    <div className={styles.appshell__tabs}>
      {TABS.map(tab => {
        const isActive = routerState.location.pathname.startsWith(
          `/app/${tab.path}`
        );
        return (
          <div
            key={`tab_${tab.path}`}
            onClick={() => {
              navigate({ to: tab.path });
            }}
            className={`${isActive ? styles.active : ''}`}
          >
            <div
              className={styles.navimg}
              style={{ backgroundColor: tab.color }}
            >
              <tab.icon
                color={`rgb(${tab.iconColor.r}, ${tab.iconColor.g}, ${tab.iconColor.b})`}
              />
            </div>
            {!collapsed && t(`appshell:tabs:${tab.labelKey}`)}
          </div>
        );
      })}
    </div>
  );
};
