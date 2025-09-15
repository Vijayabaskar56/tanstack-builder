// form-array-preview.tsx

import { Plus, Trash2 } from "lucide-react";
import { RenderFormElement } from "@/components/builder/render-form-element";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type {
  FormArray,
  FormElement,
  FormElementOrList,
} from "@/types/form-types";
import type { AppForm } from "@/hooks/use-form-builder";
import { useSearchStore } from "@/hooks/use-search-store";
import { getDefaultFormElement } from "@/lib/form-code-generators/react/generate-default-value";

interface FormArrayPreviewProps {
  formArray: FormArray;
  form: AppForm;
  index: number;
}

export function FormArrayPreview({ formArray, form }: FormArrayPreviewProps) {
  const { formElements, actions } = useSearchStore();

  // Get the latest FormArray from the store to ensure reactivity
  const currentFormArray = formElements.find(
    (el) =>
      typeof el === "object" &&
      el !== null &&
      "arrayField" in el &&
      el.id === formArray.id,
  ) as FormArray | undefined;

  const arrayToUse = currentFormArray || formArray;
  const defaultValue = getDefaultFormElement(arrayToUse.arrayField);
  return (
    <div className="w-full space-y-4">
      {form.Field({
        name: arrayToUse.name,
        mode: "array",
        children: (field) => (
          <>
            <div className="space-y-3">
              <Separator />
              {((field.state.value as unknown[]) || []).map((_, i: number) => (
                <div
                  key={`entry-${arrayToUse.id}-${i}`}
                  className="space-y-3 p-4 relative"
                >
                  {arrayToUse.entries[i]?.fields.map(
                    (element: FormElementOrList) => {
                      if (Array.isArray(element)) {
                        return (
                          <div
                            key={`array-${element.map((el) => el.id).join("-")}`}
                            className="flex items-start flex-wrap sm:flex-nowrap w-full gap-2"
                          >
                            {element.map((el: FormElement) => (
                              <div key={el.id} className="flex-1 min-w-0">
                                <RenderFormElement
                                  formElement={el}
                                  form={form}
                                />
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return (
                        <div key={element.id} className="w-full">
                          <RenderFormElement
                            formElement={element}
                            form={form}
                          />
                        </div>
                      );
                    },
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  field.pushValue(defaultValue as never);
                  actions.addFormArrayEntry(arrayToUse.id);
                }}
                disabled={arrayToUse.arrayField.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const lastIndex =
                    ((field.state.value || []) as unknown[]).length - 1;
                  field.removeValue(lastIndex);
                  if (arrayToUse.entries[lastIndex]) {
                    actions.removeFormArrayEntry(
                      arrayToUse.id,
                      arrayToUse.entries[lastIndex].id,
                    );
                  }
                }}
                disabled={((field.state.value || []) as unknown[]).length <= 1}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          </>
        ),
      })}
    </div>
  );
}
