import { revalidateLogic } from "@tanstack/react-form";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { useAppForm } from "@/components/ui/tanstack-form";

const draftFormSchema = z.object({
	email: z.email().optional(),
	password: z.string().min(1, "This field is required"),
});

export function DraftForm() {
	const draftForm = useAppForm({
		defaultValues: {
			email: "",
			password: "",
		} as z.input<typeof draftFormSchema>,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: draftFormSchema,
			onDynamicAsyncDebounceMs: 300,
		},
		onSubmit: ({}) => {
			toast.success("success");
		},
		onSubmitInvalid({ formApi }) {
			const errorMap = formApi.state.errorMap["onDynamic"]!;
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
	return (
		<div>
			<draftForm.AppForm>
				<draftForm.Form>
					<draftForm.FieldLegend className="text-3xl font-bold">
						Login
					</draftForm.FieldLegend>
					<draftForm.FieldDescription>
						Login to create an account
					</draftForm.FieldDescription>
					<draftForm.FieldSeparator />
					<draftForm.AppField name={"email"}>
						{(field) => (
							<field.FieldSet className="w-full">
								<field.Field>
									<field.FieldLabel htmlFor={"email"}>Email </field.FieldLabel>
									<Input
										name={"email"}
										placeholder="Enter your Email"
										type="email"
										value={(field.state.value as string | undefined) ?? ""}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										aria-invalid={!!field.state.meta.errors.length}
									/>
								</field.Field>

								<field.FieldError />
							</field.FieldSet>
						)}
					</draftForm.AppField>
					<draftForm.AppField name={"password"}>
						{(field) => (
							<field.FieldSet className="w-full">
								<field.FieldLabel htmlFor={"password"}>
									Password *
								</field.FieldLabel>
								<field.Field orientation="horizontal">
									<field.InputGroup>
										<field.InputGroupInput
											id={"password"}
											name={"password"}
											placeholder="Password"
											type="password"
											value={(field.state.value as string | undefined) ?? ""}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={!!field.state.meta.errors.length}
										/>
										<field.InputGroupAddon align="inline-end">
											<button
												type="button"
												className="cursor-pointer flex items-center justify-center p-1 hover:bg-gray-100 rounded transition-colors"
												onClick={(e) => {
													const input =
														e.currentTarget.parentElement?.parentElement?.querySelector(
															"input",
														) as HTMLInputElement;
													if (input) {
														input.type =
															input.type === "password" ? "text" : "password";
														const button = e.currentTarget;
														button.setAttribute(
															"data-show",
															input.type === "text" ? "true" : "false",
														);
													}
												}}
												data-show="false"
											>
												<EyeIcon className="size-3 data-[show=true]:hidden" />
												<EyeOffIcon className="size-3 hidden data-[show=true]:block" />
											</button>
										</field.InputGroupAddon>
									</field.InputGroup>
								</field.Field>

								<field.FieldError />
							</field.FieldSet>
						)}
					</draftForm.AppField>
					<div className="flex justify-end items-center w-full pt-3">
						<draftForm.SubmitButton label="Submit" />
					</div>
				</draftForm.Form>
			</draftForm.AppForm>
		</div>
	);
}
