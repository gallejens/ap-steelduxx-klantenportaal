import { IconArrowLeft, IconLanguage, IconMessage } from '@tabler/icons-react';
import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import type { FC } from 'react';
import { TABS } from './constant';
import styles from './styles/appshell.module.scss';
import { UserDisplay } from './components/UserDisplay';
import { useTranslation } from 'react-i18next';
import { ActionIcon } from '@mantine/core';

export const AppShell: FC = () => {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();

  const handleTabClick = (path: string) => {
    navigate({ to: path });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <ActionIcon
          onClick={() => history.go(-1)}
          className={styles.back_button}
          variant='transparent'
        >
          <IconArrowLeft />
        </ActionIcon>
        <img
          className={styles.logo}
          src='/logo.svg'
          alt='logo'
          onClick={() => {
            handleTabClick('home');
          }}
        />
        <div className={styles.actions}>
          <ActionIcon
            onClick={() => {
              changeLanguage(language === 'en' ? 'nl' : 'en');
            }}
            variant='transparent'
          >
            <IconLanguage />
          </ActionIcon>
          <IconMessage />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.tabs}>
            {TABS.map(tab => {
              const isActive = routerState.location.pathname.endsWith(tab.path);
              return (
                <div
                  key={`tab_${tab.path}`}
                  onClick={() => {
                    handleTabClick(tab.path);
                  }}
                  className={`${isActive ? styles.active : ''}`}
                >
                  <div
                    className={styles.navimg}
                    style={{ backgroundColor: tab.color }}
                  >
                    {tab.icon}
                  </div>
                  {t(`appshell:tabs:${tab.labelKey}`)}
                </div>
              );
            })}
          </div>
          <UserDisplay />
        </div>
        <div className={styles.route}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
