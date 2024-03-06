import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { AppShell } from './components/appshell';
import { HomePage } from './pages/home';
import { LoginPage } from './pages/login';
import { TestValuesPage } from './pages/testvaluespage';
import { userRequestPage } from './pages/userrequest';
import { HomePage } from './pages/home';
import { OrderListPage } from './pages/orderlist';

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LoginPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const userrequestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/request_account',
  component: userRequestPage,
});

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'app',
  component: AppShell,
});

const homePageRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/home',
  component: HomePage,
});

const testvaluesRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/testvalues',
  component: TestValuesPage,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home',
  component: HomePage,
});

const OrderListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orderlist',
  component: OrderListPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  userrequestRoute,
  appRoute.addChildren([homePageRoute, testvaluesRoute]),
]);
export const router = createRouter({ routeTree });

// Make autocomplete work
declare module '@tanstack/react-router' {
  interface userrequest {
    router: typeof router;
  }
}
