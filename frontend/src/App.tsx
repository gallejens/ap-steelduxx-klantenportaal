import { RouterProvider } from '@tanstack/react-router';
import type { FC } from 'react';
import { router } from './router';

// TODO: Add navbar here and use the router to show the current page while always showing the navbar
// Also place overlays here (notifs, modals etc)

export const App: FC = () => {
  return <RouterProvider router={router} />;
};
