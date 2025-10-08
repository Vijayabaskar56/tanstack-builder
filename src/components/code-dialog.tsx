import { useFormStore } from "@/hooks/use-form-store";
import useSettings from "@/hooks/use-settings";
import { useEffect, useState } from "react";
import { generateFormCode } from "@/lib/form-code-generators/react/generate-form-code";
import { FormElementOrList, FormElement, FormArray } from "@/types/form-types";
import { generateValidationCode } from "@/lib/schema-generators";
import { generateImports } from "@/lib/form-code-generators/react/generate-imports";
import { extractImportDependencies } from "@/lib/form-code-generators/react/generate-imports";
import { CreateRegistryResponse } from "@/types/form-types";
import { useMutation } from "@tanstack/react-query";
import { useAppForm } from "./ui/tanstack-form";
import { revalidateLogic } from "./ui/tanstack-form";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./ui/input-group";
import { Spinner } from "./ui/spinner";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { GeneratedFormCodeViewer } from "./generated-code/code-viewer";
import { ResponsiveDialog, ResponsiveDialogContent, ResponsiveDialogDescription, ResponsiveDialogHeader, ResponsiveDialogTitle, ResponsiveDialogTrigger } from "./ui/revola";
import { TerminalIcon } from "./ui/terminal";
import { AnimatedIconButton } from "./ui/animated-icon-button";
import * as z from "zod";
const formSchema = z.object({
	formName: z.string().min(1, { message: "Form name is required" }),
});
function CodeDialog() {
	const {
		formName,
		actions,
		formElements,
		validationSchema,
		isMS,
		schemaName,
	} = useFormStore();
	const settings = useSettings();
	const [open, setOpen] = useState(false);
	const [isGenerateSuccess, setIsGenerateSuccess] = useState(false);
	const [generatedId, setGeneratedId] = useState<string>("");

	useEffect(() => {
		setIsGenerateSuccess(false);
		setGeneratedId("");
	}, [formElements]);
	const tabsData = [
		{
			value: "pnpm",
			registery: `pnpm dlx shadcn@canary add ${generatedId}`,
		},
		{
			value: "npm",
			registery: `npx shadcn@canary add ${generatedId}`,
		},
		{
			value: "yarn",
			registery: `yarn shadcn@canary add ${generatedId}`,
		},
		{
			value: "bun",
			registery: `bunx --bun shadcn@canary add ${generatedId}`,
		},
	];
	const generatedCode = generateFormCode({
		formElements: formElements as FormElementOrList[],
		isMS,
		validationSchema,
		settings,
		formName,
	});
	const validationCode = generateValidationCode();
	const importDependencies = generateImports(
		formElements as (FormElement | FormArray)[],
		validationSchema,
		isMS,
		schemaName,
	);
	const files = [
		{
			path: `components/${formName}.tsx`,
			content: generatedCode?.[0].code,
			type: "registry:component",
			target: "",
		},
		{
			path: `lib/${schemaName}.tsx`,
			content: validationCode,
			type: "registry:lib",
			target: "",
		},
	];
	const payload = {
		...extractImportDependencies(importDependencies),
		files,
		name: formName,
	};
	const url = import.meta.env.MODE === 'development' ? "http://localhost:3000" : "https://tan-form-builder.baskar.dev"
	const mutation = useMutation<CreateRegistryResponse, Error, void>({
		mutationKey: ["/create-command", formName],
		mutationFn: async (): Promise<CreateRegistryResponse> => {
			const res = await fetch(`${url}/r/${formName}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});
			const data: CreateRegistryResponse = await res.json();
			if (data.error) {
				form.setErrorMap({
					onDynamic: {
						fields: {
							formName: {
								message: data.error,
							},
						},
					},
				});
				throw new Error(data.error);
			}
			return data;
		},
	});
	const form = useAppForm({
		defaultValues: {
			formName: formName,
		} as z.input<typeof formSchema>,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: formSchema,
			onDynamicAsyncDebounceMs: 300,
		},
		onSubmit: async ({}) => {
			const result = await mutation.mutateAsync();
			console.log("Response:", result);
			if (result.data?.id) {
				setGeneratedId(result.data.id);
				setIsGenerateSuccess(true);
			}
		},
		onSubmitInvalid({ formApi }) {
			const errorMap = formApi.state.errorMap["onDynamic"];
			if (!errorMap) return;

			const inputs = Array.from(
				document.querySelectorAll("#generatedCodeForm input"),
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
		listeners: {
			onChangeDebounceMs: 300,
			onChange: ({ fieldApi }) => {
				console.log(fieldApi.state.value);
				fieldApi.state.value = fieldApi.state.value.toLowerCase().replace(/[^a-z0-9]/g, "").replace(/_+/g, "").replace(/^_|_$/g, "");
				actions.setFormName(fieldApi.state.value as string);
			},
		},
	});
	return (
		<ResponsiveDialog open={open} onOpenChange={setOpen}>
			<ResponsiveDialogTrigger asChild>
				<AnimatedIconButton
					icon={<TerminalIcon className="w-4 h-4 mr-1" />}
					text={<span className="hidden xl:block ml-1">Code</span>}
					variant={"ghost"}
					size="sm"
				/>
			</ResponsiveDialogTrigger>
			<ResponsiveDialogContent className="max-w-6xl lg:max-w-4xl max-h-[85vh] p-0">
				<div className="flex flex-col h-full max-h-[85vh]">
					<ResponsiveDialogHeader className="p-6 pb-4 border-b">
						<ResponsiveDialogTitle>Generated Code</ResponsiveDialogTitle>
						<ResponsiveDialogDescription>
							Copy the code below and build awesome stuff
						</ResponsiveDialogDescription>
					</ResponsiveDialogHeader>
					<form.AppForm>
						<form.Form id="generatedCodeForm" className="px-6 pt-4">
							<form.AppField name={"formName"}>
								{(field) => (
									<field.FieldSet className="w-full">
										<field.Field
											aria-invalid={!!field.state.meta.errors.length}
										>
											<field.FieldLabel htmlFor={"formName"}>
												Form Name
											</field.FieldLabel>
											<InputGroup>
												<InputGroupInput
													id="formName"
													name={"formName"}
													aria-invalid={!!field.state.meta.errors.length}
													placeholder="Enter your form name eg:- contactUs"
													type="string"
													value={field.state.value as string}
													onChange={(e) => field.handleChange(e.target.value)}
													onBlur={field.handleBlur}
													disabled={isGenerateSuccess}
												/>
												<InputGroupAddon align="inline-end">
													{mutation.isPending ? (
														<InputGroupButton
															variant="secondary"
															type="button"
															disabled
														>
															<Spinner className="w-4 h-4 mr-2" />
															Generating...
														</InputGroupButton>
													) : (
														<InputGroupButton
															variant="secondary"
															type="submit"
															disabled={
																form.state.isSubmitting || isGenerateSuccess
															}
														>
															Generate Command
														</InputGroupButton>
													)}
												</InputGroupAddon>
											</InputGroup>
										</field.Field>
										<field.FieldError />
									</field.FieldSet>
								)}
							</form.AppField>
						</form.Form>
					</form.AppForm>
					<Separator className="my-4" />
					<ScrollArea className="flex-1 px-6 py-4">
						<GeneratedFormCodeViewer
							isGenerateSuccess={isGenerateSuccess}
							generatedId={generatedId}
							tabsData={tabsData}
						/>
					</ScrollArea>
				</div>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}

export default CodeDialog;  