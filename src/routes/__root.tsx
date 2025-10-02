import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRouteWithContext,
	useRouterState,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

import Loader from "@/components/loader";
import NavBar from "@/components/nav-bar";
import { Toaster } from "@/components/ui/sonner";
import { settingsCollection } from "@/db-collections/settings.collections";
import DevTools from "@/integrations/tanstack-query/devtools";
import { ViteThemeProvider } from "@space-man/react-theme-animation";
import type { QueryClient } from "@tanstack/react-query";
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
	notFoundComponent: () => <div>Page not found</div>,
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

function RootDocument() {
	const isFetching = useRouterState({
		select: (s) => s.isLoading,
	});

	return (
		<html lang="en" suppressHydrationWarning className="font-sans">
			<head>
				<HeadContent />
			</head>
			<body suppressHydrationWarning={true}>
				<ViteThemeProvider
					defaultTheme="system"
					attribute="class"
					enableSystem={true}
					storageKey="theme"
				>
					<div className="max-h-screen">
						<NavBar />
						{isFetching ? <Loader /> : <Outlet />}
					</div>
					{import.meta.env.DEV && <DevTools />}
					<Toaster richColors />
				</ViteThemeProvider>
				<Scripts />
			</body>
		</html>
	);
}
