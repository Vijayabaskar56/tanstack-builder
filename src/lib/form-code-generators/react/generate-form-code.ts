import type {
  FormArray,
  FormElement,
  FormElementOrList,
  FormStep,
} from "@/types/form-types";
import {
  getDefaultValuesString,
  objectToLiteralString,
  processFormElements,
} from "@/lib/form-code-generators/react/generate-default-value";
import { getFormElementCode } from "@/lib/form-code-generators/react/generate-form-component";
import { generateImports } from "@/lib/form-code-generators/react/generate-imports";
import { flattenFormSteps } from "@/lib/form-elements-helpers";
import {
  generateZodSchemaObject,
  generateZodSchemaString,
} from "@/lib/schema-generators/generate-zod-schema";
import { getDefaultFormElement } from "@/lib/form-code-generators/react/generate-default-value";

const modifyElement = (
  el: FormElementOrList,
  prefix: string,
): FormElementOrList => {
  if (Array.isArray(el)) {
    return el.map((e) => modifyElement(e, prefix)) as FormElement[];
  }
  return { ...el, name: prefix + el.name };
};

const renderFields = (
  fields: (FormElementOrList | FormArray)[],
  isInGroup = false,
): string => {
  return fields
    .map((formElement) => {
      if (Array.isArray(formElement)) {
        return `
          <div className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2">
            ${formElement.map((field) => getFormElementCode(field, isInGroup)).join("")}
          </div>`;
      }
      // Check if it's a FormArray
      if ("arrayField" in formElement) {
        const formArray = formElement as FormArray;

        // Use the template arrayField for pushValue, not runtime entries
        const actualFields = formArray.arrayField;
        const defaultEntry = processFormElements(
          actualFields as FormElementOrList[],
        );
        const pushValueStr = objectToLiteralString(defaultEntry);
        const fieldPrefix = isInGroup ? "group" : "form";
        return (
          // biome-ignore lint/style/useTemplate: <explanation>
          "{" +
          fieldPrefix +
          ".AppField({\n" +
          '  name: "' +
          formArray.name +
          '",\n' +
          '  mode: "array",\n' +
          "  children: (field) => (\n" +
          '    <div className="w-full space-y-4">\n' +
          "      {field.state.value.map((_, index) => (\n" +
          '        <div key={index} className="space-y-3 p-4 relative">\n' +
          "          <Separator />\n" +
          "          " +
          renderFields(
            (actualFields as FormElementOrList[]).map((el) =>
              modifyElement(el, "`" + formArray.name + "[${index}]."),
            ),
            isInGroup, // Pass the correct group context
          ) +
          "\n" +
          "        </div>\n" +
          "      ))}\n" +
          '      <div className="flex justify-between pt-2">\n' +
          '        <Button variant="outline" type="button" onClick={() => field.pushValue(' +
          pushValueStr +
          ", { dontValidate: true })}>\n" +
          '          <Plus className="h-4 w-4 mr-2" /> Add\n' +
          "        </Button>\n" +
          '        <Button variant="outline" type="button" onClick={() => field.removeValue(field.state.value.length - 1)} disabled={field.state.value.length <= 1}>\n' +
          '          <Trash2 className="h-4 w-4 mr-2" /> Remove\n' +
          "        </Button>\n" +
          "      </div>\n" +
          "    </div>\n" +
          "  )\n" +
          "})}"
        );
      }
      return getFormElementCode(formElement as FormElement, isInGroup);
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

return (
  <div>
    <form.AppForm>
      <form.Form>
         ${renderFields(formElements as (FormElementOrList | FormArray)[], false)}
        ${
          !isMS
            ? `
         <div className="flex justify-end items-center w-full pt-3">
         <form.SubmitButton label="Submit" />
        </div>`
            : ""
        }
      </form.Form>
    </form.AppForm>
  </div>
)
}`,
    },
  ];
  if (!isMS) return singleStepFormCode;

  // Handle multi-step form
  function generateStepSchemas(steps: FormStep[]): string {
    const stepSchemas = steps.map((step, index) => {
      const stepFields = step.stepFields.flat();
      const stepSchema = generateZodSchemaObject(
        stepFields as (FormElement | FormArray)[],
      );
      const stepSchemaString = generateZodSchemaString(stepSchema);
      return `  // Step ${index + 1}\n  ${stepSchemaString},`;
    });

    return `[\n${stepSchemas.join("\n")}\n]`;
  }

  function generateStepComponents(steps: FormStep[]): string {
    const stepComponents = steps.map((step, index) => {
      const stepNumber = index + 1;
      const renderedFields = renderFields(step.stepFields, true);
      return `const Step${stepNumber}Group = withFieldGroup({
  defaultValues: ${getStepDefaultValues(step.stepFields)},
  render: function Step${stepNumber}Render({ group }) {
    return (
      <div>
        <h2 className="text-2xl font-bold">Step ${stepNumber}</h2>
        ${renderedFields}
      </div>
    );
  },
});`;
    });

    return stepComponents.join("\n\n");
  }

  function getStepDefaultValues(stepFields: FormElementOrList[]): string {
    const defaults = getDefaultFormElement(
      stepFields as (FormElementOrList | FormArray)[],
    );
    return objectToLiteralString(defaults);
  }

  function getStepFieldMappings(stepFields: FormElementOrList[]): string {
    const fieldMappings: Record<string, string> = {};

    const processFields = (fields: FormElementOrList[]) => {
      fields
        .filter((f) => !Array.isArray(f) && !f.static)
        .forEach((field) => {
          if (Array.isArray(field)) {
            processFields(field);
          } else if ("arrayField" in field) {
            // Handle FormArray
            fieldMappings[field.name] = `${field.name}`;
          } else {
            // Handle regular FormElement
            fieldMappings[field.name] = field.name;
          }
        });
    };

    processFields(stepFields);
    return Object.entries(fieldMappings)
      .map(([key, value]) => `${key}: "${value}" as never`)
      .join(", ");
  }

  const stepSchemasStr = generateStepSchemas(formElements as FormStep[]);
  const stepComponentsStr = generateStepComponents(formElements as FormStep[]);

  const MSF_Code = `
  ${imports}
  import { Progress } from '@/components/ui/progress'
  import { motion, AnimatePresence } from 'motion/react'
  import { useFormStepper } from '@/hooks/use-stepper'

  ${stepComponentsStr}


  // Step-specific schemas for the stepper hook
  const stepSchemas = ${stepSchemasStr};

  export function DraftForm() {
    const {
      currentValidator,
      step,
      currentStep,
      isFirstStep,
      handleCancelOrBack,
      handleNextStepOrSubmit,
    } = useFormStepper(stepSchemas);

    const form = useAppForm({
      defaultValues: ${defaultValues},
      validationLogic: revalidateLogic(),
      validators: {
        onDynamic: currentValidator as typeof formSchema,
      },
      onSubmit: ({ value }) => {
        toast.success("Submitted Successfully");
      },
    });

    const groups: Record<number, React.ReactNode> = {
      ${Array.from({ length: (formElements as FormStep[]).length }, (_, i) => {
        const step = (formElements as FormStep[])[i];
        const fieldMappings = getStepFieldMappings(step.stepFields);
        return `${i + 1}: <Step${i + 1}Group form={form} fields={{ ${fieldMappings} }} />`;
      }).join(",\n      ")}
    };

    const handleNext = async () => {
      await handleNextStepOrSubmit(form);
    };

    const handlePrevious = () => {
      handleCancelOrBack({ onBack: () => {} });
    };

    const current = groups[currentStep];

    return (
      <div>
        <form.AppForm>
          <form.Form>
            <div className="flex flex-col gap-2 pt-3">
              <div className="flex flex-col items-center justify-start gap-1">
                <span>
                  Step {currentStep} of {Object.keys(groups).length}
                </span>
                <Progress
                  value={(currentStep / Object.keys(groups).length) * 100}
                />
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
                  {current}
                </motion.div>
              </AnimatePresence>
              <div className="flex items-center justify-between gap-3 w-full pt-3">
               <form.StepButton
                  label="Previous"
                  disabled={isFirstStep}
                  handleMovement={() =>
                    handleCancelOrBack({
                      onBack: () => handlePrevious(),
                    })
                  }
                />
                {step.isCompleted ? (
                  <form.SubmitButton
                    label="Submit"
                    onClick={() => handleNextStepOrSubmit(form)}
                  />
                ) : (
                   <form.StepButton label="Next" handleMovement={handleNext} />
                )}
              </div>
            </div>
          </form.Form>
        </form.AppForm>
      </div>
    );
  }`;
  const multiStepFormCode = [
    {
      file: "multi-step-form.tsx",
      code: MSF_Code,
    },
  ];
  return multiStepFormCode;
};
