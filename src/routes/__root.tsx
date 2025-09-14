import { TanstackDevtools } from "@tanstack/react-devtools";
import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRouteWithContext,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import appCss from "../styles.css?url";

import Loader from "@/components/loader";
import NavBar from "@/components/nav-bar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { QueryClient } from "@tanstack/react-query";
import { settingsCollection } from "@/db-collections/settings.collections";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Form Builder",
			},
			{
				name: "description",
				content:
					"Help you Quickly Scafold a Form for your Tanstack  Using Tanstack Forms",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "icon",
				href: "/favicon.ico",
			},
		],
	}),

	shellComponent: RootDocument,
	beforeLoad: async () => {
		if (
			typeof window !== "undefined" &&
			!window.localStorage.getItem("settings")
		) {
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
					preferredPackageManager: "pnpm",
					isCodeSidebarOpen: false,
				},
			]);
		}
	},
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const isFetching = useRouterState({
		select: (s) => s.isLoading,
	});

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<ThemeProvider defaultTheme="system" attribute="class" enableSystem>
					<div className="max-h-screen">
						<NavBar />
						{isFetching ? <Loader /> : <Outlet />}
					</div>
					<Toaster richColors />
				</ThemeProvider>
				<TanstackDevtools
					config={{
						position: "bottom-left",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
