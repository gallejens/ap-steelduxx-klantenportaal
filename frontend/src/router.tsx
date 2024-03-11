import {
  Navigate,
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
import { beforeLoadBuilder } from './lib/router-helpers';

const rootRoute = createRootRoute({
  notFoundComponent: () => <Navigate to='/login' />,
});

// Unauthorized Only Routes
const unauthorizedOnlyRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'unaothorizedOnlyRoute',
  beforeLoad: beforeLoadBuilder({
    mustBeUnauthenticated: true,
  }),
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
  beforeLoad: beforeLoadBuilder({
    mustBeAuthenticated: true,
  }),
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
    testValuesRoute,
    userRequestListRoute,
  ]),
]);
export const router = createRouter({ routeTree, notFoundMode: 'root' });

// Make autocomplete work
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
