import { revalidateLogic } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { FieldDescription } from "@/components/ui/field";
import { useAppForm } from "@/components/ui/tanstack-form";
import { Textarea } from "@/components/ui/textarea";

const draftFormSchema = z.object({
	comment: z.string().min(1, "This field is required"),
});

export function DraftForm() {
	const draftForm = useAppForm({
		defaultValues: {
			comment: "",
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
					<h1 className="text-3xl font-bold">Feedback Form</h1>
					<FieldDescription>"Please provide your feedback"</FieldDescription>;
					<draftForm.AppField name={"comment"}>
						{(field) => (
							<field.FieldSet className="w-full">
								<field.Field>
									<field.FieldLabel htmlFor={"comment"}>
										Feedback Comment *
									</field.FieldLabel>
									<Textarea
										placeholder="Share your feedback"
										required={true}
										disabled={false}
										value={(field.state.value as string | undefined) ?? ""}
										name={"comment"}
										onChange={(e) => field.handleChange(e.target.value)}
										onBlur={field.handleBlur}
										className="resize-none"
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
