import { RouterProvider } from '@tanstack/react-router';
import { useEffect, type FC } from 'react';
import { Modals } from './components/modals';
import { Notifications } from './components/notifications';
import { router } from './router';
import styles from './styles/app.module.scss';
import { useAuth } from './hooks/useAuth';

export const App: FC = () => {
  const { fetchUserInfo } = useAuth();

  useEffect(() => {
    fetchUserInfo();
  }, []);

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
