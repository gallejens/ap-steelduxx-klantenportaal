/* eslint-disable @typescript-eslint/no-throw-literal */
import {
  Navigate,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router';
import { AppShell } from './components/appshell';
import { HomePage } from './pages/home';
import { LoginPage } from './pages/login';
import { TestValuesPage } from './pages/testvaluespage';
import { UserRequestPage } from './pages/userrequest';
import { UserRequestListPage } from './pages/userrequestlist';
import { ResetPasswordPage } from './pages/resetpassword';
import { ChoosePasswordPage } from './pages/choosepassword';
import { useAuthStore } from './stores/useAuthStore';
import { OrderListPage } from './pages/orderlist';
import { OrderDetailsPage } from './pages/orderdetails';
import { UserRequestReviewPage } from './pages/userrequestreview';
import { AccountListPage } from './pages/accountlist';

const rootRoute = createRootRoute();

// Unauthorized Only Routes
const unauthorizedOnlyRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'unauthorized-only-route',
  beforeLoad: async () => {
    const userInfo = await useAuthStore.getState().fetchUserInfo();
    if (userInfo !== null) {
      throw redirect({
        to: '/app/home',
      });
    }
  },
});

const loginRoute = createRoute({
  getParentRoute: () => unauthorizedOnlyRoute,
  path: 'login',
  component: LoginPage,
});

const userRequestRoute = createRoute({
  getParentRoute: () => unauthorizedOnlyRoute,
  path: 'request-account',
  component: UserRequestPage,
});

const passwordResetRoute = createRoute({
  getParentRoute: () => unauthorizedOnlyRoute,
  path: 'reset-password',
  component: ResetPasswordPage,
});

const choosePasswordRoute = createRoute({
  getParentRoute: () => unauthorizedOnlyRoute,
  path: 'choose-password',
  component: ChoosePasswordPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token:
        search.token !== undefined && typeof search.token === 'string'
          ? String(search.token)
          : undefined,
    };
  },
});

// Authorized Only Routes
const authorizedOnlyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'app',
  component: AppShell,
  beforeLoad: async () => {
    const userInfo = await useAuthStore.getState().fetchUserInfo();
    if (userInfo === null) {
      throw redirect({
        to: '/login',
      });
    }
  },
});

const homeRoute = createRoute({
  getParentRoute: () => authorizedOnlyRoute,
  path: 'home',
  component: HomePage,
});

const testValuesRoute = createRoute({
  getParentRoute: () => authorizedOnlyRoute,
  path: 'testvalues',
  component: TestValuesPage,
});

const userRequestListRoute = createRoute({
  getParentRoute: () => authorizedOnlyRoute,
  path: 'requests',
  component: UserRequestListPage,
});

const orderListRoute = createRoute({
  getParentRoute: () => authorizedOnlyRoute,
  path: 'orders',
  component: OrderListPage,
});

const orderDetailsRoute = createRoute({
  getParentRoute: () => authorizedOnlyRoute,
  path: '/orders/$order_id',
  component: OrderDetailsPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      customerCode:
        search.customerCode !== undefined &&
        typeof search.customerCode === 'string'
          ? String(search.customerCode)
          : undefined,
    };
  },
});

const userRequestReviewRoute = createRoute({
  getParentRoute: () => authorizedOnlyRoute,
  path: '/requests/$request_id',
  component: UserRequestReviewPage,
});

const accountListRoute = createRoute({
  getParentRoute: () => authorizedOnlyRoute,
  path: 'accounts',
  component: AccountListPage,
});

// Creating route tree
const routeTree = rootRoute.addChildren([
  unauthorizedOnlyRoute.addChildren([
    loginRoute,
    userRequestRoute,
    passwordResetRoute,
    choosePasswordRoute,
  ]),
  authorizedOnlyRoute.addChildren([
    homeRoute,
    orderListRoute,
    orderDetailsRoute,
    userRequestListRoute,
    testValuesRoute,
    userRequestReviewRoute,
    accountListRoute,
  ]),
]);

export const router = createRouter({
  routeTree,
  notFoundMode: 'root',
  defaultNotFoundComponent: () => <Navigate to='/login' />,
});

// Make autocomplete work
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
