import {
	CSSProperties,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
	arrayMove,
	horizontalListSortingStrategy,
	SortableContext,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	Cell,
	Column,
	ColumnDef,
	ColumnFiltersState,
	FilterFn,
	flexRender,
	getCoreRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	Header,
	PaginationState,
	Row,
	SortingState,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";
import {
	ArrowLeftToLineIcon,
	ArrowRightToLineIcon,
	ChevronDownIcon,
	ChevronFirstIcon,
	ChevronLastIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronUpIcon,
	CircleAlertIcon,
	CircleXIcon,
	Columns3Icon,
	EllipsisIcon,
	FilterIcon,
	GripVerticalIcon,
	ListFilterIcon,
	PinOffIcon,
	PlusIcon,
	TrashIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Helper function to compute pinning styles for columns
const getPinningStyles = (column: Column<any>): CSSProperties => {
	const isPinned = column.getIsPinned();
	return {
		left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
		right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
		position: isPinned ? "sticky" : "relative",
		width: column.getSize(),
		zIndex: isPinned ? 1 : 0,
	};
};
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
} from "@/components/ui/pagination";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type Item = {
	id: string;
	name: string;
	email: string;
	location: string;
	flag: string;
	status: "Active" | "Inactive" | "Pending";
	balance: number;
};

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<Item> = (row, _columnId, filterValue) => {
	const searchableRowContent =
		`${row.original.name} ${row.original.email}`.toLowerCase();
	const searchTerm = (filterValue ?? "").toLowerCase();
	return searchableRowContent.includes(searchTerm);
};

const statusFilterFn: FilterFn<Item> = (
	row,
	columnId,
	filterValue: string[],
) => {
	if (!filterValue?.length) return true;
	const status = row.getValue(columnId) as string;
	return filterValue.includes(status);
};

const columns: ColumnDef<Item>[] = [
	{
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
	},
	{
		header: "Name",
		accessorKey: "name",
		cell: ({ row }) => (
			<div className="font-medium">{row.getValue("name")}</div>
		),
		size: 180,
		filterFn: multiColumnFilterFn,
		enableHiding: false,
	},
	{
		header: "Email",
		accessorKey: "email",
		size: 220,
	},
	{
		header: "Location",
		accessorKey: "location",
		cell: ({ row }) => (
			<div>
				<span className="text-lg leading-none">{row.original.flag}</span>{" "}
				{row.getValue("location")}
			</div>
		),
		size: 180,
	},
	{
		header: "Status",
		accessorKey: "status",
		cell: ({ row }) => (
			<Badge
				className={cn(
					row.getValue("status") === "Inactive" &&
						"bg-muted-foreground/60 text-primary-foreground",
				)}
			>
				{row.getValue("status")}
			</Badge>
		),
		size: 100,
		filterFn: statusFilterFn,
	},
	{
		header: "Performance",
		accessorKey: "performance",
	},
	{
		header: "Balance",
		accessorKey: "balance",
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("balance"));
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			}).format(amount);
			return formatted;
		},
		size: 120,
	},
	{
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
	},
];

export default function Component485() {
	const id = useId();
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const inputRef = useRef<HTMLInputElement>(null);

	const [sorting, setSorting] = useState<SortingState>([
		{
			id: "name",
			desc: false,
		},
	]);

	const [columnOrder, setColumnOrder] = useState<string[]>(
		columns.map((column) => column.id as string),
	);

	const [data, setData] = useState<Item[]>([]);
	useEffect(() => {
		async function fetchPosts() {
			const res = await fetch(
				"https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/users-01_fertyx.json",
			);
			const data = (await res.json()) as Item[];
			setData(data);
		}
		fetchPosts();
	}, []);

	const handleDeleteRows = () => {
		const selectedRows = table.getSelectedRowModel().rows;
		const updatedData = data.filter(
			(item) => !selectedRows.some((row) => row.original.id === item.id),
		);
		setData(updatedData);
		table.resetRowSelection();
	};

	const table = useReactTable({
		data,
		columns,
		columnResizeMode: "onChange",
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		enableSortingRemoval: false,
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: setPagination,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		enableColumnPinning: true,
		state: {
			sorting,
			pagination,
			columnFilters,
			columnVisibility,
			columnOrder,
		},
		onColumnOrderChange: setColumnOrder,
	});

	// reorder columns after drag & drop
	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (active && over && active.id !== over.id) {
			// Only allow reordering of draggable columns (not select or actions)
			const isActiveDraggable =
				active.id !== "select" && active.id !== "actions";
			const isOverDraggable = over.id !== "select" && over.id !== "actions";

			if (isActiveDraggable && isOverDraggable) {
				setColumnOrder((columnOrder) => {
					const oldIndex = columnOrder.indexOf(active.id as string);
					const newIndex = columnOrder.indexOf(over.id as string);
					return arrayMove(columnOrder, oldIndex, newIndex);
				});
			}
		}
	}

	const sensors = useSensors(
		useSensor(MouseSensor, {}),
		useSensor(TouchSensor, {}),
		useSensor(KeyboardSensor, {}),
	);

	// Get unique status values
	const uniqueStatusValues = useMemo(() => {
		const statusColumn = table.getColumn("status");

		if (!statusColumn) return [];

		const values = Array.from(statusColumn.getFacetedUniqueValues().keys());

		return values.sort();
	}, [table.getColumn("status")?.getFacetedUniqueValues()]);

	// Get counts for each status
	const statusCounts = useMemo(() => {
		const statusColumn = table.getColumn("status");
		if (!statusColumn) return new Map();
		return statusColumn.getFacetedUniqueValues();
	}, [table.getColumn("status")?.getFacetedUniqueValues()]);

	const selectedStatuses = useMemo(() => {
		const filterValue = table.getColumn("status")?.getFilterValue() as string[];
		return filterValue ?? [];
	}, [table.getColumn("status")?.getFilterValue()]);

	const handleStatusChange = (checked: boolean, value: string) => {
		const filterValue = table.getColumn("status")?.getFilterValue() as string[];
		const newFilterValue = filterValue ? [...filterValue] : [];

		if (checked) {
			newFilterValue.push(value);
		} else {
			const index = newFilterValue.indexOf(value);
			if (index > -1) {
				newFilterValue.splice(index, 1);
			}
		}

		table
			.getColumn("status")
			?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
	};

	return (
		<DndContext
			id={useId()}
			collisionDetection={closestCenter}
			modifiers={[restrictToHorizontalAxis]}
			onDragEnd={handleDragEnd}
			sensors={sensors}
		>
			<div className="space-y-4">
				{/* Filters */}
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div className="flex items-center gap-3">
						{/* Filter by name or email */}
						<div className="relative">
							<Input
								id={`${id}-input`}
								ref={inputRef}
								className={cn(
									"peer min-w-60 ps-9",
									Boolean(table.getColumn("name")?.getFilterValue()) && "pe-9",
								)}
								value={
									(table.getColumn("name")?.getFilterValue() ?? "") as string
								}
								onChange={(e) =>
									table.getColumn("name")?.setFilterValue(e.target.value)
								}
								placeholder="Filter by name or email..."
								type="text"
								aria-label="Filter by name or email"
							/>
							<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
								<ListFilterIcon size={16} aria-hidden="true" />
							</div>
							{Boolean(table.getColumn("name")?.getFilterValue()) && (
								<button
									className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
									aria-label="Clear filter"
									onClick={() => {
										table.getColumn("name")?.setFilterValue("");
										if (inputRef.current) {
											inputRef.current.focus();
										}
									}}
								>
									<CircleXIcon size={16} aria-hidden="true" />
								</button>
							)}
						</div>
						{/* Filter by status */}
						<Popover>
							<PopoverTrigger asChild>
								<Button variant="outline">
									<FilterIcon
										className="-ms-1 opacity-60"
										size={16}
										aria-hidden="true"
									/>
									Status
									{selectedStatuses.length > 0 && (
										<span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
											{selectedStatuses.length}
										</span>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto min-w-36 p-3" align="start">
								<div className="space-y-3">
									<div className="text-muted-foreground text-xs font-medium">
										Filters
									</div>
									<div className="space-y-3">
										{uniqueStatusValues.map((value, i) => (
											<div key={value} className="flex items-center gap-2">
												<Checkbox
													id={`${id}-${i}`}
													checked={selectedStatuses.includes(value)}
													onCheckedChange={(checked: boolean) =>
														handleStatusChange(checked, value)
													}
												/>
												<Label
													htmlFor={`${id}-${i}`}
													className="flex grow justify-between gap-2 font-normal"
												>
													{value}{" "}
													<span className="text-muted-foreground ms-2 text-xs">
														{statusCounts.get(value)}
													</span>
												</Label>
											</div>
										))}
									</div>
								</div>
							</PopoverContent>
						</Popover>
						{/* Toggle columns visibility */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline">
									<Columns3Icon
										className="-ms-1 opacity-60"
										size={16}
										aria-hidden="true"
									/>
									View
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
								{table
									.getAllColumns()
									.filter((column) => column.getCanHide())
									.map((column) => {
										return (
											<DropdownMenuCheckboxItem
												key={column.id}
												className="capitalize"
												checked={column.getIsVisible()}
												onCheckedChange={(value) =>
													column.toggleVisibility(!!value)
												}
												onSelect={(event) => event.preventDefault()}
											>
												{column.id}
											</DropdownMenuCheckboxItem>
										);
									})}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<div className="flex items-center gap-3">
						{/* Delete button */}
						{table.getSelectedRowModel().rows.length > 0 && (
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button className="ml-auto" variant="outline">
										<TrashIcon
											className="-ms-1 opacity-60"
											size={16}
											aria-hidden="true"
										/>
										Delete
										<span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
											{table.getSelectedRowModel().rows.length}
										</span>
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
										<div
											className="flex size-9 shrink-0 items-center justify-center rounded-full border"
											aria-hidden="true"
										>
											<CircleAlertIcon className="opacity-80" size={16} />
										</div>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Are you absolutely sure?
											</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone. This will permanently
												delete {table.getSelectedRowModel().rows.length}{" "}
												selected{" "}
												{table.getSelectedRowModel().rows.length === 1
													? "row"
													: "rows"}
												.
											</AlertDialogDescription>
										</AlertDialogHeader>
									</div>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction onClick={handleDeleteRows}>
											Delete
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						)}
						{/* Add user button */}
						<Button className="ml-auto" variant="outline">
							<PlusIcon
								className="-ms-1 opacity-60"
								size={16}
								aria-hidden="true"
							/>
							Add user
						</Button>
					</div>
				</div>

				{/* Table */}
				<div className="bg-background overflow-hidden rounded-md border">
					<Table
						className="[&_td]:border-border [&_th]:border-border table-fixed border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b"
						style={{
							width: table.getTotalSize(),
						}}
					>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id} className="bg-muted/50">
									<SortableContext
										items={columnOrder}
										strategy={horizontalListSortingStrategy}
									>
										{headerGroup.headers.map((header) => (
											<DraggableTableHeader key={header.id} header={header} />
										))}
									</SortableContext>
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
									>
										{row.getVisibleCells().map((cell) => (
											<SortableContext
												key={cell.id}
												items={columnOrder}
												strategy={horizontalListSortingStrategy}
											>
												<DragAlongCell key={cell.id} cell={cell} />
											</SortableContext>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>

				{/* Pagination */}
				<div className="flex items-center justify-between gap-8">
					{/* Results per page */}
					<div className="flex items-center gap-3">
						<Label htmlFor={id} className="max-sm:sr-only">
							Rows per page
						</Label>
						<Select
							value={table.getState().pagination.pageSize.toString()}
							onValueChange={(value) => {
								table.setPageSize(Number(value));
							}}
						>
							<SelectTrigger id={id} className="w-fit whitespace-nowrap">
								<SelectValue placeholder="Select number of results" />
							</SelectTrigger>
							<SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
								{[5, 10, 25, 50].map((pageSize) => (
									<SelectItem key={pageSize} value={pageSize.toString()}>
										{pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					{/* Page number information */}
					<div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
						<p
							className="text-muted-foreground text-sm whitespace-nowrap"
							aria-live="polite"
						>
							<span className="text-foreground">
								{table.getState().pagination.pageIndex *
									table.getState().pagination.pageSize +
									1}
								-
								{Math.min(
									Math.max(
										table.getState().pagination.pageIndex *
											table.getState().pagination.pageSize +
											table.getState().pagination.pageSize,
										0,
									),
									table.getRowCount(),
								)}
							</span>{" "}
							of{" "}
							<span className="text-foreground">
								{table.getRowCount().toString()}
							</span>
						</p>
					</div>

					{/* Pagination buttons */}
					<div>
						<Pagination>
							<PaginationContent>
								{/* First page button */}
								<PaginationItem>
									<Button
										size="icon"
										variant="outline"
										className="disabled:pointer-events-none disabled:opacity-50"
										onClick={() => table.firstPage()}
										disabled={!table.getCanPreviousPage()}
										aria-label="Go to first page"
									>
										<ChevronFirstIcon size={16} aria-hidden="true" />
									</Button>
								</PaginationItem>
								{/* Previous page button */}
								<PaginationItem>
									<Button
										size="icon"
										variant="outline"
										className="disabled:pointer-events-none disabled:opacity-50"
										onClick={() => table.previousPage()}
										disabled={!table.getCanPreviousPage()}
										aria-label="Go to previous page"
									>
										<ChevronLeftIcon size={16} aria-hidden="true" />
									</Button>
								</PaginationItem>
								{/* Next page button */}
								<PaginationItem>
									<Button
										size="icon"
										variant="outline"
										className="disabled:pointer-events-none disabled:opacity-50"
										onClick={() => table.nextPage()}
										disabled={!table.getCanNextPage()}
										aria-label="Go to next page"
									>
										<ChevronRightIcon size={16} aria-hidden="true" />
									</Button>
								</PaginationItem>
								{/* Last page button */}
								<PaginationItem>
									<Button
										size="icon"
										variant="outline"
										className="disabled:pointer-events-none disabled:opacity-50"
										onClick={() => table.lastPage()}
										disabled={!table.getCanNextPage()}
										aria-label="Go to last page"
									>
										<ChevronLastIcon size={16} aria-hidden="true" />
									</Button>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</div>
				</div>
				<p className="text-muted-foreground mt-4 text-center text-sm">
					Example of a more complex table made with{" "}
					<a
						className="hover:text-foreground underline"
						href="https://tanstack.com/table"
						target="_blank"
						rel="noopener noreferrer"
					>
						TanStack Table
					</a>
				</p>
			</div>
		</DndContext>
	);
}

function RowActions({ row: _row }: { row: Row<Item> }) {
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
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuItem>Move to project</DropdownMenuItem>
								<DropdownMenuItem>Move to folder</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>Advanced options</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>Share</DropdownMenuItem>
					<DropdownMenuItem>Add to favorites</DropdownMenuItem>
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

const DraggableTableHeader = ({
	header,
}: {
	header: Header<Item, unknown>;
}) => {
	// Check if this column should be draggable (not select or actions)
	const isDraggable =
		header.column.id !== "select" && header.column.id !== "actions";

	const {
		attributes,
		isDragging,
		listeners,
		setNodeRef,
		transform,
		transition,
	} = useSortable({
		id: header.column.id,
	});

	const style: CSSProperties = {
		opacity: isDragging ? 0.8 : 1,
		position: "relative",
		transform: CSS.Translate.toString(transform),
		transition,
		whiteSpace: "nowrap",
		width: header.column.getSize(),
		zIndex: isDragging ? 1 : 0,
	};

	const { column } = header;
	const isPinned = column.getIsPinned();
	const isLastLeftPinned =
		isPinned === "left" && column.getIsLastColumn("left");
	const isFirstRightPinned =
		isPinned === "right" && column.getIsFirstColumn("right");

	// For non-draggable columns (select, actions), render simple header
	if (!isDraggable) {
		return (
			<TableHead
				key={header.id}
				className="relative h-10 truncate border-t"
				style={{ width: header.column.getSize() }}
			>
				<div className="flex items-center justify-center">
					{flexRender(header.column.columnDef.header, header.getContext())}
				</div>
			</TableHead>
		);
	}

	// For draggable columns, render with full functionality
	return (
		<TableHead
			ref={setNodeRef}
			className="[&[data-pinned][data-last-col]]:border-border data-pinned:bg-muted/90 relative h-10 truncate border-t data-pinned:backdrop-blur-xs [&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=right][data-last-col=right]]:border-l"
			colSpan={header.colSpan}
			style={{ ...getPinningStyles(column), ...style }}
			data-pinned={isPinned || undefined}
			data-last-col={
				isLastLeftPinned ? "left" : isFirstRightPinned ? "right" : undefined
			}
			aria-sort={
				header.column.getIsSorted() === "asc"
					? "ascending"
					: header.column.getIsSorted() === "desc"
						? "descending"
						: "none"
			}
		>
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-0.5">
					{/* Drag handle for draggable columns */}
					{isDraggable && (
						<Button
							size="icon"
							variant="ghost"
							className="-ml-2 size-7 shadow-none"
							{...attributes}
							{...listeners}
							aria-label="Drag to reorder"
						>
							<GripVerticalIcon
								className="opacity-60"
								size={16}
								aria-hidden="true"
							/>
						</Button>
					)}
					{/* Clickable header text with sorting */}
					<div
						className={cn(
							"flex items-center gap-1 cursor-pointer select-none",
							header.column.getCanSort() &&
								"hover:bg-muted/50 rounded px-1 -mx-1",
						)}
						onClick={
							header.column.getCanSort()
								? header.column.getToggleSortingHandler()
								: undefined
						}
						onKeyDown={(e) => {
							// Enhanced keyboard handling for sorting
							if (
								header.column.getCanSort() &&
								(e.key === "Enter" || e.key === " ")
							) {
								e.preventDefault();
								header.column.getToggleSortingHandler()?.(e);
							}
						}}
						tabIndex={header.column.getCanSort() ? 0 : undefined}
					>
						<span className="truncate">
							{header.isPlaceholder
								? null
								: flexRender(
										header.column.columnDef.header,
										header.getContext(),
									)}
						</span>
						{/* Sort icon next to header text */}
						{header.column.getCanSort() && (
							<div className="shrink-0">
								{{
									asc: (
										<ChevronUpIcon
											className="opacity-60"
											size={16}
											aria-hidden="true"
										/>
									),
									desc: (
										<ChevronDownIcon
											className="opacity-60"
											size={16}
											aria-hidden="true"
										/>
									),
								}[header.column.getIsSorted() as string] ?? (
									<ChevronUpIcon
										className="opacity-0 group-hover:opacity-60"
										size={16}
										aria-hidden="true"
									/>
								)}
							</div>
						)}
					</div>
				</div>
				{/* Pin/Unpin column controls - moved to right edge */}
				{!header.isPlaceholder &&
					header.column.getCanPin() &&
					(header.column.getIsPinned() ? (
						<Button
							size="icon"
							variant="ghost"
							className="size-7 shadow-none"
							onClick={() => header.column.pin(false)}
							aria-label={`Unpin ${header.column.columnDef.header as string} column`}
							title={`Unpin ${header.column.columnDef.header as string} column`}
						>
							<PinOffIcon className="opacity-60" size={16} aria-hidden="true" />
						</Button>
					) : (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									size="icon"
									variant="ghost"
									className="size-7 shadow-none"
									aria-label={`Pin options for ${header.column.columnDef.header as string} column`}
									title={`Pin options for ${header.column.columnDef.header as string} column`}
								>
									<EllipsisIcon
										className="opacity-60"
										size={16}
										aria-hidden="true"
									/>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={() => header.column.pin("left")}>
									<ArrowLeftToLineIcon
										size={16}
										className="opacity-60"
										aria-hidden="true"
									/>
									Stick to left
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => header.column.pin("right")}>
									<ArrowRightToLineIcon
										size={16}
										className="opacity-60"
										aria-hidden="true"
									/>
									Stick to right
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					))}
			</div>
			{/* Resize handle - only for resizable columns */}
			{header.column.getCanResize() && (
				<div
					{...{
						onDoubleClick: () => header.column.resetSize(),
						onMouseDown: header.getResizeHandler(),
						onTouchStart: header.getResizeHandler(),
						className:
							"absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -right-2 z-10 flex justify-center before:absolute before:w-px before:inset-y-0 before:bg-border before:-translate-x-px",
					}}
				/>
			)}
		</TableHead>
	);
};

const DragAlongCell = ({ cell }: { cell: Cell<Item, unknown> }) => {
	// Check if this column should be draggable (not select or actions)
	const isDraggable =
		cell.column.id !== "select" && cell.column.id !== "actions";

	const { isDragging, setNodeRef, transform, transition } = useSortable({
		id: cell.column.id,
	});

	const style: CSSProperties = {
		opacity: isDragging ? 0.8 : 1,
		position: "relative",
		transform: CSS.Translate.toString(transform),
		transition,
		width: cell.column.getSize(),
		zIndex: isDragging ? 1 : 0,
	};

	const { column } = cell;
	const isPinned = column.getIsPinned();
	const isLastLeftPinned =
		isPinned === "left" && column.getIsLastColumn("left");
	const isFirstRightPinned =
		isPinned === "right" && column.getIsFirstColumn("right");

	// For non-draggable columns (select, actions), render simple cell
	if (!isDraggable) {
		return (
			<TableCell
				key={cell.id}
				className="truncate"
				style={{ width: cell.column.getSize() }}
			>
				<div className="flex items-center justify-center">
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</div>
			</TableCell>
		);
	}

	// For draggable columns, render with full functionality
	return (
		<TableCell
			ref={setNodeRef}
			className="[&[data-pinned][data-last-col]]:border-border data-pinned:bg-background/90 last:py-0 truncate data-pinned:backdrop-blur-xs [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l"
			style={{ ...getPinningStyles(column), ...style }}
			data-pinned={isPinned || undefined}
			data-last-col={
				isLastLeftPinned ? "left" : isFirstRightPinned ? "right" : undefined
			}
		>
			{flexRender(cell.column.columnDef.cell, cell.getContext())}
		</TableCell>
	);
};
