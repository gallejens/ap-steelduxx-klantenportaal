import { IconLanguage, IconMessage } from '@tabler/icons-react';
import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import type { FC } from 'react';
import { TABS } from './constant';
import styles from './styles/appshell.module.scss';

export const AppShell: FC = () => {
  const navigate = useNavigate();
  const routerState = useRouterState();

  console.log(routerState.location.pathname);

  const handleTabClick = (path: string) => {
    navigate({ to: path });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <img
          className={styles.logo}
          src='/logo.svg'
          alt='logo'
          onClick={() => {
            handleTabClick('home');
          }}
        />
        <div className={styles.actions}>
          <IconLanguage />
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
                    {tab.img}
                  </div>
                  {tab.label}
                </div>
              );
            })}
          </div>
          <div className={styles.users}>
            <img
              className={styles.userpfp}
              src='/default-pfp.png'
              alt='default icon'
            />
            <div className={styles.rightside}>
              <div className={styles.userName}>Maximilian Duda</div>
              <div className={styles.userMail}>
                Maximiliandudajunior@gmail.com
              </div>
            </div>
          </div>
        </div>
        <div className={styles.route}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
