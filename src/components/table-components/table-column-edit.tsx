import { tableBuilderCollection } from "@/db-collections/table-builder.collections";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DeleteIcon } from "@/components/ui/delete";
import { LucideGripVertical } from "lucide-react";
import { Reorder } from "motion/react";
import { useState, useEffect } from "react";
import useTableStore from "@/hooks/use-table-store";
import type { TableBuilder } from "@/db-collections/table-builder.collections";

export function TableColumnEdit() {
	const [localColumns, setLocalColumns] = useState<
		TableBuilder["table"]["columns"]
	>([]);

	// Get the current table data using the store
	const tableData = useTableStore();

	useEffect(() => {
		if (tableData) {
			setLocalColumns(tableData.table.columns);
		}
	}, [tableData]);

	if (!tableData) {
		return <div>No table data found</div>;
	}

	const columns = tableData.table.columns;

	const updateColumn = (
		columnId: string,
		updates: Partial<(typeof columns)[0]>,
	) => {
		tableBuilderCollection.update(1, (draft) => {
			const columnIndex = draft.table.columns.findIndex(
				(col) => col.id === columnId,
			);
			if (columnIndex !== -1) {
				draft.table.columns[columnIndex] = {
					...draft.table.columns[columnIndex],
					...updates,
				};
			}
		});
	};

	const reorderColumns = (newOrder: typeof columns) => {
		// Update order property for each column
		const reorderedColumns = newOrder.map((col, index) => ({
			...col,
			order: index,
		}));

		tableBuilderCollection.update(1, (draft) => {
			draft.table.columns = reorderedColumns;
		});
		setLocalColumns(reorderedColumns);
	};

	const deleteColumn = (columnId: string) => {
		tableBuilderCollection.update(1, (draft) => {
			draft.table.columns = draft.table.columns.filter(
				(col) => col.id !== columnId,
			);
		});
	};

	return (
		<div className="w-full space-y-4">
			<div className="flex items-center justify-between">
				<Label className="text-sm font-medium">Table Columns</Label>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => {
						const newColumn = {
							id: `column_${Date.now()}`,
							accessor: `accessor_${Date.now()}`,
							label: `Column ${columns.length + 1}`,
							type: "string" as const,
							order: columns.length,
							hasDateFilter: false,
							hasSliderFilter: false,
						};

						tableBuilderCollection.update(1, (draft) => {
							draft.table.columns.push(newColumn);
						});
					}}
					className="h-8 px-2"
				>
					Add Column
				</Button>
			</div>

			<div className="space-y-2 max-h-96 overflow-y-auto">
				<Reorder.Group
					axis="y"
					onReorder={reorderColumns}
					values={localColumns}
					className="space-y-2"
				>
					{localColumns.map((column) => (
						<Reorder.Item
							key={column.id}
							value={column}
							className="flex items-center gap-2 py-2 pr-2 pl-4 border rounded-md cursor-grab active:cursor-grabbing group bg-secondary"
						>
							<LucideGripVertical
								size={20}
								className="dark:text-muted-foreground text-muted-foreground"
							/>
							<div className="flex-1 space-y-2">
								<div className="flex gap-2">
									<div className="flex-1">
										<Label className="text-xs text-muted-foreground">
											Column Name
										</Label>
										<Input
											value={column.label}
											onChange={(e) => {
												updateColumn(column.id, { label: e.target.value });
											}}
											placeholder="Column name"
											className="h-8 text-sm"
										/>
									</div>
								</div>
							</div>
							<div className="flex gap-1 lg:opacity-0 opacity-100 group-hover:opacity-100 duration-200">
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => deleteColumn(column.id)}
									className="size-8"
								>
									<DeleteIcon className="size-4" />
								</Button>
							</div>
						</Reorder.Item>
					))}
				</Reorder.Group>

				{columns.length === 0 && (
					<div className="text-center py-4 text-sm text-muted-foreground border-2 border-dashed rounded-md">
						No columns added yet. Click "Add Column" to get started.
					</div>
				)}
			</div>
		</div>
	);
}
