import { revalidateLogic } from "@tanstack/react-form";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import * as z from "zod";
import { FieldDescription, FieldLegend } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useAppForm, withFieldGroup } from "@/components/ui/tanstack-form";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useFormStepper } from "@/hooks/use-stepper";

export const surveyFormFormSchema = z.object({
	name: z.string().min(1, "This field is required"),
	lastName: z.string().min(1, "This field is required"),
	yourEmail: z.email(),
	phoneNumber: z.number(),
	preferences: z.array(z.string().min(1, "This field is required")),
	comment: z.string().min(1, "This field is required"),
});
export const stepSchemas = [
	// Step 1
	surveyFormFormSchema.pick({
		name: true,
		lastName: true,
	}),
	// Step 2
	surveyFormFormSchema.pick({
		yourEmail: true,
		phoneNumber: true,
	}),
	// Step 3
	surveyFormFormSchema.pick({
		preferences: true,
		comment: true,
	}),
];

const Step1Group = withFieldGroup({
	defaultValues: {
		name: "",
		lastName: "",
	},
	render: function Step1Render({ group }) {
		return (
			<div>
				<h2 className="text-2xl font-bold">Step 1</h2>
				<h2 className="text-2xl font-bold">Personal Details</h2>
				<FieldDescription>
					"Please provide your personal details"
				</FieldDescription>
				;
				<group.AppField name={"name"}>
					{(field) => (
						<field.FieldSet className="w-full">
							<field.Field>
								<field.FieldLabel htmlFor={"name"}>
									First name *
								</field.FieldLabel>
								<Input
									name={"name"}
									placeholder="First name"
									type="text"
									value={(field.state.value as string | undefined) ?? ""}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									aria-invalid={!!field.state.meta.errors.length}
								/>
							</field.Field>

							<field.FieldError />
						</field.FieldSet>
					)}
				</group.AppField>
				<group.AppField name={"lastName"}>
					{(field) => (
						<field.FieldSet className="w-full">
							<field.Field>
								<field.FieldLabel htmlFor={"lastName"}>
									Last name{" "}
								</field.FieldLabel>
								<Input
									name={"lastName"}
									placeholder="Last name"
									type="text"
									value={(field.state.value as string | undefined) ?? ""}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									aria-invalid={!!field.state.meta.errors.length}
								/>
							</field.Field>

							<field.FieldError />
						</field.FieldSet>
					)}
				</group.AppField>
			</div>
		);
	},
});
const Step2Group = withFieldGroup({
	defaultValues: {
		yourEmail: "",
		phoneNumber: 0,
	},
	render: function Step2Render({ group }) {
		return (
			<div>
				<h2 className="text-2xl font-bold">Step 2</h2>
				<h2 className="text-2xl font-bold">Contact Information</h2>
				<FieldDescription>
					"Please provide your contact information"
				</FieldDescription>
				;
				<group.AppField name={"yourEmail"}>
					{(field) => (
						<field.FieldSet className="w-full">
							<field.Field>
								<field.FieldLabel htmlFor={"yourEmail"}>
									Your Email *
								</field.FieldLabel>
								<Input
									name={"yourEmail"}
									placeholder="Enter your email"
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
				</group.AppField>
				<group.AppField name={"phoneNumber"}>
					{(field) => (
						<field.FieldSet className="w-full">
							<field.Field>
								<field.FieldLabel htmlFor={"phoneNumber"}>
									Phone Number{" "}
								</field.FieldLabel>
								<Input
									name={"phoneNumber"}
									placeholder="Enter your phone number"
									type="number"
									inputMode="decimal"
									value={(field.state.value as string | undefined) ?? ""}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.valueAsNumber)}
									aria-invalid={!!field.state.meta.errors.length}
								/>
							</field.Field>

							<field.FieldError />
						</field.FieldSet>
					)}
				</group.AppField>
			</div>
		);
	},
});
const Step3Group = withFieldGroup({
	defaultValues: {
		preferences: [] as string[],
		comment: "",
	},
	render: function Step3Render({ group }) {
		return (
			<div>
				<h2 className="text-2xl font-bold">Step 3</h2>
				<h2 className="text-2xl font-bold">Your Preferences</h2>
				<group.AppField name={"preferences"}>
					{(field) => {
						const options = [
							{ label: "Technology", value: "technology" },
							{ label: "Business", value: "Business" },
							{ label: "Health", value: "Health" },
							{ label: "Science", value: "Science" },
						];
						return (
							<field.FieldSet className="flex flex-col gap-2 w-full py-1">
								<field.Field>
									<field.FieldLabel className="mt-0" htmlFor={"preferences"}>
										Tell us about your interests and preferences.
									</field.FieldLabel>

									<ToggleGroup
										type="multiple"
										variant="outline"
										onValueChange={field.handleChange}
										className="flex justify-start items-center w-full"
										aria-invalid={!!field.state.meta.errors.length}
									>
										{options.map(({ label, value }) => (
											<ToggleGroupItem
												name={"preferences"}
												value={value}
												key={value}
												disabled={false}
												className="flex items-center gap-x-2 px-1"
											>
												{label}
											</ToggleGroupItem>
										))}
									</ToggleGroup>
								</field.Field>

								<field.FieldError />
							</field.FieldSet>
						);
					}}
				</group.AppField>

				<group.AppField name={"comment"}>
					{(field) => (
						<field.FieldSet className="w-full">
							<field.Field>
								<field.FieldLabel htmlFor={"comment"}>
									Feedback Comment{" "}
								</field.FieldLabel>
								<Textarea
									placeholder="Share your feedback"
									required={false}
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
				</group.AppField>
			</div>
		);
	},
});
export function SurveyFormForm() {
	const {
		currentValidator,
		step,
		currentStep,
		isFirstStep,
		handleCancelOrBack,
		handleNextStepOrSubmit,
	} = useFormStepper(stepSchemas);
	const surveyFormForm = useAppForm({
		defaultValues: {
			name: "",
			lastName: "",
			yourEmail: "",
			phoneNumber: 0,
			preferences: [],
			comment: "",
		} as z.input<typeof surveyFormFormSchema>,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: currentValidator as typeof surveyFormFormSchema,
			onDynamicAsyncDebounceMs: 300,
		},
		onSubmit: ({ value }) => {
			toast.success("Submitted Successfully");
		},
	});
	const groups: Record<number, React.ReactNode> = {
		1: (
			<Step1Group
				form={surveyFormForm}
				fields={{ name: "name", lastName: "lastName" }}
			/>
		),
		2: (
			<Step2Group
				form={surveyFormForm}
				fields={{ yourEmail: "yourEmail", phoneNumber: "phoneNumber" }}
			/>
		),
		3: (
			<Step3Group
				form={surveyFormForm}
				fields={{ preferences: "preferences", comment: "comment" }}
			/>
		),
	};
	const handleNext = async () => {
		await handleNextStepOrSubmit(surveyFormForm);
	};
	const handlePrevious = () => {
		handleCancelOrBack({
			onBack: () => {},
		});
	};
	const current = groups[currentStep];
	return (
		<div>
			<surveyFormForm.AppForm>
				<surveyFormForm.Form>
					<div className="flex flex-col gap-2 pt-3">
						<div className="flex flex-col items-center justify-start gap-1">
							<span>
								Step {currentStep} of {Object.keys(groups).length}
							</span>
							<Progress
								value={(currentStep / Object.keys(groups).length) * 100}
							/>
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
							<surveyFormForm.StepButton
								label="Previous"
								disabled={isFirstStep}
								handleMovement={() =>
									handleCancelOrBack({
										onBack: () => handlePrevious(),
									})
								}
							/>
							{step.isCompleted ? (
								<surveyFormForm.SubmitButton
									label="Submit"
									onClick={() => handleNextStepOrSubmit(surveyFormForm)}
								/>
							) : (
								<surveyFormForm.StepButton
									label="Next"
									handleMovement={handleNext}
								/>
							)}
						</div>
					</div>
				</surveyFormForm.Form>
			</surveyFormForm.AppForm>
		</div>
	);
}
