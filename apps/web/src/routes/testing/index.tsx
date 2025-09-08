// testing.tsx
/** biome-ignore-all lint/correctness/noChildrenProp: Required for form field rendering */
/** biome-ignore-all lint/correctness/useUniqueElementIds: ids are preview-only */
// apps/web/src/routes/testing/index.tsx

import { useStore } from "@tanstack/react-form";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAppForm, withForm } from "@/components/ui/tanstack-form";
import { Textarea } from "@/components/ui/textarea";
import type { FormStep } from "@/form-types";
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
	email: z.email(),
	message: z.string().min(1, "This field is required"),
	agree: z.boolean(),
	formArray_1757315992193: z.array(
		z.object({
			Checkbox_1757315993905: z.boolean(),
			Checkbox_1757315995808: z.boolean(),
		}),
	),
	formArray_1757316008481: z.array(
		z.object({
			Input_1757316012114: z.string().min(1, "This field is required"),
			Input_1757316014721: z.string().min(1, "This field is required"),
		}),
	),
});

export function DraftForm() {
	const form = useAppForm({
		defaultValues: {
			name: "",
			email: "",
			message: "",
			agree: false,
			formArray_1757315992193: [
				{
					Checkbox_1757315993905: false,
					Checkbox_1757315995808: false,
				},
			],
			formArray_1757316008481: [
				{
					Input_1757316012114: "",
					Input_1757316014721: "",
				},
			],
		} as z.infer<typeof formSchema>,
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
	defaultValues: {
		name: "",
		email: "",
		message: "",
		agree: false,
		formArray_1757315992193: [
			{
				Checkbox_1757315993905: false,
				Checkbox_1757315995808: false,
			},
		],
		formArray_1757316008481: [
			{
				Input_1757316012114: "",
				Input_1757316014721: "",
			},
		],
	} as z.infer<typeof formSchema>,
};
const MultiStepViewer = withForm({
	...multiStepFormOptions,
	render: function MultiStepFormRender({ form }) {
		const collectedFieldNamesRef = useRef<Set<string>>(new Set());
		// Reset the collected field names at the start of each render
		collectedFieldNamesRef.current = new Set();
		type CollectingAppFieldProps = { name: string; children: unknown } & Record<
			string,
			unknown
		>;
		const CollectingAppField: React.FC<CollectingAppFieldProps> = (props) => {
			if (typeof props?.name === "string") {
				collectedFieldNamesRef.current.add(props.name);
			}
			// biome-ignore lint/suspicious/noExplicitAny: forwarding dynamic props for test harness
			return <form.AppField {...(props as any)} />;
		};
		const stepFormElements: {
			[key: number]: React.ReactElement;
		} = {
			1: (
				<div className="space-y-4">
					<h2 className="text-2xl font-bold">Contact us</h2>
					<p className="text-base">Please fill the form below to contact us</p>
					<div className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2">
						<CollectingAppField
							name={"name"}
							/** biome-ignore lint/suspicious/noExplicitAny: form field generic is internal */
							children={(field: any) => (
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
						<CollectingAppField
							name={"email"}
							/** biome-ignore lint/suspicious/noExplicitAny: form field generic is internal */
							children={(field: any) => (
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

					<CollectingAppField
						name={"message"}
						/** biome-ignore lint/suspicious/noExplicitAny: form field generic is internal */
						children={(field: any) => (
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
					<CollectingAppField
						name={"agree"}
						/** biome-ignore lint/suspicious/noExplicitAny: form field generic is internal */
						children={(field: any) => (
							<field.FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
								<field.FormControl>
									<Checkbox
										name={"agree"}
										checked={field.state.value}
										onBlur={field.handleBlur}
										onCheckedChange={(checked: boolean) => {
											field.handleChange(checked);
										}}
									/>
								</field.FormControl>
								<div className="space-y-1 leading-none">
									<field.FormLabel>
										I agree to the terms and conditions
									</field.FormLabel>

									<field.FormMessage />
								</div>
							</field.FormItem>
						)}
					/>
					{form.Field({
						name: "formArray_1757315992193",
						mode: "array",
						children: (field) => (
							<div className="w-full space-y-4">
								{field.state.value.map((_, i) => (
									/** biome-ignore lint/suspicious/noArrayIndexKey: using index for demo array rows */
									<div key={i} className="space-y-3 p-4 relative">
										<Separator />

										<div className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2">
											<CollectingAppField
												name={`formArray_1757315992193[${i}].Checkbox_1757315993905`}
												/** biome-ignore lint/suspicious/noExplicitAny: form field generic is internal */
												children={(field: any) => (
													<field.FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
														<field.FormControl>
															<Checkbox
																name={`formArray_1757315992193[${i}].Checkbox_1757315993905`}
																checked={field.state.value}
																onBlur={field.handleBlur}
																onCheckedChange={(checked: boolean) => {
																	field.handleChange(checked);
																}}
															/>
														</field.FormControl>
														<div className="space-y-1 leading-none">
															<field.FormLabel>Checkbox Label</field.FormLabel>

															<field.FormMessage />
														</div>
													</field.FormItem>
												)}
											/>
											<CollectingAppField
												name={`formArray_1757315992193[${i}].Checkbox_1757315995808`}
												/** biome-ignore lint/suspicious/noExplicitAny: form field generic is internal */
												children={(field: any) => (
													<field.FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
														<field.FormControl>
															<Checkbox
																name={`formArray_1757315992193[${i}].Checkbox_1757315995808`}
																checked={field.state.value}
																onBlur={field.handleBlur}
																onCheckedChange={(checked: boolean) => {
																	field.handleChange(checked);
																}}
															/>
														</field.FormControl>
														<div className="space-y-1 leading-none">
															<field.FormLabel>Checkbox Label</field.FormLabel>

															<field.FormMessage />
														</div>
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
												Checkbox_1757315993905: false,
												Checkbox_1757315995808: false,
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
						name: "formArray_1757316008481",
						mode: "array",
						children: (field) => (
							<div className="w-full space-y-4">
								{field.state.value.map((_, i) => (
									/** biome-ignore lint/suspicious/noArrayIndexKey: using index for demo array rows */
									<div key={i} className="space-y-3 p-4 relative">
										<Separator />

										<div className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2">
											<CollectingAppField
												name={`formArray_1757316008481[${i}].Input_1757316012114`}
												/** biome-ignore lint/suspicious/noExplicitAny: form field generic is internal */
												children={(field: any) => (
													<field.FormItem className="w-full">
														<field.FormLabel>Input Field *</field.FormLabel>
														<field.FormControl>
															<Input
																name={`formArray_1757316008481[${i}].Input_1757316012114`}
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
											<CollectingAppField
												name={`formArray_1757316008481[${i}].Input_1757316014721`}
												/** biome-ignore lint/suspicious/noExplicitAny: form field generic is internal */
												children={(field: any) => (
													<field.FormItem className="w-full">
														<field.FormLabel>Input Field *</field.FormLabel>
														<field.FormControl>
															<Input
																name={`formArray_1757316008481[${i}].Input_1757316014721`}
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
												Input_1757316012114: "",
												Input_1757316014721: "",
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
		const steps = Object.keys(stepFormElements).map(Number);
		const fields = Object.keys(formSchema.shape);
		const { currentStep, isLastStep, goToNext, goToPrevious } =
			useMultiStepForm({
				initialSteps: steps as unknown as FormStep[],
				onStepValidation: async () => {
					const fieldPaths = Array.from(collectedFieldNamesRef.current);
					let isValid = true;
					for (const fieldName of fieldPaths) {
						const fieldValid = await form.validateField(
							fieldName as never,
							"change",
						);
						isValid = isValid && Boolean(fieldValid);
					}
					return isValid;
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
