import { Clock, FileStack, SquareStack, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { templates } from "@/constants/templates";
import { useFormStore } from "@/hooks/use-form-store";

const formTemplates = Object.entries(templates).map((template) => ({
	label: template[1].name,
	value: template[0],
	isMS: template[1].template.some((el) => Object.hasOwn(el, "stepFields")),
}));

export function TemplateSidebar() {
	const [searchQuery, _setSearchQuery] = useState("");
	const [savedForms, setSavedForms] = useState<
		Array<{ name: string; data: Record<string, unknown>; createdAt: string }>
	>([]);
	const { actions } = useFormStore();

	// Load saved forms on component mount
	useEffect(() => {
		setSavedForms(actions.getSavedForms());
	}, [actions]);

	const handleLoadSavedForm = (formName: string) => {
		actions.loadForm(formName);
		// Refresh the saved forms list after loading
		setSavedForms(actions.getSavedForms());
	};

	const handleDeleteSavedForm = (formName: string) => {
		actions.deleteSavedForm(formName);
		setSavedForms(actions.getSavedForms());
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString();
	};

	const filteredTemplates = searchQuery
		? formTemplates.filter((template) =>
				template.label.toLowerCase().includes(searchQuery.toLowerCase()),
			)
		: formTemplates;

	return (
		<div className="flex flex-col h-full md:h-full max-h-[35vh] md:max-h-none">
			<div className="mb-4 pb-2 px-4 border-b">
				<h3 className="text-lg font-semibold text-primary">Template</h3>
				<p className="text-sm text-muted-foreground">Predefined Template's</p>
			</div>
			<ScrollArea className="flex-1 overflow-auto max-h-[calc(35vh-8rem)] md:max-h-none">
				<div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
					{/* Built-in Templates */}
					{filteredTemplates.length > 0 && (
						<div>
							<h3 className="text-sm font-medium text-muted-foreground mb-2">
								Templates
							</h3>
							<div className="space-y-2">
								{filteredTemplates.map(({ label, value, isMS }) => (
									<div
										key={label}
										className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-2"
									>
										<Button
											onClick={() => actions.setTemplate(value)}
											className="justify-start text-[12px]"
											variant="ghost"
										>
											{isMS ? (
												<SquareStack className="size-4" />
											) : (
												<FileStack className="size-4" />
											)}
											{label}
										</Button>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Saved Forms */}
					{savedForms.length > 0 && (
						<div>
							<h3 className="text-sm font-medium text-muted-foreground mb-2">
								Saved Forms
							</h3>
							<div className="space-y-2">
								{savedForms.map((savedForm) => (
									<div
										key={savedForm.name}
										className="flex items-center justify-between gap-2 p-2 rounded-md border bg-card hover:bg-accent transition-colors"
									>
										<Button
											onClick={() => handleLoadSavedForm(savedForm.name)}
											className="flex-1 justify-start text-[12px] h-auto p-2"
											variant="ghost"
										>
											<div className="flex items-center gap-2">
												<Clock className="size-3 text-muted-foreground" />
												<div className="text-left">
													<div className="font-medium">{savedForm.name}</div>
													<div className="text-xs text-muted-foreground">
														{formatDate(savedForm.createdAt)}
													</div>
												</div>
											</div>
										</Button>
										<Button
											onClick={() => handleDeleteSavedForm(savedForm.name)}
											size="sm"
											variant="ghost"
											className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
										>
											<Trash2 className="size-3" />
										</Button>
									</div>
								))}
							</div>
						</div>
					)}

					{/* No results message */}
					{filteredTemplates.length === 0 &&
						savedForms.length === 0 &&
						searchQuery && (
							<div className="text-sm text-muted-foreground p-3">
								No templates or saved forms match your query
							</div>
						)}

					{/* Empty state when no saved forms */}
					{filteredTemplates.length === 0 &&
						savedForms.length === 0 &&
						!searchQuery && (
							<div className="text-sm text-muted-foreground p-3">
								No saved forms yet. Save a form to see it here.
							</div>
						)}
				</div>
			</ScrollArea>
		</div>
	);
}
