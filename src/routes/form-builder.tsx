// form-builder.tsx
import FormHeader from "@/components/header";
import type { FormElementsSchema } from "@/lib/search-schema";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import type * as v from "valibot";
import { ErrorBoundary } from "@/components/error-boundary";
import { NotFound } from "@/components/not-found";

export const Route = createFileRoute("/form-builder")({
	component: FormBuilderLayout,
	preload: false,
	ssr: false,
	errorComponent: ErrorBoundary,
	notFoundComponent: NotFound,
	loader: ({
		location,
	}): v.InferOutput<typeof FormElementsSchema> | undefined => {
		if (location?.search?.share) {
			localStorage.setItem("share", JSON.stringify(location.search.share));
			throw redirect({
				to: "/form-builder",
			});
		}
		return undefined;
	},
});

function FormBuilderLayout() {
	return (
		<>
			<FormHeader />
			<Outlet />
		</>
	);
}
