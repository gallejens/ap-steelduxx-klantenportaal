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
import { UserRequestPage } from './pages/userrequest';
import { UserRequestListPage } from './pages/userrequestlist';
import { ResetPasswordPage } from './pages/resetpassword';
import { ChoosePasswordPage } from './pages/choosepassword';
import { useAuthStore } from './stores/useAuthStore';
import { OrderListPage } from './pages/orderlist';
import { OrderDetailsPage } from './pages/orderdetails';
import { UserRequestReviewPage } from './pages/userrequestreview';
import { CompaniesPage } from './pages/companies';
import { OrderCreatePage } from './pages/ordercreate/Index';
import { OrderRequestListPage } from './pages/orderrequestlist';
import { OrderRequestReviewPage } from './pages/orderrequestreview';
import { ManualPage } from './pages/manual';
import type { Auth } from './types/auth';

const requirePermissionBeforeLoad = (requiredPermission: Auth.Permission) => {
  return () => {
    const userInfo = useAuthStore.getState().user;
    if (!userInfo || !userInfo.permissions.includes(requiredPermission)) {
      throw redirect({
        to: '/app/home',
      });
    }
  };
};

const rootRoute = createRootRoute({
  beforeLoad: async () => {
    await useAuthStore.getState().fetchUserInfo();
  },
});

// Unauthorized Only Routes
const unauthorizedOnlyRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'unauthorized-only-route',
  beforeLoad: () => {
    const userInfo = useAuthStore.getState().user;
    if (userInfo === null) return;
    throw redirect({
      to: '/app/home',
    });
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
  getParentRoute: () => rootRoute,
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
  beforeLoad: () => {
    const userInfo = useAuthStore.getState().user;
    if (userInfo !== null) return;
    throw redirect({
      to: '/login',
    });
  },
});

const homeRoute = createRoute({
  getParentRoute: () => authorizedOnlyRoute,
  path: 'home',
  component: HomePage,
});

const userRequestListRoute = createRoute({
  getParentRoute: () => authorizedOnlyRoute,
  path: 'requests',
  component: UserRequestListPage,
  beforeLoad: requirePermissionBeforeLoad('MANAGE_USER_REQUESTS'),
});

const orderListRoute = createRoute({
  getParentRoute: () => authorizedOnlyRoute,
  path: 'orders',
  component: OrderListPage,
});

const orderRequestsListRoute = createRoute({
  getParentRoute: () => authorizedOnlyRoute,
  path: 'order-requests',
  component: OrderRequestListPage,
  beforeLoad: requirePermissionBeforeLoad('MANAGE_ORDER_REQUESTS'),
});

const orderRequestReviewRoute = createRoute({
  getParentRoute: () => authorizedOnlyRoute,
  path: '/order-requests/$orderrequestid',
  component: OrderRequestReviewPage,
  beforeLoad: requirePermissionBeforeLoad('MANAGE_ORDER_REQUESTS'),
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

const orderCreateRoute = createRoute({
  getParentRoute: () => authorizedOnlyRoute,
  path: '/orders/new',
  component: OrderCreatePage,
  beforeLoad: requirePermissionBeforeLoad('CREATE_NEW_ORDERS'),
});

const userRequestReviewRoute = createRoute({
  getParentRoute: () => authorizedOnlyRoute,
  path: '/requests/$request_id',
  component: UserRequestReviewPage,
  beforeLoad: requirePermissionBeforeLoad('MANAGE_USER_REQUESTS'),
});

const companiesRoute = createRoute({
  getParentRoute: () => authorizedOnlyRoute,
  path: 'companies',
  component: CompaniesPage,
  beforeLoad: requirePermissionBeforeLoad('VIEW_COMPANIES'),
});

// Wiki pages
const manualRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/manual/$language/$type',
  component: ManualPage,
});

// Creating route tree
const routeTree = rootRoute.addChildren([
  choosePasswordRoute,
  unauthorizedOnlyRoute.addChildren([
    loginRoute,
    userRequestRoute,
    passwordResetRoute,
  ]),
  authorizedOnlyRoute.addChildren([
    homeRoute,
    orderListRoute,
    orderRequestsListRoute,
    orderRequestReviewRoute,
    orderDetailsRoute,
    orderCreateRoute,
    userRequestListRoute,
    userRequestReviewRoute,
    companiesRoute,
  ]),
  manualRoute,
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
