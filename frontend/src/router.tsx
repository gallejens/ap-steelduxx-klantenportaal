import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { LoginPage } from './pages/login';
import { TestValuesPage } from './pages/testvaluespage';

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

const testvaluesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/testvalues',
  component: TestValuesPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  testvaluesRoute,
]);
export const router = createRouter({ routeTree });

// Make autocomplete work
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
