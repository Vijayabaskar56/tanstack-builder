/** biome-ignore-all lint/correctness/noChildrenProp: Required for form field rendering */
/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
// apps/web/src/routes/testing/index.tsx
import { revalidateLogic, useStore } from "@tanstack/react-form";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type JSX, useCallback } from "react";
import { toast } from "sonner";
// import * as v from "valibot";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAppForm, withForm } from "@/components/ui/tanstack-form";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
	formArray_1756983656732: z.array(
		z.object({
			RadioGroup_1756983667534: z.string().min(1, "This field is required"),
			Select_1756983672102: z.string().min(1, "This field is required"),
			Input_1756983678351: z.string().min(1, "This field is required"),
			Select_1756983700030: z.string().min(1, "This field is required"),
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
			formArray_1756983656732: [
				{
					RadioGroup_1756983667534: "1",
					Select_1756983672102: "1",
					Input_1756983678351: "",
					Select_1756983700030: "1",
				},
			],
		} as z.infer<typeof formSchema>,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamicAsyncDebounceMs: 500,
			onDynamic: formSchema,
		},
		onSubmit: ({ value }) => {
			console.log(value);
			toast.success("success");
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
					noValidate
				>
					<h2 className="text-2xl font-bold">Contact us</h2>
					<p className="text-base">Please fill the form below to contact us</p>

					<div className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2">
						<form.AppField
							name="name"
							children={(field) => (
								<field.FormItem className="w-full">
									<field.FormLabel>Name *</field.FormLabel>
									<field.FormControl>
										<Input
											name={field.name}
											placeholder="Enter your name"
											type={"text"}
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
							name="email"
							children={(field) => (
								<field.FormItem className="w-full">
									<field.FormLabel>Email *</field.FormLabel>
									<field.FormControl>
										<Input
											name={field.name}
											placeholder="Enter your email"
											type={"email"}
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
						name="message"
						children={(field) => (
							<field.FormItem>
								<field.FormLabel>Message *</field.FormLabel>
								<field.FormControl>
									<Textarea
										placeholder="Enter your message"
										className="resize-none"
										name={field.name}
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
						name="agree"
						children={(field) => (
							<field.FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
								<field.FormControl>
									<Checkbox
										name={field.name}
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
						name: "formArray_1756983656732",
						mode: "array",
						children: (field) => (
							<div className="w-full space-y-4">
								{field.state.value.map((_, i) => (
									<div key={i} className="space-y-3 p-4 relative">
										<Separator />

										<div className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2">
											<form.AppField
												name={`formArray_1756983656732[${i}].RadioGroup_1756983667534`}
												children={(field) => {
													const options = [
														{ value: "option-1", label: "Option 1" },
														{ value: "option-2", label: "Option 2" },
														{ value: "option-3", label: "Option 3" },
													];
													return (
														<field.FormItem className="flex flex-col gap-2 w-full py-1">
															<field.FormLabel>
																Pick one option *
															</field.FormLabel>
															<field.FormControl>
																<RadioGroup
																	name={field.name}
																	onValueChange={field.handleChange}
																	defaultValue={field.state.value}
																>
																	{options.map(({ label, value }) => (
																		<RadioGroupItem
																			key={value}
																			value={value}
																			className="flex items-center gap-x-2"
																		>
																			{label}
																		</RadioGroupItem>
																	))}
																</RadioGroup>
															</field.FormControl>
															<field.FormMessage />
														</field.FormItem>
													);
												}}
											/>
											<form.AppField
												name={`formArray_1756983656732[${i}].Select_1756983672102`}
												children={(field) => {
													const options = [
														{ value: "option-1", label: "Option 1" },
														{ value: "option-2", label: "Option 2" },
														{ value: "option-3", label: "Option 3" },
													];
													return (
														<field.FormItem className="w-full">
															<field.FormLabel>Select option *</field.FormLabel>
															<Select
																name={field.name}
																onValueChange={field.handleChange}
																defaultValue={field.state.value}
																value={field.state.value as string}
															>
																<field.FormControl>
																	<SelectTrigger className="w-full">
																		<SelectValue placeholder="" />
																	</SelectTrigger>
																</field.FormControl>
																<SelectContent>
																	{options.map(({ label, value }) => (
																		<SelectItem key={value} value={value}>
																			{label}
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>

															<field.FormMessage />
														</field.FormItem>
													);
												}}
											/>
										</div>

										<div className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2">
											<form.AppField
												name={`formArray_1756983656732[${i}].Input_1756983678351`}
												children={(field) => (
													<field.FormItem className="w-full">
														<field.FormLabel>Input Field *</field.FormLabel>
														<field.FormControl>
															<Input
																name={field.name}
																placeholder="Enter your text"
																type={"text"}
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
												name={`formArray_1756983656732[${i}].Select_1756983700030`}
												children={(field) => {
													const options = [
														{ value: "option-1", label: "Option 1" },
														{ value: "option-2", label: "Option 2" },
														{ value: "option-3", label: "Option 3" },
													];
													return (
														<field.FormItem className="w-full">
															<field.FormLabel>Select option *</field.FormLabel>
															<Select
																name={field.name}
																onValueChange={field.handleChange}
																defaultValue={field.state.value}
																value={field.state.value as string}
															>
																<field.FormControl>
																	<SelectTrigger className="w-full">
																		<SelectValue placeholder="" />
																	</SelectTrigger>
																</field.FormControl>
																<SelectContent>
																	{options.map(({ label, value }) => (
																		<SelectItem key={value} value={value}>
																			{label}
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>

															<field.FormMessage />
														</field.FormItem>
													);
												}}
											/>
										</div>
									</div>
								))}
								<div className="flex justify-between pt-2">
									<Button
										variant="outline"
										onClick={() =>
											field.pushValue({
												RadioGroup_1756983667534: "1",
												Select_1756983672102: "1",
												Input_1756983678351: "",
												Select_1756983700030: "1",
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
