//form-preview.tsx
/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
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
      id='previewForm'
      noValidate
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
       <>
       {console.log('this is working')}
							<MultiStepFormPreview
								formElements={formElements as unknown as FormStep[]}
								form={form}
        />
        </>
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
		</div>
	);
}
