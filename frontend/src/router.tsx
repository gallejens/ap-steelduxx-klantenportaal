import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { LoginPage } from "./pages/login";
import { TestValuesPage } from "./pages/testvaluespage";
import { RegisterPage } from "./pages/register";

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

const registerRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/register",
	component: RegisterPage,
});

const testvaluesRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/testvalues",
	component: TestValuesPage,
});

const routeTree = rootRoute.addChildren([indexRoute, loginRoute, registerRoute, testvaluesRoute]);
export const router = createRouter({ routeTree });

// Make autocomplete work
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
