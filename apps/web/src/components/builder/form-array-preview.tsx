// form-array-preview.tsx

import { Plus, Trash2 } from "lucide-react";
import { RenderFormElement } from "@/components/builder/render-form-element";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { FormArray, FormElement, FormElementOrList } from "@/form-types";
import type { AppForm } from "@/hooks/use-form-builder";
import { useFormStore } from "@/hooks/use-form-store";

interface FormArrayPreviewProps {
	formArray: FormArray;
	form: AppForm;
	index: number;
}

export function FormArrayPreview({ formArray, form }: FormArrayPreviewProps) {
	const { actions, formElements } = useFormStore();

	// Get the latest FormArray from the store to ensure reactivity
	const currentFormArray = formElements.find((el: any) =>
		typeof el === 'object' && el !== null && 'arrayField' in el && el.id === formArray.id
	) as FormArray | undefined;

	const arrayToUse = currentFormArray || formArray;

	const handleAddEntry = () => {
		actions.addFormArrayEntry(arrayToUse.id);
	};

	const handleRemoveEntry = (entryId: string) => {
		actions.removeFormArrayEntry(arrayToUse.id, entryId);
	};

	return (
  <div className="w-full space-y-4">
				<div className="space-y-3">
					{arrayToUse.entries.map((entry) => (
    <>
			<Separator />
						<div className={`space-y-3 p-4 relative`} key={entry.id}>
							{entry.fields.map((element: FormElementOrList) => {
								if (Array.isArray(element)) {
									return (
										<div
											key={`array-${element.map((el) => el.id).join("-")}`}
											className="flex items-start flex-wrap sm:flex-nowrap w-full gap-2"
										>
											{element.map((el: FormElement) => (
												<div key={el.id} className="flex-1 min-w-0">
													<RenderFormElement formElement={el} form={form} />
												</div>
											))}
										</div>
									);
								}
								return (
									<div key={element.id} className="w-full">
										<RenderFormElement formElement={element} form={form} />
									</div>
								);
							})}
						</div>
     </>
					))}
				</div>
				<div className="flex justify-between pt-2">
					<Button
						variant="outline"
						type="button"
      onClick={handleAddEntry}
						disabled={arrayToUse.arrayField.length === 0}
					>
						<Plus className="h-4 w-4 mr-2" />
						Add
					</Button>
     <Button
      type="button"
						variant="outline"
      onClick={() => handleRemoveEntry(formArray.entries[formArray.entries.length - 1].id)}
						disabled={formArray.entries.length === 1}
					>
						<Trash2 className="h-4 w-4 mr-2" />
						Remove
					</Button>
				</div>
			</div>
	);
}
