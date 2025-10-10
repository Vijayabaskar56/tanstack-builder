import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuShortcut,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon } from "lucide-react";
import type { ColumnConfig, JsonData } from "@/types/table-types";

interface ColumnSettings {
	enableSorting?: boolean;
	enableHiding?: boolean;
	enableResizing?: boolean;
	enablePinning?: boolean;
	enableColumnFilter?: boolean;
	enableGlobalFilter?: boolean;
}

// Row actions component
function RowActions({ row }: { row: any }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className="flex justify-end">
					<Button
						size="icon"
						variant="ghost"
						className="shadow-none"
						aria-label="Edit item"
					>
						<EllipsisIcon size={16} aria-hidden="true" />
					</Button>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<span>Edit</span>
						<DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<span>Duplicate</span>
						<DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<span>Archive</span>
						<DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="text-destructive focus:text-destructive">
					<span>Delete</span>
					<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

// Generate cell content based on column type
function renderCell(value: any, type: ColumnConfig["type"]) {
	switch (type) {
		case "string":
			return <div className="font-medium">{String(value || "")}</div>;
		case "number":
			return (
				<div>
					{typeof value === "number"
						? value.toLocaleString()
						: String(value || "")}
				</div>
			);
		case "boolean":
			return (
				<Badge variant={value ? "default" : "secondary"}>
					{value ? "Yes" : "No"}
				</Badge>
			);
		case "date":
			if (value) {
				const date = new Date(value);
				return <div>{date.toLocaleDateString()}</div>;
			}
			return <div></div>;
		case "object":
			return (
				<div className="text-xs text-muted-foreground">
					{value ? JSON.stringify(value) : ""}
				</div>
			);
		default:
			return <div>{String(value || "")}</div>;
	}
}

export function generateColumns(
	columns: ColumnConfig[],
	settings?: ColumnSettings,
): ColumnDef<JsonData>[] {
	const generatedColumns: ColumnDef<JsonData>[] = columns.map((col) => ({
		id: col.id,
		accessorKey: col.accessor,
		header: col.label,
		cell: ({ row }) => renderCell(row.getValue(col.accessor), col.type),
		size: 180, // Default size, can be customized
		enableSorting: settings?.enableSorting ?? true,
		enableHiding: settings?.enableHiding ?? true,
		enableResizing: settings?.enableResizing ?? true,
		enablePinning: settings?.enablePinning ?? true,
		enableColumnFilter: settings?.enableColumnFilter ?? true,
		enableGlobalFilter: settings?.enableGlobalFilter ?? true,
	}));

	// Add select column
	const selectColumn: ColumnDef<JsonData> = {
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		size: 28,
		enableSorting: false,
		enableHiding: false,
		enableResizing: false,
		enablePinning: false,
		enableColumnFilter: false,
		enableGlobalFilter: false,
	};

	// Add actions column
	const actionsColumn: ColumnDef<JsonData> = {
		id: "actions",
		header: () => <span className="sr-only">Actions</span>,
		cell: ({ row }) => <RowActions row={row} />,
		size: 60,
		enableHiding: false,
		enableSorting: false,
		enableResizing: false,
		enablePinning: false,
		enableColumnFilter: false,
		enableGlobalFilter: false,
	};

	return [selectColumn, ...generatedColumns, actionsColumn];
}



export const detectColumnType = (
	value: string | number | boolean | null | undefined | object,
): ColumnConfig["type"] => {
	if (value === null || value === undefined) return "string";
	if (typeof value === "boolean") return "boolean";
	if (typeof value === "number") return "number";
	if (typeof value === "object") return "object";
	if (typeof value === "string") {
		// Try to detect dates
		const dateRegex =
			/^\d{4}-\d{2}-\d{2}|^\d{2}\/\d{2}\/\d{4}|^\d{2}-\d{2}-\d{4}/;
		if (dateRegex.test(value) && !isNaN(Date.parse(value))) {
			return "date";
		}
	}
	return "string";
};

export const detectColumns = (data: JsonData[]) => {
	if (data.length === 0) return [];

	const firstRow = data[0];
	const detectedColumns: ColumnConfig[] = [];

	Object.keys(firstRow).forEach((key, index) => {
		// Sample a few rows to get better type detection
		const sampleValues = data
			.slice(0, Math.min(5, data.length))
			.map((row) => row[key]);
		const types = sampleValues.map(detectColumnType);
		const mostCommonType = types.reduce((a, b, _, arr) =>
			arr.filter((v) => v === a).length >= arr.filter((v) => v === b).length
				? a
				: b,
		);

		detectedColumns.push({
			id: key,
			accessor: key,
			label:
				key.charAt(0).toUpperCase() +
				key
					.slice(1)
					.replace(/([A-Z])/g, " $1")
					.trim(),
			type: mostCommonType,
			order: index,
			hasDateFilter: false, // Default value for hasDateFilter
			hasSliderFilter: false, // Default value for hasSliderFilter
		});
	});

	return detectedColumns.sort((a, b) => a.order - b.order);
};
