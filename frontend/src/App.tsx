import { RouterProvider } from '@tanstack/react-router';
import type { FC } from 'react';
import { Modals } from './components/modals';
import { Notifications } from './components/notifications';
import { router } from './router';
import styles from './styles/app.module.scss';

// TODO: Add navbar here and use the router to show the current page while always showing the navbar
// Also place overlays here (notifs, modals etc)

export const App: FC = () => {
  return (
    <>
      <div className={styles.container}>
        <RouterProvider router={router} />
      </div>
      <Notifications />
      <Modals />
    </>
  );
};
