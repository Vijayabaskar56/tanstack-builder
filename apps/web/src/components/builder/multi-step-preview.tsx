// multi-step-form-preview.tsx
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import { AnimatePresence, motion } from "motion/react";
import { RenderFormElement } from "@/components/builder/render-form-element";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { FormElement, FormStep } from "@/form-types";
import type { AppForm } from "@/hooks/use-form-builder";
import { useMultiStepForm } from "@/hooks/use-multi-step-form";
export function MultiStepFormPreview({
	form,
	formElements,
}: {
	form: AppForm;
	formElements: FormStep[];
}) {
	const { currentStep, isLastStep, goToNext, goToPrevious } = useMultiStepForm({
		initialSteps: formElements as FormStep[],
		onStepValidation: async (step) => {
			const stepFields = (step.stepFields as FormElement[])
				.flat()
				.filter((o) => !o.static)
				.map((o) => o.name);
			let isValid = true;
			for (const fieldName of stepFields) {
				const fieldValid = await form.validateField(fieldName, "change");
				isValid = isValid && Boolean(fieldValid);
			}
			return isValid;
		},
	});
	const steps = formElements as FormStep[];
	const current = formElements[currentStep - 1] as FormStep;
	const { isSubmitting, isSubmitted } = form.baseStore.state;
	return (
		<div className="flex flex-col gap-2 pt-3">

			<div className="flex flex-col items-start justify-center gap-1">

				<span>

					Step {currentStep} of {steps.length}
				</span>
				<Progress value={(currentStep / steps.length) * 100} />
			</div>
			<AnimatePresence mode="popLayout">

				<motion.div
					key={currentStep}
					initial={{ opacity: 0, x: 15 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -15 }}
					transition={{ duration: 0.4, type: "spring" }}
					className="flex flex-col gap-2"
				>

					{current?.stepFields?.map((field, i) => {
						if (Array.isArray(field)) {
							return (
								<div
									key={i}
									className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2"
								>

									{field.map((el: FormElement, ii: number) => (
										<div key={el.name + ii} className="w-full">

											<RenderFormElement formElement={el} form={form} />
										</div>
									))}
								</div>
							);
						}
						return (
							<div key={i} className="w-full">

								<RenderFormElement formElement={field} form={form} />
							</div>
						);
					})}
				</motion.div>
			</AnimatePresence>
			<div className="flex items-center justify-between gap-3 w-full pt-3">

				<Button size="sm" variant="ghost" onClick={goToPrevious} type="button">

					Previous
				</Button>
				{isLastStep ? (
					<Button
						size="sm"
						type="button"
						onClick={async (e) => {
							e.preventDefault();
							await form.handleSubmit();
						}}
						disabled={isSubmitting}
					>

						{isSubmitting
							? "Submitting..."
							: isSubmitted
								? "Submitted "
								: "Submit"}
					</Button>
				) : (
					<Button
						size="sm"
						type="button"
						variant={"secondary"}
						onClick={goToNext}
					>

						Next
					</Button>
				)}
			</div>
		</div>
	);
}
