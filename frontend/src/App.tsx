import { RouterProvider } from '@tanstack/react-router';
import { type FC } from 'react';
import { Modals } from './components/modals';
import { Notifications } from './components/notifications';
import { router } from './router';
import styles from './styles/app.module.scss';
import { PageTitleHelper } from './components/pagetitlehelper';

export const App: FC = () => {
  return (
    <>
      <div className={styles.container}>
        <RouterProvider router={router} />
      </div>
      <Notifications />
      <Modals />
      <PageTitleHelper />
    </>
  );
};
