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
import { ResetPasswordPage } from './pages/resetpassword';
import { ChoosePasswordPage } from './pages/choosepassword';

const rootRoute = createRootRoute();

// Public routes
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

// Private routes
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

const userRequestListRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/requests',
  component: UserRequestListPage,
});

const passwordResetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'reset-password',
  component: ResetPasswordPage,
});

// Choose password route
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

// Creating route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  userRequestRoute,
  appRoute.addChildren([homePageRoute, testvaluesRoute, userRequestListRoute]),
  passwordResetRoute,
  choosePasswordRoute,
]);
export const router = createRouter({ routeTree });

// Make autocomplete work
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
