/** biome-ignore-all lint/correctness/noChildrenProp: Required for form field rendering */
/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
// apps/web/src/routes/testing/index.tsx

import { revalidateLogic, useStore } from "@tanstack/react-form";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
	MultiSelect,
	MultiSelectContent,
	MultiSelectItem,
	MultiSelectList,
	MultiSelectTrigger,
	MultiSelectValue,
} from "@/components/ui/multi-select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useAppForm } from "@/components/ui/tanstack-form";
import { Textarea } from "@/components/ui/textarea";
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
	formArray_1757004280383: z.array(
		z.object({
			MultiSelect_1757004347270: z.array(
				z.string().min(1, "This field is required"),
			),
			Input_1757005548473: z.string().min(1, "This field is required"),
			Input_1757005553144: z.string().min(1, "This field is required"),
		}),
	),
	Slider_1757004336873: z
		.number()
		.min(0, "Must be at least 0")
		.max(100, "Must be at most 100"),
});

export function DraftForm() {
	const form = useAppForm({
		defaultValues: {
			name: "",
			email: "",
			message: "",
			agree: false,
			formArray_1757004280383: [
				{
					MultiSelect_1757004347270: [],
					Input_1757005548473: "",
					Input_1757005553144: "",
				},
			],
			Slider_1757004336873: 0,
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
						name={message}
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
						name: "formArray_1757004280383",
						mode: "array",
						children: (field) => (
							<div className="w-full space-y-4">
								{field.state.value.map((_, i) => (
									<div key={i} className="space-y-3 p-4 relative">
										<Separator />

										<form.AppField
											name={`formArray_1757004280383[${i}].MultiSelect_1757004347270`}
											children={(field) => {
												const options = [
													{ value: "1", label: "Option 1" },
													{ value: "2", label: "Option 2" },
													{ value: "2", label: "Option 3" },
												];
												return (
													<field.FormItem className="w-full">
														<field.FormLabel>
															Select multiple options *
														</field.FormLabel>
														<MultiSelect
															value={field.state.value}
															onValueChange={field.handleChange}
														>
															<field.FormControl>
																<MultiSelectTrigger>
																	<MultiSelectValue placeholder={"Select Item"} />
																</MultiSelectTrigger>
															</field.FormControl>
															<MultiSelectContent>
																<MultiSelectList>
																	{options.map(({ label, value }) => (
																		<MultiSelectItem key={label} value={value}>
																			{label}
																		</MultiSelectItem>
																	))}
																</MultiSelectList>
															</MultiSelectContent>
														</MultiSelect>

														<field.FormMessage />
													</field.FormItem>
												);
											}}
										/>

										<div className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-2">
											<form.AppField
												name={`formArray_1757004280383[${i}].Input_1757005548473`}
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
												name={`formArray_1757004280383[${i}].Input_1757005553144`}
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
										</div>
									</div>
								))}
								<div className="flex justify-between pt-2">
									<Button
										variant="outline"
										onClick={() =>
											field.pushValue({
												MultiSelect_1757004347270: [],
												Input_1757005548473: "",
												Input_1757005553144: "",
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

					<form.AppField
						name="Slider_1757004336873"
						children={(field) => (
							<field.FormItem>
								<field.FormLabel className="flex justify-between items-center">
									Set Range<span>{field.state.value}/100</span>
								</field.FormLabel>
								<field.FormControl>
									<Slider
										name={field.name}
										min={0}
										max={100}
										step={5}
										defaultValue={[5]}
										onValueChange={(values) => {
											field.handleChange(values[0]);
										}}
									/>
								</field.FormControl>
								<field.FormDescription>
									Adjust the range by sliding.
								</field.FormDescription>
								<field.FormMessage />
							</field.FormItem>
						)}
					/>
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
