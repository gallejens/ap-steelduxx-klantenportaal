import { useMemo, type FC } from 'react';
import styles from '../styles/appshell.module.scss';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { TABS } from '../constant';
import { useAppshellStore } from '../stores/useAppshellStore';
import classNames from 'classnames';
import { rgbaToCss, rgbToCss } from '@/lib/util/rgb';
import { useAuth } from '@/hooks/useAuth';
import { Tooltip } from '@mantine/core';

export const Tabs: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { t } = useTranslation();
  const collapsed = useAppshellStore(s => s.sidebarCollapsed);

  const visibleTabs = useMemo(() => {
    return TABS.filter(
      tab =>
        !tab.requiredPermission ||
        user?.permissions.includes(tab.requiredPermission)
    );
  }, [user?.permissions]);

  const currentPath = routerState.location.pathname;

  return (
    <div className={styles.appshell__tabs}>
      {visibleTabs.map(tab => (
        <Tooltip
          key={`tab_${tab.path}`}
          label={t(`appshell:tabs:${tab.labelKey}`)}
          position='right'
          transitionProps={{ transition: 'rotate-right', duration: 300 }}
          color={`rgba(${tab.color.r + 50}, ${tab.color.g + 50}, ${tab.color.b + 50})`}
          opened={collapsed ? undefined : false}
        >
          <div
            onClick={() => {
              navigate({ to: tab.path as string });
            }}
            className={classNames(
              currentPath.startsWith(tab.path) && styles.active
            )}
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
        </Tooltip>
      ))}
    </div>
  );
};
