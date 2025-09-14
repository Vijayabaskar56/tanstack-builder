// multi-step-form-preview.tsx
import { AnimatePresence, motion } from "motion/react";
import { FormArrayPreview } from "@/components/builder/form-array-preview";
import { RenderFormElement } from "@/components/builder/render-form-element";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { FormArray, FormElement, FormStep } from "@/form-types";
import type { AppForm } from "@/hooks/use-form-builder";
import { useMultiStepForm } from "@/hooks/use-multi-step-form";
import { validateField, hasFieldErrors } from "@/lib/form-validation-helpers";
export function MultiStepFormPreview({
  form,
  formElements,
}: {
  form: AppForm;
  formElements: FormStep[];
}) {
  // Convert FormStep[] to Record<number, string[]> for useMultiStepForm
  const stepFields: Record<number, string[]> = formElements.reduce(
    (acc, step, index) => {
      const fieldNames = (step.stepFields as FormElement[])
        .flat()
        .filter((element) => {
          // Skip FormArray elements and static elements
          if (
            typeof element === "object" &&
            element !== null &&
            "arrayField" in element
          ) {
            return false; // Skip FormArray
          }
          return !element.static;
        })
        .map((element) => element.name);
      acc[index] = fieldNames;
      return acc;
    },
    {} as Record<number, string[]>,
  );

  const { currentStep, isLastStep, goToNext, goToPrevious } = useMultiStepForm({
    initialSteps: stepFields,
    onStepValidation: async (currentStepFields) => {
      // currentStepFields is already an array of field names from the stepFields mapping

      // Validate all fields using shared helper (handles array fields properly)
      const validationPromises = currentStepFields.map((fieldName) =>
        validateField(form, fieldName),
      );
      await Promise.all(validationPromises);

      // Check if any fields have errors (necessary for step navigation)
      const allErrors = form.getAllErrors();
      const fieldsWithErrors = currentStepFields.filter((fieldName) =>
        hasFieldErrors(form, fieldName, allErrors),
      );

      return fieldsWithErrors.length === 0;
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
            // Check if field is a FormArray
            if (
              typeof field === "object" &&
              field !== null &&
              "arrayField" in field
            ) {
              return (
                <div key={(field as any).id + i} className="w-full">
                  <FormArrayPreview
                    formArray={field as unknown as FormArray}
                    form={form}
                    index={i}
                  />
                </div>
              );
            }

            if (Array.isArray(field)) {
              return (
                <div
                  key={i}
                  className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2"
                >
                  {field.map((el: any, ii: number) => (
                    <div key={el.name + ii} className="w-full">
                      <RenderFormElement formElement={el} form={form} />
                    </div>
                  ))}
                </div>
              );
            }
            return (
              <div key={i} className="w-full">
                <RenderFormElement formElement={field as any} form={form} />
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
