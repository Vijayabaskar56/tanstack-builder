//form-preview.tsx
import { MultiStepFormPreview } from "@/components/builder/multi-step-preview";
import { RenderFormElement } from "@/components/builder/render-form-element";
import { Button } from "@/components/ui/button";
import type { FormElementOrList, FormStep } from "@/form-types";
import type { AppForm } from "@/hooks/use-form-builder";
import { useFormBuilder } from "@/hooks/use-form-builder";
import { useFormStore, useIsMultiStep } from "@/hooks/use-form-store";

interface FormPreviewProps {
	form: AppForm;
}

export function SingleStepFormPreview({ form }: FormPreviewProps) {
	const { onSubmit } = useFormBuilder();
	const {formElements }= useFormStore();
	const isMS = useIsMultiStep();
	// Get form data keys from TanStack form state
	const data = Object.keys(form.baseStore.state.values);

	return (
		<div className="w-full animate-in rounded-md">
			{data.length > 0 ? (
				<form.AppForm>
					<form
						onSubmit={async (e) => {
							e.preventDefault();
							if (!isMS) {
								await form.handleSubmit();
								const formData = form.baseStore.state.values;
								await onSubmit(formData);
							}
						}}
						className="flex flex-col p-2 md:px-5 w-full gap-2"
					>
						{isMS ? (
							<MultiStepFormPreview
								formElements={formElements as unknown as FormStep[]}
								form={form}
							/>
						) : (
							(formElements as FormElementOrList[]).map((element, i) => {
								if (Array.isArray(element)) {
									return (
										<div
											key={i}
											className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2"
										>
											{element.map((el, ii) => (
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
			) : (
				<div className="h-full py-10 px-3">
					<p className="text-center text-muted-foreground text-lg">
						Add form elements to preview
					</p>
				</div>
			)}
		</div>
	);
}
