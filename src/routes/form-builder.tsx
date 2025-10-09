import { ErrorBoundary } from "@/components/error-boundary";
import FormHeader from "@/components/header";
import { NotFound } from "@/components/not-found";
import { Spinner } from "@/components/ui/spinner";
import { settingsCollection } from "@/db-collections/settings.collections";
import type { FormElementsSchema } from "@/lib/search-schema";
import { logger } from "@/lib/utils";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type * as v from "valibot";

export const Route = createFileRoute("/form-builder")({
	component: FormBuilderLayout,
	errorComponent: ErrorBoundary,
	notFoundComponent: NotFound,
	ssr: true,
	loader: ({
		location,
	}): v.InferOutput<typeof FormElementsSchema> | undefined => {
		if ((location?.search as any)?.share) {
			localStorage.setItem(
				"share",
				JSON.stringify((location.search as any).share),
			);
			throw redirect({
				to: "/form-builder",
			});
		}
		return undefined;
	},
});

function FormBuilderLayout() {
	const [isSettingsInitialized, setIsSettingsInitialized] = useState(false);

	useEffect(() => {
		const initializeSettings = async () => {
			if (typeof window !== "undefined") {
				logger("settingsCollection", settingsCollection);
				if (!settingsCollection.has("user-settings")) {
					logger("inserting settings");
					await settingsCollection?.insert([
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
				setIsSettingsInitialized(true);
			} else {
				logger("settingsCollection is undefined");
				setIsSettingsInitialized(true);
			}
		};

		initializeSettings();
	}, []);

	// Don't render the header until settings are initialized
	if (!isSettingsInitialized) {
		return <Spinner />;
	}

	return (
		<>
			<FormHeader />
			<Outlet />
		</>
	);
}
