import FormHeader from "@/components/header";
import {
	FormElementsSchema
} from "@/lib/search-schema";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";

export const Route = createFileRoute("/form-builder")({
	component: FormBuilderLayout,
	validateSearch: v.object({
		share: v.optional(FormElementsSchema)
	}),
	loader: ({location}) : v.InferOutput<typeof FormElementsSchema> | undefined => {
		if (location?.search?.share) {
			return location.search.share;
		}
	}
});

function FormBuilderLayout() {
	const state = Route.useLoaderData()
	if (state) {
		// actions.resetFormElements();
		// actions.batchAppendElements(state.share?.formElements as any)
	}
	return (
		<>
			<FormHeader />
			<Outlet />
		</>
	);
}
