/* eslint-disable @typescript-eslint/no-throw-literal */

import { useAuthStore } from '@/stores/useAuthStore';
import { redirect } from '@tanstack/react-router';

type BeforeLoadBuilderOptions =
  | { mustBeAuthenticated: true; mustBeUnauthenticated?: never }
  | { mustBeUnauthenticated: true; mustBeAuthenticated?: never };

export const beforeLoadBuilder = (
  options: BeforeLoadBuilderOptions
): (() => Promise<void>) => {
  if (options.mustBeAuthenticated) {
    // redirect to login if route is only for authenticated users
    return async () => {
      const userInfo = await useAuthStore.getState().getUserInfo();
      console.log(userInfo);
      if (userInfo === null) {
        throw redirect({
          to: '/login',
        });
      }
    };
  }

  if (options.mustBeUnauthenticated) {
    // redirect to home if route is only for unauthenticated users
    return async () => {
      const userInfo = await useAuthStore.getState().getUserInfo();
      console.log(userInfo);
      if (userInfo !== null) {
        throw redirect({
          to: '/app/home',
        });
      }
    };
  }

  throw new Error('Invalid options for beforeLoadBuilder');
};
