// form-array-preview.tsx

import { Plus, Trash2 } from "lucide-react";
import { RenderFormElement } from "@/components/builder/render-form-element";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { FormArray } from "@/form-types";
import type { AppForm } from "@/hooks/use-form-builder";
import { useState } from "react";

interface FormArrayPreviewProps {
	formArray: FormArray;
	form: AppForm;
	index: number;
}

export function FormArrayPreview({
	formArray,
	form,
	index,
}: FormArrayPreviewProps) {
	const [entries, setEntries] = useState<any[]>([]);

	const handleAddEntry = () => {
		// Create a new entry with all the fields from arrayField
		const newEntry = formArray.arrayField.map((field: any) => ({
			...field,
			name: `${field.name}_${entries.length}`, // Make names unique for each entry
		}));
		setEntries([...entries, newEntry]);
	};

	const handleRemoveEntry = (entryIndex: number) => {
		setEntries(entries.filter((_, i) => i !== entryIndex));
	};

	return (
		<div className="w-full space-y-4">
			{/* FormArray Header */}
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-medium">Form Array</h3>
			</div>

			{/* Template Fields Display */}
			{formArray.arrayField.length > 0 && (
				<Card className="border-dashed">
					<CardContent className="p-4">
						<div className="text-sm text-muted-foreground mb-2">Template Fields:</div>
						<div className="space-y-2">
							{formArray.arrayField.map((element: any, i: number) => {
								if (Array.isArray(element)) {
									return (
										<div
											key={i}
											className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2 p-2 bg-muted/50 rounded"
										>
											{element.map((el: any, ii: number) => (
												<div key={el.name + ii} className="w-full text-sm">
													{el.label || el.name} ({el.fieldType})
												</div>
											))}
										</div>
									);
								}
								return (
									<div key={element.name + i} className="p-2 bg-muted/50 rounded text-sm">
										{element.label || element.name} ({element.fieldType})
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Dynamic Entries */}
			<div className="space-y-3">
				{entries.map((entry, entryIndex) => (
					<Card key={entryIndex} className="border-l-4 border-l-primary">
						<CardContent className="p-4">
							<div className="flex items-center justify-between mb-3">
								<span className="text-sm font-medium">Entry {entryIndex + 1}</span>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleRemoveEntry(entryIndex)}
									className="text-destructive hover:text-destructive h-6 w-6 p-0"
								>
									<Trash2 className="h-3 w-3" />
								</Button>
							</div>
							<div className="space-y-3">
								{entry.map((element: any, i: number) => {
									if (Array.isArray(element)) {
										return (
											<div
												key={i}
												className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2"
											>
												{element.map((el: any, ii: number) => (
													<div key={el.name + ii} className="w-full">
														<RenderFormElement formElement={el} form={form} />
													</div>
												))}
											</div>
										);
									}
									return (
										<div key={element.name + i} className="w-full">
											<RenderFormElement formElement={element} form={form} />
										</div>
									);
								})}
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Add Entry Button */}
			<div className="flex justify-center pt-2">
				<Button
					variant="outline"
					onClick={handleAddEntry}
					disabled={formArray.arrayField.length === 0}
				>
					<Plus className="h-4 w-4 mr-2" />
					Add Entry
				</Button>
			</div>

			{/* Empty State */}
			{formArray.arrayField.length === 0 && (
				<div className="text-center py-8 text-muted-foreground">
					<p className="text-sm">No template fields defined</p>
					<p className="text-xs mt-1">Add fields to the FormArray in edit mode first</p>
				</div>
			)}
		</div>
	);
}
