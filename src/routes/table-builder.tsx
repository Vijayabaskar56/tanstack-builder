import { FormEdit } from "@/components/builder/form-edit";
import { ErrorBoundary } from "@/components/error-boundary";
import FileUpload from "@/components/file-upload";
import FormHeader from "@/components/header";
import { NotFound } from "@/components/not-found";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { revalidateLogic, useAppForm } from "@/components/ui/tanstack-form";
import { Textarea } from "@/components/ui/textarea";
import { tableBuilderCollection } from "@/db-collections/table-builder.collections";
import { useScreenSize } from "@/hooks/use-screen-size";
import useTableStore from "@/hooks/use-table-store";
import { cn } from "@/lib/utils";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { createClientOnlyFn } from "@tanstack/react-start";
import { Database, Settings, Upload } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import * as z from "zod";
// Utility functions for parsing data
const parseCSV = (csvText: string): any[] => {
	const lines = csvText.trim().split("\n");
	if (lines.length === 0) return [];

	const headers = lines[0].split(",").map((h) => h.trim());
	const data = lines.slice(1).map((line) => {
		const values = line.split(",");
		const obj: any = {};
		headers.forEach((header, index) => {
			obj[header] = values[index]?.trim() || "";
		});
		return obj;
	});
	return data;
};

const parseJSON = (jsonText: string): any[] => {
	const parsed = JSON.parse(jsonText);
	if (Array.isArray(parsed)) {
		return parsed;
	} else if (typeof parsed === "object") {
		return [parsed];
	}
	return [];
};

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
	ssr: false,
});

export const dataFormSchema = z.object({
	data: z.array(z.any()),
});

function RouteComponent() {
	// Sidebar width used only on md+ screens
	const [sidebarWidth, setSidebarWidth] = useState(300);
	const [isResizing, setIsResizing] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const screenSize = useScreenSize();
	const isMdUp = screenSize.greaterThanOrEqual("md");
	const tableBuilder = useTableStore();
	const id = useId();
	const dataForm = useAppForm({
		defaultValues: {
			data: [],
		} as z.input<typeof dataFormSchema>,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: dataFormSchema,
			onDynamicAsyncDebounceMs: 300,
		},
	});

	const handleFileUpload = useCallback(
		(files: any[]) => {
			const file = files[0]?.file;
			if (!file) return;

			const reader = new FileReader();
			reader.onload = (e) => {
				const text = e.target?.result as string;
				let data: any[] = [];
				try {
					if (file.type === "application/json" || file.name.endsWith(".json")) {
						data = parseJSON(text);
					} else if (file.type === "text/csv" || file.name.endsWith(".csv")) {
						data = parseCSV(text);
					}
					dataForm.setFieldValue("data", data);
				} catch (error) {
					console.error("Error parsing file:", error);
				}
			};
			reader.readAsText(file);
		},
		[dataForm],
	);

	const [isTableBuilderInitialized, setIsTableBuilderInitialized] =
		useState(false);
	useEffect(() => {
		initializeTableStore();
		setIsTableBuilderInitialized(true);
	}, []);
	// On breakpoint changes, set sensible defaults:
	// - tablet/mobile (<md): collapse to min (200px)
	// - laptop/desktop (>=md): default to 1/3 of available width
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		const containerRect = container.getBoundingClientRect();
		const minWidth = 200;
		if (!isMdUp) {
			setSidebarWidth(minWidth);
		} else {
			const oneThird = Math.floor(containerRect.width * 0.25);
			setSidebarWidth(Math.max(minWidth, oneThird));
		}
	}, [isMdUp]);

	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		setIsResizing(true);
		e.preventDefault();
	}, []);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isResizing || !containerRef.current || !isMdUp) return;

			const containerRect = containerRef.current.getBoundingClientRect();
			const newWidth = e.clientX - containerRect.left;
			const minWidth = 200;
			const maxWidth = containerRect.width * 0.33; // Maximum 1/3 of screen width

			setSidebarWidth(Math.min(Math.max(newWidth, minWidth), maxWidth));
		},
		[isResizing, isMdUp],
	);

	const handleMouseUp = useCallback(() => {
		setIsResizing(false);
	}, []);

	// Add event listeners for mouse move and up
	useEffect(() => {
		if (isResizing && isMdUp) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
			document.body.style.cursor = "col-resize";
			document.body.style.userSelect = "none";

			return () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
				document.body.style.cursor = "";
				document.body.style.userSelect = "";
			};
		}
	}, [isResizing, isMdUp, handleMouseMove, handleMouseUp]);

	if (!isTableBuilderInitialized) {
		return <Spinner />;
	}
	console.log(tableBuilder);
	return (
		<main className="w-full h-full flex flex-col">
			{isMdUp ? (
				<div
					ref={containerRef}
					className="flex w-full flex-1 min-h-0 min-w-0 flex-col md:flex-row"
				>
					{/* Left Sidebar */}
					<div
						className="flex-shrink-0 border-b md:border-b-0 md:border-r p-2"
						style={isMdUp ? { width: `${sidebarWidth}px` } : { width: "100%" }}
					>
						{isMdUp ? (
							<ScrollArea className="h-full">
								{/* Upload Data Section */}
								<div className="flex flex-col gap-4">
									<FileUpload onFilesAdded={handleFileUpload} />
									<div className="text-center">or Past CSV or JSON Data</div>
									{/* Global Settings Section */}
									{/* TODO: */}
									{/* Row Level Settings Section */}
									<FormEdit />
								</div>
							</ScrollArea>
						) : (
							<div>
								{/* Upload Data Section */}
								<dataForm.AppForm>
									<dataForm.Form>
										<dataForm.AppField name={"data"}>
											{(field) => (
												<field.FieldSet className="w-full">
													<field.Field>
														<field.FieldLabel htmlFor={"data"}>
															Textarea *
														</field.FieldLabel>
														<FileUpload onFilesAdded={handleFileUpload} />
														<field.FieldDescription>
															A multi-line text input field
														</field.FieldDescription>
													</field.Field>
													<field.FieldError />
												</field.FieldSet>
											)}
										</dataForm.AppField>
									</dataForm.Form>
								</dataForm.AppForm>
								<dataForm.AppForm>
									<dataForm.Form>
										<dataForm.AppField name={"data"}>
											{(field) => (
												<field.FieldSet className="w-full">
													<field.Field>
														<field.FieldLabel htmlFor={"data"}>
															Textarea *
														</field.FieldLabel>
														<Textarea />
														<div className="*:not-first:mt-2">
															<Textarea
																placeholder="Enter your text"
																onBlur={field.handleBlur}
																aria-invalid={!!field.state.meta.errors.length}
																required={true}
																disabled={false}
																value={field.state.value}
																name={"data"}
																// onChange={(e) => field.handleChange()}
																className="field-sizing-content max-h-29.5 min-h-0 resize-none py-1.75"
															/>
														</div>
														<field.FieldDescription>
															A multi-line text input field
														</field.FieldDescription>
													</field.Field>
													<field.FieldError />
												</field.FieldSet>
											)}
										</dataForm.AppField>
									</dataForm.Form>
								</dataForm.AppForm>
								{/* Global Settings Section */}
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="flex items-center gap-2 text-sm">
											<Settings className="h-4 w-4" />
											Global Settings
										</CardTitle>
									</CardHeader>
									<CardContent className="pt-0">
										<div className="space-y-3">
											<div className="space-y-2">
												<label className="text-xs font-medium">
													Table Name
												</label>
												<input
													type="text"
													placeholder="Enter table name"
													className="w-full px-2 py-1 text-xs border rounded"
												/>
											</div>
											<div className="space-y-2">
												<label className="text-xs font-medium">
													Description
												</label>
												<textarea
													placeholder="Enter description"
													className="w-full px-2 py-1 text-xs border rounded resize-none"
													rows={2}
												/>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Row Level Settings Section */}
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="flex items-center gap-2 text-sm">
											<Database className="h-4 w-4" />
											Row Level Settings
										</CardTitle>
									</CardHeader>
									<CardContent className="pt-0">
										<div className="space-y-3">
											<div className="space-y-2">
												<label className="text-xs font-medium">
													Row Height
												</label>
												<select className="w-full px-2 py-1 text-xs border rounded">
													<option>Compact</option>
													<option>Normal</option>
													<option>Comfortable</option>
												</select>
											</div>
											<div className="space-y-2">
												<label className="text-xs font-medium">
													Selection Mode
												</label>
												<select className="w-full px-2 py-1 text-xs border rounded">
													<option>Single</option>
													<option>Multiple</option>
													<option>None</option>
												</select>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						)}
					</div>

					{/* Resize Handle (desktop/tablet only) */}
					{isMdUp && (
						<div
							className={cn(
								"w-1 bg-border/70 hover:bg-primary/30 active:bg-primary/40 cursor-col-resize flex-shrink-0 transition-colors relative group touch-pan-y select-none",
								isResizing && "bg-primary/30",
							)}
							aria-label="Resize sidebar"
							role="separator"
							onMouseDown={handleMouseDown}
							onTouchStart={(e) => {
								// Allow touch dragging on larger touch devices
								setIsResizing(true);
								e.preventDefault();
							}}
						>
							{/* <div className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-1"> */}
							{/* <span className="h-6 w-0.5 rounded bg-muted-foreground/50 group-hover:bg-primary/70" /> */}
							{/* <span className="h-6 w-0.5 rounded bg-muted-foreground/50 group-hover:bg-primary/70" /> */}
							{/* <span className="h-6 w-0.5 rounded bg-muted-foreground/50 group-hover:bg-primary/70" /> */}
							{/* </div> */}
						</div>
					)}

					<div className="flex-1 flex min-h-0 min-w-0 flex-col">
						<FormHeader />
						{isMdUp ? (
							<ScrollArea className="flex-1 min-h-0 min-w-0">
								<Outlet />
							</ScrollArea>
						) : (
							<div>
								<Outlet />
							</div>
						)}
					</div>
				</div>
			) : (
				<ScrollArea className="flex-1 min-h-0">
					<div
						ref={containerRef}
						className="flex w-full flex-1 min-h-0 flex-col md:flex-row"
					>
						{/* Left Sidebar */}
						<div
							className="flex-shrink-0 border-b md:border-b-0 md:border-r bg-muted/30"
							style={
								isMdUp ? { width: `${sidebarWidth}px` } : { width: "100%" }
							}
						>
							<div>
								{/* Upload Data Section */}
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="flex items-center gap-2 text-sm">
											<Upload className="h-4 w-4" />
											Upload Data
										</CardTitle>
									</CardHeader>
									<CardContent className="pt-0">
										<div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
											<Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
											<p className="text-sm text-muted-foreground">
												Drag and drop your data file here
											</p>
										</div>
									</CardContent>
								</Card>

								{/* Global Settings Section */}
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="flex items-center gap-2 text-sm">
											<Settings className="h-4 w-4" />
											Global Settings
										</CardTitle>
									</CardHeader>
									<CardContent className="pt-0">
										<div className="space-y-3">
											<div className="space-y-2">
												<label className="text-xs font-medium">
													Table Name
												</label>
												<input
													type="text"
													placeholder="Enter table name"
													className="w-full px-2 py-1 text-xs border rounded"
												/>
											</div>
											<div className="space-y-2">
												<label className="text-xs font-medium">
													Description
												</label>
												<textarea
													placeholder="Enter description"
													className="w-full px-2 py-1 text-xs border rounded resize-none"
													rows={2}
												/>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Row Level Settings Section */}
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="flex items-center gap-2 text-sm">
											<Database className="h-4 w-4" />
											Row Level Settings
										</CardTitle>
									</CardHeader>
									<CardContent className="pt-0">
										<div className="space-y-3">
											<div className="space-y-2">
												<label className="text-xs font-medium">
													Row Height
												</label>
												<select className="w-full px-2 py-1 text-xs border rounded">
													<option>Compact</option>
													<option>Normal</option>
													<option>Comfortable</option>
												</select>
											</div>
											<div className="space-y-2">
												<label className="text-xs font-medium">
													Selection Mode
												</label>
												<select className="w-full px-2 py-1 text-xs border rounded">
													<option>Single</option>
													<option>Multiple</option>
													<option>None</option>
												</select>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>

						{/* Content area */}
						<div className="flex-1 flex min-h-0 flex-col">
							<FormHeader />
							<div>
								<Outlet />
							</div>
						</div>
					</div>
				</ScrollArea>
			)}
		</main>
	);
}
