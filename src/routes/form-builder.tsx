import FormHeader from "@/components/header";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/form-builder")({
	component: FormBuilderLayout,
	// validateSearch: FormStateSearchParamsSchemaSingle,
});

function FormBuilderLayout() {
	return (
		<>
			<FormHeader />
			<Outlet />
		</>
	);
}
