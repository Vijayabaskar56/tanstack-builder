import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/form-examples")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/form-examples"!</div>;
}
