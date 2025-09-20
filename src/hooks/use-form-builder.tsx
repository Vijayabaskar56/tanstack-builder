import { useMemo } from "react";
import { toast } from "sonner";
import { revalidateLogic, useAppForm } from "@/components/ui/tanstack-form";
import type { FormElement, FormStep } from "@/types/form-types";
import { useFormStore, useIsMultiStep } from "@/hooks/use-form-store";
import useSettings from "@/hooks/use-settings";
import { getDefaultFormElement } from "@/lib/form-code-generators/react/generate-default-value";
import { flattenFormSteps } from "@/lib/form-elements-helpers";
import type * as v from "valibot";
import { generateValiSchemaObject } from "@/lib/schema-generators/generate-valibot-schema";
interface DefaultValues {
  [key: string]: unknown;
}
export type AppForm = ReturnType<typeof useAppForm> & {
  baseStore: {
    state: {
      values: DefaultValues;
      isSubmitting: boolean;
      isSubmitted: boolean;
    };
  };
  handleSubmit: () => void;
  AppForm: React.ComponentType<React.PropsWithChildren>;
  AppField: React.ComponentType<{
    name: string;
    children: (field: {
      FormItem: React.ComponentType<React.PropsWithChildren>;
      FormLabel: React.ComponentType<React.PropsWithChildren>;
      FormControl: React.ComponentType<React.PropsWithChildren>;
      FormDescription: React.ComponentType<React.PropsWithChildren>;
      FormMessage: React.ComponentType<React.PropsWithChildren>;
      state: { value: unknown };
      handleChange: (value: unknown) => void;
      handleBlur: () => void;
    }) => React.ReactElement;
  }>;
  reset: () => void;
};

export const useFormBuilder = (): {
  form: AppForm;
  resetForm: () => void;
} => {
  const isMS = useIsMultiStep();
  const { actions, formElements } = useFormStore();
  const flattenFormElements = isMS
    ? flattenFormSteps(formElements as FormStep[]).flat()
    : (formElements.flat() as FormElement[]);
  const filteredFormFields = flattenFormElements.filter((o) => !o.static);
  const settings = useSettings();

  const valiSchema = useMemo(
    () => generateValiSchemaObject(filteredFormFields),
    [filteredFormFields],
  );
  const defaultValue = useMemo(
    () => getDefaultFormElement(filteredFormFields),
    [filteredFormFields],
  );
  const form = useAppForm({
    defaultValues: defaultValue as v.InferInput<typeof valiSchema.objectSchema>,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: valiSchema.objectSchema },
    onSubmit: () => {
      toast.success("Submitted Successfully");
    },
    onSubmitInvalid({ formApi }) {
      if (settings.focusOnError) {
        const errorMap = formApi.state.errorMap.onDynamic;
        const inputs = Array.from(
          document.querySelectorAll("#previewForm input"),
        ) as HTMLInputElement[];

        let firstInput: HTMLInputElement | undefined;
        for (const input of inputs) {
          if (errorMap?.[input.name]) {
            firstInput = input;
            break;
          }
        }
        firstInput?.focus();
      }
    },
  });
  const { reset } = form;
  const resetForm = () => {
    actions.resetFormElements();
    reset();
  };
  return { form: form as unknown as AppForm,  resetForm };
};
