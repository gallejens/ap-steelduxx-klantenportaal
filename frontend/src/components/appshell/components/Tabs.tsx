import { type FC } from 'react';
import styles from '../styles/appshell.module.scss';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { TABS } from '../constant';
import { useAppshellStore } from '../stores/useAppshellStore';
import classNames from 'classnames';
import { rgbaToCss, rgbToCss } from '@/lib/util/rgb';
import { useAuth } from '@/hooks/useAuth';

export const Tabs: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { t } = useTranslation();
  const collapsed = useAppshellStore(s => s.sidebarCollapsed);

  return (
    <div className={styles.appshell__tabs}>
      {TABS.map(tab => {
        const hasPermission =
          !tab.requiredPermission ||
          user?.permissions.includes(tab.requiredPermission);
        if (hasPermission === false) return null;

        const isActive = routerState.location.pathname.startsWith(tab.path);
        return (
          <div
            key={`tab_${tab.path}`}
            onClick={() => {
              navigate({ to: tab.path });
            }}
            className={classNames(isActive && styles.active)}
          >
            <div
              className={styles.navimg}
              style={{
                backgroundColor: rgbaToCss({
                  r: tab.color.r + 50,
                  g: tab.color.g + 50,
                  b: tab.color.b + 50,
                  a: 0.2,
                }),
              }}
            >
              <tab.icon color={rgbToCss(tab.color)} />
            </div>
            {!collapsed && t(`appshell:tabs:${tab.labelKey}`)}
          </div>
        );
      })}
    </div>
  );
};
