import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { LoginPage } from './pages/login';
import { TestValuesPage } from './pages/testvaluespage';
import { UserRequestPage } from './pages/userrequest';
import { UserRequestListPage } from './pages/userrequestlist';

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

const userRequestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/request_account',
  component: UserRequestPage,
});

const userRequestListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/requests',
  component: UserRequestListPage,
});

const testvaluesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/testvalues',
  component: TestValuesPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  userRequestRoute,
  userRequestListRoute,
  testvaluesRoute,
]);
export const router = createRouter({ routeTree });

// Make autocomplete work
declare module '@tanstack/react-router' {
  interface userrequest {
    router: typeof router;
  }
}
