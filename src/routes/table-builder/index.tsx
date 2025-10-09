import Component485 from "@/components/comp-485";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/table-builder/")({
	component: RouteComponent,
	ssr: false,
});

function RouteComponent() {
	return (
		<div className="m-6">
		<Component485 />
		</div>
	);
}
