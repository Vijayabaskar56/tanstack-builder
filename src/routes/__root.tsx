import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
	useRouterState,
} from "@tanstack/react-router";
import { ErrorBoundary } from "@/components/error-boundary";
import Loader from "@/components/loader";
import NavBar from "@/components/nav-bar";
import { NotFound } from "@/components/not-found";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import DevTools from "@/integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		title: "TanStack Form Builder",
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				name: "description",
				content:
					"Help you Quickly Scaffold a Form for your TanStack Using TanStack Forms",
			},
			// Open Graph meta tags
			{ property: "og:title", content: "TanStack Form Builder" },
			{
				property: "og:description",
				content:
					"Help you Quickly Scaffold a Form for your TanStack Using TanStack Forms",
			},
			{ property: "og:type", content: "website" },
			{ property: "og:image", content: "/assets/og-image.png" },
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{
				property: "og:image:alt",
				content: "TanStack Form Builder - Visual Form Builder for React",
			},
			{ property: "og:url", content: "https://tan-form-builder.baskar.dev/" },
			{ property: "og:site_name", content: "TanStack Form Builder" },
			// Twitter Card meta tags
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: "TanStack Form Builder" },
			{
				name: "twitter:description",
				content:
					"Help you Quickly Scaffold a Form for your TanStack Using TanStack Forms",
			},
			{ name: "twitter:image", content: "/assets/og-image.png" },
			{
				name: "twitter:image:alt",
				content: "TanStack Form Builder - Visual Form Builder for React",
			},
			{ name: "twitter:url", content: "https://tan-form-builder.baskar.dev/" },
			{ name: "twitter:site", content: "@vijayabaskar56" },
			{ name: "twitter:creator", content: "@vijayabaskar56" },
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
	errorComponent: ErrorBoundary,
	notFoundComponent: NotFound,
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
				<ThemeProvider
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
				</ThemeProvider>
				<Scripts />
			</body>
		</html>
	);
}
