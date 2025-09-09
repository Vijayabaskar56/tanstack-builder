/** biome-ignore-all lint/correctness/noChildrenProp: Required for form field rendering */
/** biome-ignore-all lint/correctness/useUniqueElementIds: Form elements need unique IDs */
// apps/web/src/routes/testing/index.tsx

import { revalidateLogic, useStore } from "@tanstack/react-form";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useCallback } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useAppForm, withForm } from "@/components/ui/tanstack-form";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useMultiStepForm } from "@/hooks/use-multi-step-form";
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
  lastName: z.string().min(1, "This field is required").optional(),
  yourEmail: z.email(),
  phoneNumber: z.number().optional(),
  preferences: z.array(z.string().min(1, "This field is required")).optional(),
  comment: z.string().min(1, "This field is required").optional()
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
			lastName: "",
			yourEmail: "",
			phoneNumber: 2,
			preferences: [],
			comment: "",
		} as z.infer<typeof formSchema>,
		validators: {
			onChange: formSchema,
		},
		onSubmit: ({ value }) => {
			console.log(value);
			toast.success("Submitted Successfully");
		},
	});
	return (
		<div>
			<form.AppForm>
				<form.Form
				>
					<MultiStepViewer form={form} />
					<div className="flex justify-end items-center w-full pt-3">
       <form.SubmitButton label="Submit" />
					</div>
				</form.Form>
			</form.AppForm>
		</div>
	);
}
//------------------------------
// Define the form structure for type inference
const multiStepFormOptions = {
	defaultValues: {
		name: "",
		lastName: "",
		yourEmail: "",
		phoneNumber: 1,
		preferences: [],
		comment: "",
	} as z.infer<typeof formSchema>,
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
					<h2 className="text-2xl font-bold">Personal Details</h2>
					<p className="text-base">Please provide your personal details</p>
					<form.AppField
						name={"name"}
						children={(field) => (
							<field.FormItem className="w-full">
								<field.FormLabel>First name *</field.FormLabel>
								<field.FormControl>
									<Input
										name={"name"}
										placeholder="First name"
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
						name={"lastName"}
						children={(field) => (
							<field.FormItem className="w-full">
								<field.FormLabel>Last name </field.FormLabel>
								<field.FormControl>
									<Input
										name={"lastName"}
										placeholder="Last name"
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
				</div>
			),
			2: (
				<div>
					<h2 className="text-2xl font-bold">Contact Information</h2>
					<p className="text-base">Please provide your contact information</p>
					<form.AppField
						name={"yourEmail"}
						children={(field) => (
							<field.FormItem className="w-full">
								<field.FormLabel>Your Email *</field.FormLabel>
								<field.FormControl>
									<Input
										name={"yourEmail"}
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

					<form.AppField
						name={"phoneNumber"}
						children={(field) => (
							<field.FormItem className="w-full">
								<field.FormLabel>Phone Number </field.FormLabel>
								<field.FormControl>
									<Input
										name={"phoneNumber"}
										placeholder="Enter your phone number"
										type="number"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(Number(e.target.value))}
									/>
								</field.FormControl>

								<field.FormMessage />
							</field.FormItem>
						)}
					/>
				</div>
			),
			3: (
				<div>
					<h2 className="text-2xl font-bold">Your Preferences</h2>
					<form.AppField
						name={"preferences"}
						children={(field) => {
							const options = [
								{ value: "monday", label: "Mon" },
								{ value: "tuesday", label: "Tue" },
								{ value: "wednesday", label: "Wed" },
								{ value: "thursday", label: "Thu" },
								{ value: "friday", label: "Fri" },
								{ value: "saturday", label: "Sat" },
								{ value: "sunday", label: "Sun" },
							];
							return (
								<field.FormItem className="flex flex-col gap-2 w-full py-1">
									<field.FormLabel>
										Tell us about your interests and preferences.{" "}
									</field.FormLabel>
									<field.FormControl>
										<ToggleGroup
											variant="outline"
											onValueChange={field.handleChange}
											defaultValue={field.state.value}
											type="multiple"
											className="flex justify-start items-center gap-2 flex-wrap"
										>
											{options.map(({ label, value }) => (
												<ToggleGroupItem
													key={value}
													value={value}
													className="flex items-center gap-x-2"
												>
													{label}
												</ToggleGroupItem>
											))}
										</ToggleGroup>
									</field.FormControl>
									undefined
									<field.FormMessage />
								</field.FormItem>
							);
						}}
					/>

					<form.AppField
						name={"comment"}
						children={(field) => (
							<field.FormItem>
								<field.FormLabel>Feedback Comment </field.FormLabel>
								<field.FormControl>
									<Textarea
										placeholder="Share your feedback"
										className="resize-none"
										name={"comment"}
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
			),
		};
		const stepFields: Record<number, string[]> = {
			0: ["name", "lastName"],
			1: ["yourEmail", "phoneNumber"],
			2: ["preferences", "comment"],
		};
		const steps = Object.keys(stepFormElements).map(Number);
		const { currentStep, isLastStep, goToNext, goToPrevious } =
			useMultiStepForm({
				initialSteps: stepFields,
				onStepValidation: async (currentStepData) => {
					const validationPromises = currentStepData.map((fieldName) =>
						form.validateField(fieldName as any, "submit"),
					);
					await Promise.all(validationPromises);
					const hasErrors = form.getAllErrors();
					const hasErrorsFields = currentStepData.filter((fieldName) =>
						Object.keys(hasErrors.fields).includes(fieldName),
					);
					return hasErrorsFields.length === 0;
				},
			});
		const current = stepFormElements[currentStep];
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
     <form.StepButton label="Previous" handleMovement={goToPrevious} />
					{isLastStep ? (
						<form.SubmitButton label="Submit" />
					) : (
      <form.StepButton label="Next" handleMovement={goToNext} />
					)}
				</div>
			</div>
		);
	},
});
