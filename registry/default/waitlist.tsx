import { revalidateLogic } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { FieldDescription, FieldLegend } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAppForm } from "@/components/ui/tanstack-form";

const draftFormSchema = z.object({
	email: z.email(),
});

export function DraftForm() {
	const draftForm = useAppForm({
		defaultValues: {
			email: "",
		} as z.input<typeof draftFormSchema>,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: draftFormSchema,
			onDynamicAsyncDebounceMs: 300,
		},
		onSubmit: ({ value }) => {
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
					<h1 className="text-3xl font-bold">Waitlist</h1>
					<FieldDescription>
						"Join our waitlist to get early access"
					</FieldDescription>
					;
					<draftForm.AppField name={"email"}>
						{(field) => (
							<field.FieldSet className="w-full">
								<field.Field>
									<field.FieldLabel htmlFor={"email"}>
										Your Email *
									</field.FieldLabel>
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
					<div className="flex justify-end items-center w-full pt-3">
						<draftForm.SubmitButton label="Submit" />
					</div>
				</draftForm.Form>
			</draftForm.AppForm>
		</div>
	);
}
