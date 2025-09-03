//form-preview.tsx
/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
import { FormArrayPreview } from "@/components/builder/form-array-preview";
import { MultiStepFormPreview } from "@/components/builder/multi-step-preview";
import { RenderFormElement } from "@/components/builder/render-form-element";
import { Button } from "@/components/ui/button";

import type { FormArray, FormStep } from "@/form-types";
import type { AppForm } from "@/hooks/use-form-builder";
import { useFormBuilder } from "@/hooks/use-form-builder";
import { useFormStore, useIsMultiStep } from "@/hooks/use-form-store";

interface FormPreviewProps {
	form: AppForm;
}

export function SingleStepFormPreview({ form }: FormPreviewProps) {
	const { onSubmit } = useFormBuilder();
	const { formElements } = useFormStore();
	const isMS = useIsMultiStep();
	if (formElements.length < 1)
		return (
			<div className="h-full py-10 px-3">
				<p className="text-center text-lg text-balance font-medium">
					Nothing to preview. Add form elements to preview
				</p>
			</div>
		);
  return (
		<div className="w-full animate-in rounded-md">
			<form.AppForm>
				<form
					id="previewForm"
					noValidate
					onSubmit={async (e) => {
						e.preventDefault();
						if (!isMS) {
							await form.handleSubmit();
							const formData = form.baseStore.state.values;
							await onSubmit(formData);
						}
					}}
					className="flex flex-col p-2 md:px-5 w-full gap-4"
				>
					{isMS ? (
						<>
							{console.log("this is working")}
							<MultiStepFormPreview
								formElements={formElements as unknown as FormStep[]}
								form={form}
							/>
						</>
					) : (
						(formElements as any[]).map((element, i) => {
							// Check if element is a FormArray
							if (
								typeof element === "object" &&
								element !== null &&
								"arrayField" in element
							) {
								return (
									<div key={(element as any).id + i} className="w-full">
										<FormArrayPreview
											formArray={element as FormArray}
											form={form}
											index={i}
										/>
									</div>
								);
							}

							if (Array.isArray(element)) {
								return (
									<div
										key={i}
										className="flex items-start flex-wrap sm:flex-nowrap w-full gap-2"
									>
										{element.map((el: any, ii: number) => (
											<div key={el.name + ii} className="flex-1 min-w-0">
												<RenderFormElement formElement={el} form={form} />
											</div>
										))}
									</div>
								);
							}
							return (
								<div key={(element as any).name + i} className="w-full">
									<RenderFormElement formElement={element} form={form} />
								</div>
							);
						})
					)}
					{!isMS && (
						<div className="flex items-center justify-end w-full pt-3">
							<Button type="submit" className="rounded-lg" size="sm">
								{form.baseStore.state.isSubmitting
									? "Submitting..."
									: form.baseStore.state.isSubmitted
										? "Submitted"
										: "Submit"}
							</Button>
						</div>
					)}
				</form>
			</form.AppForm>
		</div>
	);
}
