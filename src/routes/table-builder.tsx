import { createFileRoute } from "@tanstack/react-router";
import { ErrorBoundary } from "@/components/error-boundary";
import { NotFound } from "@/components/not-found";

export const Route = createFileRoute("/table-builder")({
	component: RouteComponent,
	errorComponent: ErrorBoundary,
	notFoundComponent: NotFound,
});

function RouteComponent() {
	return <div>Hello "/table-builder"!</div>;
}
