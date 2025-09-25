import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/form-builder/share")({
	component: RouteComponent
});

function RouteComponent() {
	console.log(window.self);
	return <div>Hello "/form-builder/share"!</div>;
}
