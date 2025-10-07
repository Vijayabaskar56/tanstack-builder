import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	ResponsiveDialog,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle,
	ResponsiveDialogTrigger,
} from "@/components/ui/revola";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { settingsCollection } from "@/db-collections/settings.collections";
import { useFormBuilder } from "@/hooks/use-form-builder";
import { useFormStore } from "@/hooks/use-form-store";
import useSettings from "@/hooks/use-settings";
import { generateFormCode } from "@/lib/form-code-generators/react/generate-form-code";
import {
	extractImportDependencies,
	generateImports,
} from "@/lib/form-code-generators/react/generate-imports";
import { generateValidationCode } from "@/lib/schema-generators";
import type { CreateRegistryResponse } from "@/types/form-types";
import { FormArray, FormElement, FormElementOrList } from "@/types/form-types";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { Brackets } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import type { Framework, ValidationSchema } from "./builder/types";
import { GeneratedFormCodeViewer } from "./generated-code/code-viewer";
import {
	AnimatedIconButton,
	AnimatedIconSpan,
} from "./ui/animated-icon-button";
import { BlocksIcon } from "./ui/blocks";
import { ChevronDownIcon } from "./ui/chevron-down";
import { HeartIcon } from "./ui/heart";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "./ui/input-group";
import { LayersIcon } from "./ui/layers";
import { LayoutPanelTopIcon } from "./ui/layout-panel-top";
import { RotateCWIcon } from "./ui/rotate-cw";
import { Separator } from "./ui/separator";
import { SettingsGearIcon } from "./ui/settings-gear";
import { ShareIcon } from "./ui/share";
import { Spinner } from "./ui/spinner";
import { revalidateLogic, useAppForm } from "./ui/tanstack-form";
import { TerminalIcon } from "./ui/terminal";
const formSchema = z.object({
	formName: z.string().min(1, { message: "Form name is required" }),
});
// Code Dialog Component with ResponsiveDialog
export function CodeDialog() {
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
			path: `lib/${formName}.tsx`,
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
	const mutation = useMutation<CreateRegistryResponse, Error, void>({
		mutationKey: ["/create-command", formName],
		mutationFn: async (): Promise<CreateRegistryResponse> => {
			const res = await fetch(`http://localhost:3000/r/${formName}`, {
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

export default function FormHeader() {
	const location = useLocation();
	const { activeTab, preferredFramework, preferredSchema } = useSettings();
	const frameworks = ["react", "vue", "angular", "solid"];
	const validationLibs = ["zod", "valibot", "arktype"];

	const isFormBuilder = location.pathname.startsWith("/form-builder");

	const handleSubTabChange = (newSubTab: string) => {
		settingsCollection?.update("user-settings", (draft) => {
			draft.activeTab = newSubTab as "builder" | "template" | "settings";
		});
	};

	const id = useId();
	const { actions, isMS, framework, validationSchema, formElements } =
		useFormStore();
	const { resetForm } = useFormBuilder();

	// Sync form store with preferred settings on initial load or when settings change
	// biome-ignore lint/correctness/useExhaustiveDependencies: Avoid overriding user selections by excluding framework from deps
	useEffect(() => {
		if (preferredFramework && preferredFramework !== framework) {
			actions.setFramework(preferredFramework as Framework);
		}
	}, [preferredFramework, actions]); // Remove framework from deps to avoid overriding user selections

	// biome-ignore lint/correctness/useExhaustiveDependencies: Avoid overriding user selections by excluding validationSchema from deps
	useEffect(() => {
		if (preferredSchema && preferredSchema !== validationSchema) {
			actions.setValidationSchema(preferredSchema as ValidationSchema);
		}
	}, [preferredSchema, actions]); // Remove validationSchema from deps to avoid overriding user selections

	// Save dialog state
	const [saveDialogOpen, setSaveDialogOpen] = useState(false);
	const [saveFormName, setSaveFormName] = useState("");

	const handleSaveForm = () => {
		if (saveFormName.trim()) {
			actions.saveForm(saveFormName.trim());
			setSaveDialogOpen(false);
			setSaveFormName("");
		}
	};

	function handleShare() {
		console.log(
			formElements,
			`http://localhost:3000/form-builder?share=${encodeURIComponent(JSON.stringify(formElements))}`,
		);
		navigator.clipboard.writeText(
			`https://tan-form-builder.baskar.dev/form-builder?share=${encodeURIComponent(JSON.stringify(formElements))}`,
		);
		toast("Link Copied to clipboard");
	}

	return (
		<header className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="flex h-auto lg:h-14 border-b items-center mx-3 flex-col lg:flex-row justify-between">
				{/* Tabs section */}
				{isFormBuilder && (
					<div className="order-2 lg:order-1 flex-shrink-0 mr-4 w-full lg:w-auto py-3 border-t-1 md:border-0 mx-3">
						<Tabs
							value={activeTab}
							onValueChange={handleSubTabChange}
							className="flex"
						>
							<TabsList className="bg-background h-auto -space-x-px p-0 shadow-xs w-full lg:w-auto">
								<TabsTrigger value="builder" className="flex-1">
									<AnimatedIconButton
										renderAs="span"
										icon={
											<BlocksIcon
												className="-ms-0.5 me-1.5 opacity-60"
												size={16}
											/>
										}
										className="flex"
										text="Builder"
									/>
								</TabsTrigger>
								<TabsTrigger value="template" className="flex-1">
									<AnimatedIconButton
										renderAs="span"
										icon={
											<LayoutPanelTopIcon
												className="-ms-0.5 me-1.5 opacity-60"
												size={16}
											/>
										}
										className="flex"
										text="Template"
									/>
								</TabsTrigger>
								<TabsTrigger value="settings" className="flex-1">
									<AnimatedIconButton
										renderAs="span"
										icon={
											<SettingsGearIcon
												className="-ms-0.5 me-1.5 opacity-60"
												size={16}
											/>
										}
										className="flex"
										text="Settings"
									/>
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
				)}
				{/* Actions section */}
				<ScrollArea className="md:w-fit w-full py-2 order-1 lg:order-2">
					<div className="flex items-center gap-2">
						<nav className="flex items-center space-x-2">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<AnimatedIconButton
										icon={<ChevronDownIcon className="w-4 h-4 ml-1" />}
										text={
											framework.charAt(0).toUpperCase() + framework.slice(1)
										}
										variant="ghost"
										size="sm"
										iconPosition="end"
									/>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									{frameworks.map((framework) => (
										<DropdownMenuItem
											key={framework}
											disabled={framework !== "react"}
											onClick={() =>
												actions.setFramework(framework as Framework)
											}
										>
											{framework.charAt(0).toUpperCase() + framework.slice(1)}
											{framework !== "react" && (
												<p className="text-primary">soon!</p>
											)}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
							<div className="h-4 w-px bg-border" />
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<AnimatedIconButton
										icon={<ChevronDownIcon className="w-4 h-4 ml-1" />}
										text={
											validationSchema.charAt(0).toUpperCase() +
											validationSchema.slice(1)
										}
										variant="ghost"
										size="sm"
										iconPosition="end"
									/>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									{validationLibs.map((lib) => (
										<DropdownMenuItem
											key={lib}
											onClick={() =>
												actions.setValidationSchema(lib as ValidationSchema)
											}
										>
											{lib.charAt(0).toUpperCase() + lib.slice(1)}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</nav>

						<div className="h-4 w-px bg-border" />
						<div
							className="group inline-flex items-center gap-2"
							data-state={isMS ? "checked" : "unchecked"}
						>
							<Switch
								id={id}
								checked={isMS}
								onCheckedChange={() => actions.setIsMS(!isMS)}
								aria-labelledby={`${id}-off ${id}-on`}
								aria-label="Toggle between dark and light mode"
							/>
							<AnimatedIconSpan
								icon={<LayersIcon size={16} aria-hidden="true" />}
								text="Multi Step Form"
								onClick={() => actions.setIsMS(!isMS)}
								className="group-data-[state=unchecked]:text-muted-foreground/70 flex gap-2 items-center cursor-pointer text-left text-sm font-medium"
								textClassName="hidden xl:block ml-1"
								aria-controls={id}
								id={`${id}-on`}
							/>
						</div>
						<div className="h-4 w-px bg-border" />
						<Button
							variant="ghost"
							size="sm"
							onClick={() => actions.addFormArray([])}
						>
							<Brackets className="w-4 h-4 mr-1" />
							<span className="hidden xl:block ml-1">Field Array</span>
						</Button>
						<div className="h-4 w-px bg-border" />
						<AnimatedIconButton
							icon={<RotateCWIcon className="w-4 h-4 mr-1" />}
							text={<span className="hidden xl:block ml-1">Reset</span>}
							variant="ghost"
							onClick={() => {
								resetForm();
							}}
						/>
						<div className="h-4 w-px bg-border" />
						<AnimatedIconButton
							icon={<ShareIcon className="w-4 h-4 mr-1" />}
							text={<span className="hidden xl:block ml-1">Share</span>}
							onClick={() => handleShare()}
						/>
						<div className="h-4 w-px bg-border" />

						<ResponsiveDialog
							open={saveDialogOpen}
							onOpenChange={setSaveDialogOpen}
						>
							<ResponsiveDialogTrigger asChild>
								<AnimatedIconButton
									icon={<HeartIcon className="w-4 h-4 mr-1" />}
									text={<span className="hidden xl:block ml-1">Save</span>}
									variant="ghost"
									size="sm"
								/>
							</ResponsiveDialogTrigger>

							<ResponsiveDialogContent>
								<div className="m-5">
									<ResponsiveDialogHeader>
										<ResponsiveDialogTitle>Save Form</ResponsiveDialogTitle>
										<ResponsiveDialogDescription>
											Enter a name for your form to save it for later use.
										</ResponsiveDialogDescription>
									</ResponsiveDialogHeader>
									<div className="space-y-4 mt-4">
										<div>
											<Label className="mb-4" htmlFor={`form_name_${id}`}>
												Form Name
											</Label>
											<Input
												id={`form_name_${id}`}
												placeholder="Enter form name..."
												value={saveFormName}
												onChange={(e) => setSaveFormName(e.target.value)}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														handleSaveForm();
													}
												}}
											/>
										</div>
										<div className="flex justify-end gap-2">
											<Button
												variant="outline"
												onClick={() => {
													setSaveDialogOpen(false);
													setSaveFormName("");
												}}
											>
												Cancel
											</Button>
											<Button
												onClick={handleSaveForm}
												disabled={!saveFormName.trim()}
											>
												Save
											</Button>
										</div>
									</div>
								</div>
							</ResponsiveDialogContent>
						</ResponsiveDialog>

						<div className="h-4 w-px bg-border" />
						<CodeDialog />
					</div>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</div>
		</header>
	);
}
