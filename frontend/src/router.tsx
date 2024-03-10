import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { AppShell } from './components/appshell';
import { HomePage } from './pages/home';
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
