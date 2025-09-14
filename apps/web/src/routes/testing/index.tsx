/** biome-ignore-all lint/correctness/noChildrenProp: Required for form field rendering */
/** biome-ignore-all lint/correctness/useUniqueElementIds: Form elements need unique IDs */
// apps/web/src/routes/testing/index.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAppForm, withForm } from "@/components/ui/tanstack-form";
import { Textarea } from "@/components/ui/textarea";
import { useMultiStepForm } from "@/hooks/use-multi-step-form";
import { revalidateLogic, useStore } from "@tanstack/react-form";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback } from "react";
import { toast } from "sonner";
import * as z from "zod";
export const Route = createFileRoute("/testing/")({
  component: DraftForm,
  beforeLoad: () => {
    const env = import.meta.env.MODE;
    if (env !== "development") {
      return <Navigate to="/" />;
    }
  },
});
export const formSchema = z.object({
  name: z.string().min(1, "This field is required"),
  email: z.email(),
  message: z.string().min(1, "This field is required"),
  formArray_1757573667464: z.array(
    z.object({
      Input_1757573670555: z.string().min(1, "This field is required"),
    }),
  ),
  formArray_1757573695722: z.array(
    z.object({
      Input_1757573699922: z.string().min(1, "This field is required"),
      Input_1757573702722: z.string().min(1, "This field is required"),
    }),
  ),
});

// export const formSchema = z.object({
//  name: z.string().min(1, "This field is required"),
//  email: z.email(),
//  message: z.string().min(1, "This field is required"),
//  agree: z.boolean(),
// });

// export function DraftForm() {
//  const form = useAppForm({
//   defaultValues: {
//    name: "",
//    email: "",
//    message: "",
//    agree: false,
//   } as z.input<typeof formSchema>,
//   validationLogic: revalidateLogic(),
//   validators: {
//    onDynamicAsyncDebounceMs: 500,
//    onDynamic: formSchema,
//   },
//    onSubmit: async ({ value }) => {
//     console.log("Submitting form data:", value);

//     try {
//       // Simulate API call with realistic delay
//       await new Promise((resolve, reject) => {
//         setTimeout(() => {
//           // Simulate occasional failure for testing
//           if (Math.random() < 0.1) { // 10% chance of failure
//             reject(new Error("Network error occurred"));
//           } else {
//             resolve(value);
//           }
//         }, 2000); // 2 second delay
//       });

//       // Success case
//       toast.success("Form submitted successfully!", {
//         description: "Thank you for your submission. We'll get back to you soon.",
//         duration: 5000,
//       });

//       console.log("Form submission completed successfully");

//     } catch (error) {
//       // Error case
//       console.error("Form submission failed:", error);
//       toast.error("Submission failed", {
//         description: error instanceof Error ? error.message : "Please try again later.",
//         duration: 5000,
//       });

//       // Re-throw to let TanStack Form handle it
//       throw error;
//     }
//    },
//   onSubmitInvalid({ formApi }) {
//    const errorMap = formApi.state.errorMap.onDynamic!;
//    const inputs = Array.from(
//     document.querySelectorAll("#previewForm input"),
//    ) as HTMLInputElement[];
//    let firstInput: HTMLInputElement | undefined;
//    for (const input of inputs) {
//     if (errorMap[input.name]) {
//      firstInput = input;
//      break;
//     }
//    }
//    firstInput?.focus();
//   },
//  });
//  const handleSubmit = useCallback(
//   (e: React.FormEvent) => {
//    e.preventDefault();
//    e.stopPropagation();
//    form.handleSubmit();
//   },
//   [form],
//  );
//  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);
//  return (
//   <div>
//    <form.AppForm>
//     <form
//      onSubmit={handleSubmit}
//      className="flex flex-col p-2 md:p-5 w-full mx-auto rounded-md max-w-3xl gap-2 border"
//      noValidate
//     >
//      <h2 className="text-2xl font-bold">Contact us</h2>
//      <p className="text-base">Please fill the form below to contact us</p>

//      <div className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2">
//       <form.AppField
//        name={"name"}
//        children={(field) => (
//         <field.FormItem className="w-full">
//          <field.FormLabel>Name *</field.FormLabel>
//          <field.FormControl>
//           <Input
//            name={"name"}
//            placeholder="Enter your name"
//            type="text"
//            value={field.state.value}
//            onBlur={field.handleBlur}
//            onChange={(e) => field.handleChange(e.target.value)}
//           />
//          </field.FormControl>

//          <field.FormMessage />
//         </field.FormItem>
//        )}
//       />
//       <form.AppField
//        name={"email"}
//        children={(field) => (
//         <field.FormItem className="w-full">
//          <field.FormLabel>Email *</field.FormLabel>
//          <field.FormControl>
//           <Input
//            name={"email"}
//            placeholder="Enter your email"
//            type="email"
//            value={field.state.value}
//            onBlur={field.handleBlur}
//            onChange={(e) => field.handleChange(e.target.value)}
//           />
//          </field.FormControl>

//          <field.FormMessage />
//         </field.FormItem>
//        )}
//       />
//      </div>

//      <form.AppField
//       name={"message"}
//       children={(field) => (
//        <field.FormItem>
//         <field.FormLabel>Message *</field.FormLabel>
//         <field.FormControl>
//          <Textarea
//           placeholder="Enter your message"
//           className="resize-none"
//           name={"message"}
//           value={field.state.value}
//           onBlur={field.handleBlur}
//           onChange={(e) => field.handleChange(e.target.value)}
//          />
//         </field.FormControl>

//         <field.FormMessage />
//        </field.FormItem>
//       )}
//      />
//      <form.AppField
//       name={"agree"}
//       children={(field) => (
//        <field.FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
//         <field.FormControl>
//          <Checkbox
//           name={"agree"}
//           checked={field.state.value}
//           onBlur={field.handleBlur}
//           onCheckedChange={(checked: boolean) => {
//            field.handleChange(checked);
//           }}
//          />
//         </field.FormControl>
//         <div className="space-y-1 leading-none">
//          <field.FormLabel>
//           I agree to the terms and conditions
//          </field.FormLabel>

//          <field.FormMessage />
//         </div>
//        </field.FormItem>
//       )}
//      />

//       <div className="flex justify-end items-center w-full pt-3">
//        {/* <form.Subscribe selector={(state) => state.isSubmitting}>
//         {(isSubmitting) => (
//          <Button
//           className="rounded-lg"
//           size="sm"
//           type="submit"
//           disabled={isSubmitting}
//          >
//           {isSubmitting ? (
//             <div className="flex items-center gap-2">
//               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//               Submitting...
//             </div>
//           ) : (
//             "Submit"
//           )}
//          </Button>
//         )}
//        </form.Subscribe> */}
//        <form.SubscribeButton label="Submit" />
//       </div>
//     </form>
//    </form.AppForm>
//   </div>
//  );
// }

export function DraftForm() {
  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      message: "",
      formArray_1757573667464: [
        {
          Input_1757573670555: "",
        },
      ],
      formArray_1757573695722: [
        {
          Input_1757573699922: "",
          Input_1757573702722: "",
        },
      ],
    } as z.input<typeof formSchema>,
    validationLogic: revalidateLogic(),
    validators: {
      // onChange: formSchema,
      onDynamic: formSchema,
    },
    onSubmit: ({ value }) => {
      console.log(value);
      toast.success("Submitted Successfully");
    },
  });
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form],
  );
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);
  return (
    <div>
      <form.AppForm>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col p-2 md:p-5 w-full mx-auto rounded-md max-w-3xl gap-2 border"
        >
          <MultiStepViewer form={form} />
          <div className="flex justify-end items-center w-full pt-3">
            <Button className="rounded-lg" size="sm">
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </form.AppForm>
    </div>
  );
}
//------------------------------
// Define the form structure for type inference
const multiStepFormOptions = {
  defaultValues: {
    name: "",
    email: "",
    message: "",
    formArray_1757573667464: [
      {
        Input_1757573670555: "",
      },
    ],
    formArray_1757573695722: [
      {
        Input_1757573699922: "",
        Input_1757573702722: "",
      },
    ],
  } as z.input<typeof formSchema>,
};
//------------------------------
const MultiStepViewer = withForm({
  ...multiStepFormOptions,
  render: function MultiStepFormRender({ form }) {
    const stepFormElements: {
      [key: number]: React.ReactNode;
    } = {
      1: (
        <div>
          <h2 className="text-2xl font-bold">Contact us</h2>
          <p className="text-base">Please fill the form below to contact us</p>

          <div className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2">
            <form.AppField
              name={"name"}
              children={(field) => (
                <field.FormItem className="w-full">
                  <field.FormLabel>Name *</field.FormLabel>
                  <field.FormControl>
                    <Input
                      name={"name"}
                      placeholder="Enter your name"
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </field.FormControl>

                  <field.FormMessage />
                </field.FormItem>
              )}
            />
            <form.AppField
              name={"email"}
              children={(field) => (
                <field.FormItem className="w-full">
                  <field.FormLabel>Email *</field.FormLabel>
                  <field.FormControl>
                    <Input
                      name={"email"}
                      placeholder="Enter your email"
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </field.FormControl>

                  <field.FormMessage />
                </field.FormItem>
              )}
            />
          </div>

          <form.AppField
            name={"message"}
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Message *</field.FormLabel>
                <field.FormControl>
                  <Textarea
                    placeholder="Enter your message"
                    className="resize-none"
                    name={"message"}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </field.FormControl>

                <field.FormMessage />
              </field.FormItem>
            )}
          />
          {form.Field({
            name: "formArray_1757573667464",
            mode: "array",
            children: (field) => (
              <div className="w-full space-y-4">
                {field.state.value.map((_, i) => (
                  <div key={i} className="space-y-3 p-4 relative">
                    <Separator />
                    <form.AppField
                      name={`formArray_1757573667464[${i}].Input_1757573670555`}
                      children={(field) => (
                        <field.FormItem className="w-full">
                          <field.FormLabel>Input Field *</field.FormLabel>
                          <field.FormControl>
                            <Input
                              name={`formArray_1757573667464[${i}].Input_1757573670555`}
                              placeholder="Enter your text"
                              type="text"
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                            />
                          </field.FormControl>

                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    />
                  </div>
                ))}
                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      field.pushValue({
                        Input_1757573670555: "",
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      field.removeValue(field.state.value.length - 1)
                    }
                    disabled={field.state.value.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Remove
                  </Button>
                </div>
              </div>
            ),
          })}
        </div>
      ),
      2: (
        <div>
          {form.Field({
            name: "formArray_1757573695722",
            mode: "array",
            children: (field) => (
              <div className="w-full space-y-4">
                {field.state.value.map((_, i) => (
                  <div key={i} className="space-y-3 p-4 relative">
                    <Separator />

                    <div className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2">
                      <form.AppField
                        name={`formArray_1757573695722[${i}].Input_1757573699922`}
                        children={(field) => (
                          <field.FormItem className="w-full">
                            <field.FormLabel>Input Field *</field.FormLabel>
                            <field.FormControl>
                              <Input
                                name={`formArray_1757573695722[${i}].Input_1757573699922`}
                                placeholder="Enter your text"
                                type="text"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                              />
                            </field.FormControl>

                            <field.FormMessage />
                          </field.FormItem>
                        )}
                      />
                      <form.AppField
                        name={`formArray_1757573695722[${i}].Input_1757573702722`}
                        children={(field) => (
                          <field.FormItem className="w-full">
                            <field.FormLabel>Input Field *</field.FormLabel>
                            <field.FormControl>
                              <Input
                                name={`formArray_1757573695722[${i}].Input_1757573702722`}
                                placeholder="Enter your text"
                                type="text"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                              />
                            </field.FormControl>

                            <field.FormMessage />
                          </field.FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      field.pushValue({
                        Input_1757573699922: "",
                        Input_1757573702722: "",
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      field.removeValue(field.state.value.length - 1)
                    }
                    disabled={field.state.value.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Remove
                  </Button>
                </div>
              </div>
            ),
          })}
        </div>
      ),
    };
    const stepFields: Record<number, Array<string | string[]>> = {
      0: ["message", ["formArray_1757573667464"]],
      1: [["formArray_1757573695722"]],
    };
    const steps = Object.keys(stepFormElements).map(Number);
    const { currentStep, isLastStep, goToNext, goToPrevious } =
      useMultiStepForm({
        initialSteps: stepFields,
        onStepValidation: async (currentStepData) => {
          const validationPromises = currentStepData.map((fieldName) => {
            return form.validateField(fieldName as any, "submit");
          });
          let validationArrayPromises: Promise<unknown[]>[] = [];
          for (const fieldName of currentStepData) {
            if (Array.isArray(fieldName)) {
              validationArrayPromises.push(
                form.validateArrayFieldsStartingFrom(
                  fieldName[0] as any,
                  form.getFieldInfo(fieldName[0] as any).instance?.state.value
                    .length,
                  "submit",
                ),
              );
            }
          }
          await Promise.all(validationPromises);
          await Promise.all(validationArrayPromises);
          const hasErrors = form.getAllErrors();
          // ? This is Necessary if , not when move previous and try to move next , will not work otherwise , cause other step fields have errors
          const hasErrorsFields = currentStepData.filter((fieldName) => {
            if (Array.isArray(fieldName)) {
              // For array fields, check if any field starts with the base field name and array index pattern
              const baseFieldName = fieldName[0] as string;
              const arrayLength =
                form.getFieldInfo(baseFieldName as any).instance?.state.value
                  ?.length || 0;
              // Check all array indices for this field using regex pattern
              for (let i = 0; i < arrayLength; i++) {
                const pattern = new RegExp(`^${baseFieldName}\\[${i}\\]`);
                const hasErrorInIndex = Object.keys(hasErrors.fields).some(
                  (errorField) => pattern.test(errorField),
                );
                if (hasErrorInIndex) {
                  return true;
                }
              }
              return false;
            } else {
              // For regular fields, check if the field name exists in errors
              return Object.keys(hasErrors.fields).includes(
                fieldName as string,
              );
            }
          });
          return hasErrorsFields.length === 0;
        },
      });
    const current = stepFormElements[currentStep];
    const {
      baseStore: {
        state: { isSubmitting },
      },
    } = form;
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
            transition={{ duration: 0.4, type: "spring" }}
            className="flex flex-col gap-2"
          >
            {current}
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center justify-between gap-3 w-full pt-3">
          <Button
            size="sm"
            variant="ghost"
            onClick={goToPrevious}
            type="button"
          >
            Previous
          </Button>
          {isLastStep ? (
            <Button size="sm" type="submit">
              {isSubmitting ? "Submitting..." : "Submit"}
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
  },
});
