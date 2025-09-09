// testing.tsx
/** biome-ignore-all lint/correctness/noChildrenProp: Required for form field rendering */
/** biome-ignore-all lint/correctness/useUniqueElementIds: ids are preview-only */
// apps/web/src/routes/testing/index.tsx

import { useStore } from "@tanstack/react-form";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useCallback } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
	phoneNumber: z.string().optional(),
	preferences: z.array(z.string().min(1, "This field is required")).optional(),
	comment: z.string().min(1, "This field is required").optional(),
});
export function DraftForm() {
	const form = useAppForm({
		defaultValues: {} as z.infer<typeof formSchema>,
		validators: {
			onChange: formSchema,
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
	defaultValues: {} as z.infer<typeof formSchema>,
};
//------------------------------
const MultiStepViewer = withForm({
	...multiStepFormOptions,
	render: function MultiStepFormRender({ form }) {
		const stepFormElements: {
			[key: number]: React.ReactNode;
		} = {
			1: (
				<div className="space-x-4">
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
				<div className="space-x-4">
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
										onChange={(e) => field.handleChange(e.target.value)}
									/>
								</field.FormControl>

								<field.FormMessage />
							</field.FormItem>
						)}
					/>
				</div>
			),
			3: (
				<div className="space-x-4">
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
											defaultValue={field.state.value || []}
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

		const steps = Object.keys(stepFormElements).map(Number);
		const fields = Object.keys(formSchema.shape);
		const stepFields: Record<number, string[]> = {
			1: fields.slice(0, 2),
			2: fields.slice(2, 4),
			3: fields.slice(4, 6),
		};
		const stepObjects = steps.map((step) => ({
			id: step.toString(),
			stepFields: stepFields[step],
		}));
		const { currentStep, isLastStep, goToNext, goToPrevious } =
			useMultiStepForm({
				initialSteps: stepObjects as any,
				onStepValidation: async (currentStepData) => {
					const validationPromises = (currentStepData.stepFields as unknown as string[]).map(
						(fieldName) =>
							form.validateField(
								fieldName as any,
								"submit",
							),
					);

					await Promise.all(validationPromises);
					const hasErrors = form.getAllErrors();
					return Object.keys(hasErrors.fields).length === 0;
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
