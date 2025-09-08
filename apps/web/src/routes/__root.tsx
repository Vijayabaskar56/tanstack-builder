import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRouteWithContext,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type { BuilderState } from "@/components/builder/types";
import Loader from "@/components/loader";
import NavBar from "@/components/nav-bar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "../index.css";
import { settingsCollection } from "@/db-collections";

export interface RouterAppContext {
	builder: BuilderState;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
	component: RootComponent,
 	beforeLoad: async () => {
		if (localStorage.getItem("settings")) {
			return;
		} else {
			settingsCollection.insert([
				{
					id: "user-settings",
					activeTab: "builder",
					defaultRequiredValidation: true,
					numericInput: false,
					focusOnError: true,
					validationMethod: "onDynamic",
					asyncValidation: 300,
					preferredSchema: "zod",
					preferredFramework: "react",
     preferredPackageManager : 'pnpm'
				},
			]);
		}
	},
	head: () => ({
		meta: [
			{
				title: "My App",
			},
			{
				name: "description",
				content: "My App is a web application",
			},
		],
		links: [
			{
				rel: "icon",
				href: "/favicon.ico",
			},
		],
	}),
});

function RootComponent() {
	const isFetching = useRouterState({
		select: (s) => s.isLoading,
	});

	return (
		<>
			{/* <HeadContent /> */}
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<div className="min-h-screen">
					<NavBar />
					{isFetching ? <Loader /> : <Outlet />}
				</div>
				<Toaster richColors />
			</ThemeProvider>
			<TanStackDevtools
				plugins={[
					{
						name: "Tanstack Router",
						render: <TanStackRouterDevtoolsPanel />,
					},
				]}
			/>
		</>
	);
}
