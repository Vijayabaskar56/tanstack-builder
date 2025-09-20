import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useAppForm } from "@/components/ui/tanstack-form";
import { settingsCollection } from "@/db-collections/settings.collections";
import useSettings from "@/hooks/use-settings";
import { Eye, Shield } from "lucide-react";
import { useId } from "react";
import * as z from "zod";
import { Separator } from "../ui/separator";

// Zod schema for settings validation
const settingsSchema = z.object({
  defaultRequiredValidation: z.boolean(),
  numericInput: z.boolean(),
  focusOnError: z.boolean(),
  validationMethod: z.enum(["onChange", "onBlue", "onDynamic"]),
  asyncValidation: z.number().min(0).max(10000),
  preferredSchema: z.enum(["zod", "valibot", "arktype"]),
  preferredFramework: z.enum(["react", "vue", "angular", "solid"]),
});

export function SettingsSidebar() {
  const requiredValidationId = useId();
  const focusOnErrorId = useId();
  const validationMethodId = useId();
  const asyncValidationId = useId();
  const preferredSchemaId = useId();
  const preferredFrameworkId = useId();
  const data = useSettings();
  const form = useAppForm({
    defaultValues: {
      defaultRequiredValidation: data?.defaultRequiredValidation,
      numericInput: data?.numericInput,
      focusOnError: data?.focusOnError,
      validationMethod: data?.validationMethod,
      asyncValidation: data?.asyncValidation,
      preferredSchema: data?.preferredSchema,
      preferredFramework: data?.preferredFramework,
    } as z.input<typeof settingsSchema>,
    validators: {
      onChange: settingsSchema,
    },
    listeners: {
      onChangeDebounceMs: 1000,
      onChange: ({ formApi }) => {
        settingsCollection.update("user-settings", (draft) => {
          draft.defaultRequiredValidation =
            formApi.baseStore.state.values.defaultRequiredValidation;
          draft.numericInput = formApi.baseStore.state.values.numericInput;
          draft.focusOnError = formApi.baseStore.state.values.focusOnError;
          draft.validationMethod =
            formApi.baseStore.state.values.validationMethod;
          draft.asyncValidation =
            formApi.baseStore.state.values.asyncValidation;
          draft.preferredSchema =
            formApi.baseStore.state.values.preferredSchema;
          draft.preferredFramework =
            formApi.baseStore.state.values.preferredFramework;
        });

        //  actions.setSettings(formApi.baseStore.state.values)
      },
    },
  });

  return (
    <div className="flex flex-col h-full md:h-full max-h-[35vh] md:max-h-none">
      <form.AppForm>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <div className="mb-4 pb-2 px-4 border-b">
            <h3 className="text-lg font-semibold text-primary">Settings</h3>
            <p className="text-sm text-muted-foreground">Configure Your Form</p>
          </div>

          <ScrollArea className="h-[calc(35vh-8rem)]  md:h-[45rem]">
            <div className=" space-y-4 sm:space-y-6">
              <div>
                <div className="space-y-3">
                  <form.AppField name="defaultRequiredValidation" mode="value">
                    {(field) => (
                      <div className="flex items-center justify-between p-3 border-b mx-2">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-muted-foreground" />
                          <Label
                            htmlFor={requiredValidationId}
                            className="text-sm"
                          >
                            Default Required Validation
                          </Label>
                        </div>
                        <Switch
                          id={requiredValidationId}
                          checked={field.state.value}
                          onCheckedChange={field.handleChange}
                          className="data-[state=unchecked]:border-input data-[state=unchecked]:[&_span]:bg-input data-[state=unchecked]:bg-transparent [&_span]:transition-all data-[state=unchecked]:[&_span]:size-4 data-[state=unchecked]:[&_span]:translate-x-0.5 data-[state=unchecked]:[&_span]:shadow-none data-[state=unchecked]:[&_span]:rtl:-translate-x-0.5"
                        />
                      </div>
                    )}
                  </form.AppField>

                  <form.AppField name="focusOnError" mode="value">
                    {(field) => (
                      <div className=" border-b mx-2">
                        <div className="flex items-center justify-between p-3">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                            <Label htmlFor={focusOnErrorId} className="text-sm">
                              Focus on Error Fields
                            </Label>
                          </div>
                          <Switch
                            id={focusOnErrorId}
                            checked={field.state.value}
                            onCheckedChange={field.handleChange}
                            className="data-[state=unchecked]:border-input data-[state=unchecked]:[&_span]:bg-input data-[state=unchecked]:bg-transparent [&_span]:transition-all data-[state=unchecked]:[&_span]:size-4 data-[state=unchecked]:[&_span]:translate-x-0.5 data-[state=unchecked]:[&_span]:shadow-none data-[state=unchecked]:[&_span]:rtl:-translate-x-0.5"
                          />
                        </div>
                        <Separator className="my-2" />
                        <field.FormDescription className="pb-2">
                          Focus The First Input on Error,For More Info Check The
                          Docs:{" "}
                          <a
                            className="text-primary"
                            href="https://tanstack.com/form/latest/docs/framework/react/guides/focus-management"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Focus Management
                          </a>
                        </field.FormDescription>
                      </div>
                    )}
                  </form.AppField>
                  <form.AppField name="validationMethod" mode="value">
                    {(field) => (
                      <div className="p-3 border-b mx-2">
                        <Label
                          htmlFor={validationMethodId}
                          className="text-sm font-medium mb-3 block"
                        >
                          Validation Method
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { value: "onChange", label: "On Change" },
                            { value: "onBlue", label: "On Blur" },
                            { value: "onDynamic", label: "On Dynamic" },
                          ].map((option) => (
                            <Badge
                              key={option.value}
                              variant={
                                field.state.value === option.value
                                  ? "default"
                                  : "outline"
                              }
                              className={`cursor-pointer transition-all hover:scale-105 ${
                                field.state.value === option.value
                                  ? ""
                                  : "hover:bg-accent hover:text-accent-foreground"
                              }`}
                              onClick={() =>
                                field.handleChange(
                                  option.value as z.input<
                                    typeof settingsSchema
                                  >["validationMethod"],
                                )
                              }
                              // biome-ignore lint/a11y/useSemanticElements: <explanation>
                              role="radio"
                              aria-checked={field.state.value === option.value}
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  field.handleChange(
                                    option.value as z.input<
                                      typeof settingsSchema
                                    >["validationMethod"],
                                  );
                                }
                              }}
                            >
                              {option.label}
                            </Badge>
                          ))}
                        </div>
                        <Separator className="my-2" />
                        <field.FormDescription>
                          Validation Method For Form Generation, For More Info
                          Check The Docs:{" "}
                          <a
                            className="text-primary"
                            href="https://tanstack.com/form/latest/docs/framework/react/guides/dynamic-validation"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Dynamic Validation
                          </a>
                        </field.FormDescription>
                        <field.FormMessage />
                      </div>
                    )}
                  </form.AppField>

                  <form.AppField name="asyncValidation" mode="value">
                    {(field) => (
                      <div className="p-3 border-b mx-2">
                        <Label
                          htmlFor={asyncValidationId}
                          className="text-sm font-medium mb-3 block"
                        >
                          Async Validation Delay: {field.state.value}ms
                        </Label>
                        <div className="px-2">
                          <Slider
                            id={asyncValidationId}
                            min={100}
                            max={1000}
                            step={50}
                            value={[field.state.value]}
                            onValueChange={(value) => {
                              field.handleChange(value[0]);
                            }}
                            className="w-full"
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1 px-2">
                          <span>100ms</span>
                          <span>1000ms</span>
                        </div>
                        <Separator className="my-2" />
                        <field.FormDescription>
                          Validation Method For Form Generation, For More Info
                          Check The Docs:{" "}
                          <a
                            className="text-primary"
                            href="https://tanstack.com/form/latest/docs/framework/react/guides/validation#asynchronous-functional-validation"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Form Validation
                          </a>
                        </field.FormDescription>
                      </div>
                    )}
                  </form.AppField>

                  <form.AppField name="preferredSchema" mode="value">
                    {(field) => (
                      <div className="p-3 border-b mx-2">
                        <Label
                          htmlFor={preferredSchemaId}
                          className="text-sm font-medium mb-3 block"
                        >
                          Preferred Schema
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { value: "zod", label: "Zod" },
                            { value: "valibot", label: "Valibot" },
                            { value: "arktype", label: "Arktype" },
                          ].map((option) => (
                            <Badge
                              key={option.value}
                              variant={
                                field.state.value === option.value
                                  ? "default"
                                  : "outline"
                              }
                              className={`cursor-pointer transition-all hover:scale-105 ${
                                field.state.value === option.value
                                  ? ""
                                  : "hover:bg-accent hover:text-accent-foreground"
                              }`}
                              onClick={() =>
                                field.handleChange(
                                  option.value as z.input<
                                    typeof settingsSchema
                                  >["preferredSchema"],
                                )
                              }
                              // biome-ignore lint/a11y/useSemanticElements: <explanation>
                              role="radio"
                              aria-checked={field.state.value === option.value}
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  field.handleChange(
                                    option.value as z.input<
                                      typeof settingsSchema
                                    >["preferredSchema"],
                                  );
                                }
                              }}
                            >
                              {option.label}
                            </Badge>
                          ))}
                        </div>
                        <field.FormMessage />
                      </div>
                    )}
                  </form.AppField>

                  <form.AppField name="preferredFramework" mode="value">
                    {(field) => (
                      <div className="p-3 border-b mx-2">
                        <Label
                          htmlFor={preferredFrameworkId}
                          className="text-sm font-medium mb-3 block"
                        >
                          Preferred Framework
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { value: "react", label: "React" },
                            { value: "vue", label: "Vue" },
                            { value: "angular", label: "Angular" },
                            { value: "solid", label: "Solid" },
                          ].map((option) => (
                            <Badge
                              key={option.value}
                              variant={
                                field.state.value === option.value
                                  ? "default"
                                  : "outline"
                              }
                              className={`cursor-pointer transition-all hover:scale-105 ${
                                field.state.value === option.value
                                  ? ""
                                  : "hover:bg-accent hover:text-accent-foreground"
                              }`}
                              onClick={() =>
                                field.handleChange(
                                  option.value as z.input<
                                    typeof settingsSchema
                                  >["preferredFramework"],
                                )
                              }
                              // biome-ignore lint/a11y/useSemanticElements: <explanation>
                              role="radio"
                              aria-checked={field.state.value === option.value}
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  field.handleChange(
                                    option.value as z.input<
                                      typeof settingsSchema
                                    >["preferredFramework"],
                                  );
                                }
                              }}
                            >
                              {option.label}
                            </Badge>
                          ))}
                        </div>
                        <Separator className="my-2" />
                        <field.FormDescription>
                          Although Form Builder Helps You Build Forms Quickly,
                          It's Important to understand the basic concepts of Tan
                          Stack Form. So Check Out The Docs:{" "}
                          <a
                            className="text-primary"
                            href="https://tanstack.com/form/latest/docs/overview"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Tan Stack Form
                          </a>
                        </field.FormDescription>
                        <field.FormMessage />
                      </div>
                    )}
                  </form.AppField>
                </div>
              </div>
            </div>
          </ScrollArea>
        </form>
      </form.AppForm>
    </div>
  );
}
