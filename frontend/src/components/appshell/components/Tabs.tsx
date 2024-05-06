import { type FC } from 'react';
import styles from '../styles/appshell.module.scss';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { TABS } from '../constant';
import { useAppshellStore } from '../stores/useAppshellStore';
import classNames from 'classnames';
import { rgbaToCss, rgbToCss } from '@/lib/util/rgb';
import { useAuth } from '@/hooks/useAuth';
import { Tooltip } from '@mantine/core';

import { useState } from 'react';

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
        const [showTooltip, setShowTooltip] = useState(false);

        return (
          <div
            key={`tab_${tab.path}`}
            onClick={() => {
              navigate({ to: tab.path as string });
            }}
            className={classNames(isActive && styles.active)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
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
              <Tooltip
                opened={showTooltip && collapsed}
                label={t(`appshell:tabs:${tab.labelKey}`)}
                position='right'
                offset={{ mainAxis: 30, crossAxis: 0 }}
                transitionProps={{ transition: 'rotate-right', duration: 300 }}
                color={`rgba(${tab.color.r + 50}, ${tab.color.g + 50}, ${tab.color.b + 50})`}
              >
                <tab.icon color={rgbToCss(tab.color)} />
              </Tooltip>
            </div>
            {!collapsed && t(`appshell:tabs:${tab.labelKey}`)}
          </div>
        );
      })}
    </div>
  );
};
