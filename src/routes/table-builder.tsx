import Component485 from "@/components/comp-485";
import { ErrorBoundary } from "@/components/error-boundary";
import { NotFound } from "@/components/not-found";
import { Spinner } from "@/components/ui/spinner";
import { tableBuilderCollection } from "@/db-collections/table-builder.collections";
import useTableStore from "@/hooks/use-table-store";
import { createFileRoute } from "@tanstack/react-router";
import { createClientOnlyFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

const initializeTableStore = createClientOnlyFn(async () => {
	if (typeof window !== "undefined") {
		if (!localStorage.getItem("table-builder")) {
			tableBuilderCollection.insert([
				{
					id: 1,
					tableData: JSON.parse(localStorage.getItem("table-builder") || "[]"),
				},
			]);
		}
	} else {
		console.log("tableBuilderCollection is undefined");
	}
});

export const Route = createFileRoute("/table-builder")({
	component: RouteComponent,
	errorComponent: ErrorBoundary,
	notFoundComponent: NotFound,
	ssr: true,
});

function RouteComponent() {
	const tableBuilder = useTableStore();
	const [isTableBuilderInitialized, setIsTableBuilderInitialized] =
		useState(false);
	useEffect(() => {
		initializeTableStore();
		setIsTableBuilderInitialized(true);
	}, []);

	if (!isTableBuilderInitialized) {
		return <Spinner />;
	}
	console.log(tableBuilder);
	return (
		<div className="flex flex-col justify-center p-10 border-border border-2 m-10 items-center gap-6">
			<Component485 />
			{/* <TableBuilderHeader />
			<TableBuilder /> */}
		</div>
	);
}
