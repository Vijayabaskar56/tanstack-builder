// apps/web/src/lib/form-code-generators/react/generate-form-code.ts
import type {
  FormArray,
  FormElement,
  FormElementOrList,
  FormStep,
} from "@/form-types";
import {
  getDefaultValuesString,
  objectToLiteralString,
  processFormElements,
} from "@/lib/form-code-generators/react/generate-default-value";
import { getFormElementCode } from "@/lib/form-code-generators/react/generate-form-component";
import { generateImports } from "@/lib/form-code-generators/react/generate-imports";
import { flattenFormSteps, getStepFields } from "@/lib/form-elements-helpers";

const modifyElement = (
  el: FormElementOrList,
  prefix: string,
): FormElementOrList => {
  if (Array.isArray(el)) {
    return el.map((e) => modifyElement(e, prefix)) as FormElement[];
  } else {
    return { ...el, name: prefix + el.name + "`" };
  }
};

const renderFields = (fields: (FormElementOrList | FormArray)[]): string => {
  return fields
    .map((FormElement) => {
      if (Array.isArray(FormElement)) {
        return `
          <div className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2">
            ${FormElement.map((field) => getFormElementCode(field)).join("")}
          </div>`;
      }
      if (FormElement.fieldType === "FormArray") {
        const formArray = FormElement as FormArray;

        // Use the template arrayField for pushValue, not runtime entries
        const actualFields = formArray.arrayField;
        const defaultEntry = processFormElements(
          actualFields as FormElementOrList[],
        );
        const pushValueStr = objectToLiteralString(defaultEntry);
        return (
          "{form.Field({\n" +
          '  name: "' +
          formArray.name +
          '",\n' +
          '  mode: "array",\n' +
          "  children: (field) => (\n" +
          '    <div className="w-full space-y-4">\n' +
          "      {field.state.value.map((_, i) => (\n" +
          '        <div key={i} className="space-y-3 p-4 relative">\n' +
          "          <Separator />\n" +
          "          " +
          renderFields(
            (actualFields as FormElementOrList[]).map((el) =>
              modifyElement(el, "`" + formArray.name + "[${i}]."),
            ),
          ) +
          "\n" +
          "        </div>\n" +
          "      ))}\n" +
          '      <div className="flex justify-between pt-2">\n' +
          '        <Button variant="outline" onClick={() => field.pushValue(' +
          pushValueStr +
          ")}>\n" +
          '          <Plus className="h-4 w-4 mr-2" /> Add\n' +
          "        </Button>\n" +
          '        <Button variant="outline" onClick={() => field.removeValue(field.state.value.length - 1)} disabled={field.state.value.length <= 1}>\n' +
          '          <Trash2 className="h-4 w-4 mr-2" /> Remove\n' +
          "        </Button>\n" +
          "      </div>\n" +
          "    </div>\n" +
          "  )\n" +
          "})}"
        );
      }
      return getFormElementCode(FormElement);
    })
    .join("\n");
};

export const generateFormCode = ({
  formElements,
  isMS,
  validationSchema,
  settings,
}: {
  formElements: FormElementOrList[] | FormStep[];
  isMS: boolean;
  validationSchema: any;
  settings: any;
}): { file: string; code: string }[] => {
  const flattenedFormElements = isMS
    ? flattenFormSteps(formElements as FormStep[]).flat()
    : formElements.flat();
  const defaultValues = getDefaultValuesString();
  const imports = Array.from(
    generateImports(
      flattenedFormElements as (FormElement | FormArray)[],
      validationSchema,
      isMS,
    ),
  ).join("\n");

  // Generate form validation helpers code (conditionally includes multi-step helpers)
  const formValidationHelpersCode = `
//------------------------------form-validation-helpers.ts
// Type definitions for better type safety
type FieldName = string | string[];
type ValidationErrors = {
  fields: Record<string, unknown>;
  form: unknown;
};

// Generic form type that has the methods we need
type FormWithValidation = {
  validateField: (...args: any[]) => any;
  validateArrayFieldsStartingFrom: (...args: any[]) => any;
  getFieldInfo: (...args: any[]) => any;
  getAllErrors: () => ValidationErrors;
};

// Helper function for validating fields (handles both regular and array fields)
export const validateField = (form: FormWithValidation, fieldName: FieldName) => {
  if (Array.isArray(fieldName)) {
    // For array fields, validate the entire array
    const baseFieldName = fieldName[0];
    const fieldInfo = form.getFieldInfo(baseFieldName);
    const arrayLength = (fieldInfo.instance?.state.value as unknown[])?.length || 0;
    return form.validateArrayFieldsStartingFrom(baseFieldName, arrayLength, "submit");
  }

  // For regular string fields, validate as normal field
  return form.validateField(fieldName, "submit");
};

${
  isMS
    ? `
// Helper function to check if a field has errors
export const hasFieldErrors = (form: FormWithValidation, fieldName: FieldName, allErrors: ValidationErrors) => {
  if (Array.isArray(fieldName)) {
    return hasArrayFieldErrors(form, fieldName[0], allErrors);
  }
  return Object.keys(allErrors.fields).includes(fieldName);
};

// Helper function to check if an array field has errors in any index
export const hasArrayFieldErrors = (form: FormWithValidation, baseFieldName: string, allErrors: ValidationErrors) => {
  const fieldInfo = form.getFieldInfo(baseFieldName);
  const arrayLength = (fieldInfo.instance?.state.value as unknown[])?.length || 0;

  for (let i = 0; i < arrayLength; i++) {
    const pattern = new RegExp(\`^\${baseFieldName}\\\\[\${i}\\\\]\`);
    const hasErrorInIndex = Object.keys(allErrors.fields).some(
      (errorField) => pattern.test(errorField)
    );
    if (hasErrorInIndex) return true;
  }
  return false;
};
`
    : ""
}`;

  const singleStepFormCode = [
    {
      file: "single-step-form.tsx",
      code: `
${imports}
import { validateField } from './form-validation-helpers'

export function DraftForm() {

const form = useAppForm({
  defaultValues: ${defaultValues},
  validationLogic: revalidateLogic(),
  validators: {     onDynamicAsyncDebounceMs: 500, onDynamic: formSchema },
  onSubmit : ({value}) => {
  console.log(value)
			toast.success("success");
  },${
    settings.focusOnError
      ? `
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
		}`
      : ""
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

return (
  <div>
    <form.AppForm>
      <form onSubmit={handleSubmit} className="flex flex-col p-2 md:p-5 w-full mx-auto rounded-md max-w-3xl gap-2 border"  noValidate>
         ${renderFields(formElements as (FormElementOrList | FormArray)[])}
        ${
          !isMS
            ? `
         <div className="flex justify-end items-center w-full pt-3">
         <form.Subscribe selector={(state) => state.isSubmitting">
           {(isSubmitting) => (
            <Button className="rounded-lg" size="sm" disable={isSubmitting} type="submit">
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
           )}
         </form.Subscribe>
        </div>`
            : ""
        }
      </form>
    </form.AppForm>
  </div>
)
}`,
    },
    {
      file: "form-validation-helpers.ts",
      code: formValidationHelpersCode,
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

  function stringifyStepFields(stepFields: Record<number, string[]>): string {
    const entries = Object.entries(stepFields).map(([stepNumber, fields]) => {
      return `  ${stepNumber}: ${JSON.stringify(fields)}`;
    });
    return `{\n${entries.join(",\n")}\n}`;
  }

  const stringifiedStepComponents = stringifyStepComponents(
    formElements as FormStep[],
  );
  const stringifiedStepFields = stringifyStepFields(
    getStepFields(formElements as FormStep[]),
  );
  const MSF_Code = `
  ${imports}
  import { useState } from 'react'
  import { Progress } from '@/components/ui/progress'
  import { motion, AnimatePresence } from 'motion/react'
  import { useMultiStepForm } from './use-multi-step-form'
  import { validateField, hasFieldErrors } from './form-validation-helpers'
  export function DraftForm() {

  const form = useAppForm({
    defaultValues: ${defaultValues},
    validators: { onChange: formSchema },
    onSubmit : ({value}) => {
    console.log(value)
     toast.success('Submitted Successfully')
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
    const stepFormElements: { [key: number]: React.ReactNode } = ${stringifiedStepComponents};
    const stepFields: Record<number, string[]> = ${stringifiedStepFields};

    const steps = Object.keys(stepFormElements).map(Number);
    const { currentStep, isLastStep, goToNext, goToPrevious } = useMultiStepForm({
      initialSteps: stepFields,
      onStepValidation: async (currentStepData) => {
        // Validate all fields in the current step using shared helpers
        const validationPromises = currentStepData.map(fieldName => validateField(form, fieldName));
        await Promise.all(validationPromises);

        // Check if any fields have errors (necessary for step navigation)
        const allErrors = form.getAllErrors();
        const fieldsWithErrors = currentStepData.filter(fieldName =>
          hasFieldErrors(form, fieldName, allErrors)
        );

        return fieldsWithErrors.length === 0;
      },
    });
  const current = stepFormElements[currentStep]
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
import { validateField, hasFieldErrors } from './form-validation-helpers';

type UseFormStepsProps = {
 initialSteps: Record<number, string[]>;
 onStepValidation?: (step: any) => Promise<boolean> | boolean;
};

export type UseMultiFormStepsReturn = {
 steps: Record<number, string[]>;

 currentStep: number;

 currentStepData: string[];

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

   if (currentStep < Object.keys(currentStepData).length + 1) {
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
   currentStepData: steps[currentStep - 1] as string[],
   progress: (currentStep / Object.keys(steps).length) * 100,
   isFirstStep: currentStep === 1,
   isLastStep: currentStep === Object.keys(steps).length,
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
    {
      file: "form-validation-helpers.ts",
      code: formValidationHelpersCode,
    },
  ];
  return multiStepFormCode;
};
