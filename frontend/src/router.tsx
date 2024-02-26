import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { LoginPage } from "./pages/login";
import { TestValuesPage } from "./pages/testvaluespage";
import { userRequestPage } from "./pages/userrequest";

const rootRoute = createRootRoute();

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: LoginPage,
});

const loginRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/login",
	component: LoginPage,
});

const userrequestRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/request_account",
	component: userRequestPage,
});

const testvaluesRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/testvalues",
	component: TestValuesPage,
});

const routeTree = rootRoute.addChildren([indexRoute, loginRoute, userrequestRoute, testvaluesRoute]);
export const router = createRouter({ routeTree });

// Make autocomplete work
declare module "@tanstack/react-router" {
	interface userrequest {
		router: typeof router;
	}
}
