import { useAppForm } from "@/components/ui/tanstack-form";
import type { FormElement, FormElementOrList, FormStep } from "@/form-types";
import { useFormStore } from "@/hooks/use-form-store";
import { getDefaultValues } from "@/lib/form-code-generators/react/generate-default-value";
import { getFormElementCode } from "@/lib/form-code-generators/react/generate-form-component";
import { generateImports } from "@/lib/form-code-generators/react/generate-imports";
import { flattenFormSteps } from "@/lib/form-elements-helpers";

const renderFields = (fields: FormElementOrList[]) => {
	return fields
		.map((FormElement) => {
			if (Array.isArray(FormElement)) {
				return `
          <div className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2">
            ${FormElement.map((field) => getFormElementCode(field)).join("")}
          </div>`;
			}
			return getFormElementCode(FormElement);
		})
		.join("\n");
};

export const generateFormCode = ({
	formElements,
	isMS,
}: {
	formElements: FormElementOrList[] | FormStep[];
	isMS: boolean;
}): { file: string; code: string }[] => {
	const flattenedFormElements = isMS
		? flattenFormSteps(formElements as FormStep[]).flat()
		: formElements.flat();

	const imports = Array.from(
		generateImports(flattenedFormElements as FormElement[]),
	).join("\n");

 const defaultValues = getDefaultValues()
 const {settings} = useFormStore()
	const singleStepFormCode = [
		{
			file: "single-step-form.tsx",
			code: `
${imports}

export function DraftForm() {

const form = useAppForm({
  defaultValues: ${defaultValues},
  validationLogic: revalidateLogic(),
  validators: {     onDynamicAsyncDebounceMs: 500, onDynamic: formSchema },
  onSubmit : ({value}) => {
  console.log(value)
			toast.success("success");
  },${settings.focusOnError && `
  onSubmitInvalid({ formApi }) {
				const errorMap = formApi.state.errorMap.onDynamic!;
				const inputs = Array.from(
					document.querySelectorAll("#previewForm input"),
				) as HTMLInputElement[];

				let firstInput: HTMLInputElement | undefined;
				for (const input of inputs) {
					if (errorMap[input.name]) {
						firstInput = input;
						break;
					}
				}
				firstInput?.focus();
		}`},
});


const handleSubmit = useCallback(
  (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  },
  [form]
);
const isSubmitting = useStore(form.store , (state) => state.isSubmitting)

return (
  <div>
    <form.AppForm>
      <form onSubmit={handleSubmit} className="flex flex-col p-2 md:p-5 w-full mx-auto rounded-md max-w-3xl gap-2 border"  noValidate>
        ${renderFields(formElements as FormElementOrList[])}
        <div className="flex justify-end items-center w-full pt-3">
          <Button className="rounded-lg" size="sm">
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </form.AppForm>
  </div>
)
}`,
		},
	];
	if (!isMS) return singleStepFormCode;

	// Handle multi-step form
	function stringifyStepComponents(steps: any[]): string {
		const componentEntries = steps.map((step, index) => {
			const stepNumber = index + 1;
			const renderedFields = renderFields(step.stepFields);
			return `  ${stepNumber}: <div>${renderedFields}</div>`;
		});

		return `{\n${componentEntries.join(",\n")}\n}`;
	}

	const stringifiedStepComponents = stringifyStepComponents(
		formElements as FormStep[],
	);

	const MSF_Code = `
  ${imports}
  import { useState } from 'react'
  import { Progress } from '@/components/ui/progress'
  import { motion, AnimatePresence } from 'motion/react'
  import { useMultiStepForm } from './use-multi-step-form'
  export function DraftForm() {

  const form = useAppForm({
    defaultValues: ${defaultValues},
    validators: { onChange: formSchema },
    onSubmit : ({value}) => {
    console.log(value)
    }
  });
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  const isSubmitting = useStore(form.store , (state) => state.isSubmitting)
  return (
    <div>
      <form.AppForm>
        <form onSubmit={handleSubmit} className="flex flex-col p-2 md:p-5 w-full mx-auto rounded-md max-w-3xl gap-2 border">
          <MultiStepViewer form={form} />
          <div className="flex justify-end items-center w-full pt-3">
            <Button className="rounded-lg" size="sm">
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </form.AppForm>
    </div>
  )
}
//------------------------------
// Define the form structure for type inference
const multiStepFormOptions = {
 defaultValues: ${defaultValues},
};

//------------------------------
const MultiStepViewer = withForm({
 ...multiStepFormOptions,
 render: function MultiStepFormRender({ form }) {
    const stepFormElements: { [key: number]: JSX.Element } = ${stringifiedStepComponents};

    const steps = Object.keys(stepFormElements).map(Number);
    const { currentStep, isLastStep, goToNext, goToPrevious } = useMultiStepForm({
      initialSteps: steps,
      onStepValidation: () => {
      /**
       * TODO: handle step validation
       */
      return true;
        },
      });
  const current = stepFormElements[currentStep - 1]
  const { 	baseStore: {
				state: { isSubmitting },
			}, } = form

  return (
    <div className="flex flex-col gap-2 pt-3">
      <div className="flex flex-col items-center justify-start gap-1">
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
          transition={{ duration: 0.4, type: 'spring' }}
          className="flex flex-col gap-2"
        >
          {current}
        </motion.div>
      </AnimatePresence>
      <div className="flex items-center justify-between gap-3 w-full pt-3">
        <Button size="sm" variant="ghost" onClick={goToPrevious} type="button">
          Previous
        </Button>
        {isLastStep ? (
          <Button size="sm" type="submit">
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        ) : (
          <Button
            size="sm"
            type="button"
            variant={'secondary'}
            onClick={goToNext}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  )}
});`;
	const useMultiStepFormCode = `
//------------------------------use-multi-step-form.tsx
type UseFormStepsProps = {
 initialSteps: any[];
 onStepValidation?: (step: any) => Promise<boolean> | boolean;
};

export type UseMultiFormStepsReturn = {
 steps: any[];

 currentStep: number;

 currentStepData: any;

 progress: number;

 isFirstStep: boolean;

 isLastStep: boolean;

 goToNext: () => Promise<boolean>;

 goToPrevious: () => void;
};

export function useMultiStepForm({
 initialSteps,
 onStepValidation,
}: UseFormStepsProps): UseMultiFormStepsReturn {
 const steps = initialSteps;
 const [currentStep, setCurrentStep] = useState(1);
 const goToNext = async () => {
   const currentStepData = initialSteps[currentStep - 1];

   if (onStepValidation) {
     const isValid = await onStepValidation(currentStepData);
     if (!isValid) return false;
   }

   if (currentStep < steps.length) {
     setCurrentStep((prev) => prev + 1);
     return true;
   }
   return false;
 };

 const goToPrevious = () => {
   if (currentStep > 1) {
     setCurrentStep((prev) => prev - 1);
   }
 };

 return {
   steps,
   currentStep,
   currentStepData: steps[currentStep - 1],
   progress: (currentStep / steps.length) * 100,
   isFirstStep: currentStep === 1,
   isLastStep: currentStep === steps.length,
   goToNext,
   goToPrevious,
 };
}`;
	const multiStepFormCode = [
		{
			file: "multi-step-form.tsx",
			code: MSF_Code,
		},
		{
			file: "use-multi-step-form.tsx",
			code: useMultiStepFormCode,
		},
	];
	return multiStepFormCode;
};
