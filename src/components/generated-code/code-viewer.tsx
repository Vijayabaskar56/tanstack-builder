import { useViteTheme } from "@space-man/react-theme-animation";
import {
	CodeBlock,
	CodeBlockCode,
	CodeBlockGroup,
} from "@/components/ui/code-block";
import { CopyButton } from "@/components/ui/copy-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	type SettingsCollection,
	settingsCollection,
} from "@/db-collections/settings.collections";
import type {
	FormElement,
	FormElementOrList,
	FormStep,
} from "@/types/form-types";
import { useFormStore, useIsMultiStep } from "@/hooks/use-form-store";
import useSettings from "@/hooks/use-settings";
import { flattenFormSteps } from "@/lib/form-elements-helpers";
import { getArkTypeSchemaString } from "@/lib/schema-generators/generate-arktype-schema";
import { getValiSchemaString } from "@/lib/schema-generators/generate-valibot-schema";
import {
	getZodSchemaString,
	generateZodSchemaObject,
} from "@/lib/schema-generators/generate-zod-schema";
import type { FormArray } from "@/types/form-types";
import { formatCode, generateFormNames } from "@/lib/utils";
import { useEffect } from "react";
import { generateFormCode } from "@/lib/form-code-generators/react/generate-form-code";

const Wrapper = ({
	children,
	language,
	title,
}: {
	language: string;
	children: string;
	title: string;
}) => {
	const { theme, systemTheme } = useViteTheme();
	const codeTheme =
		theme === "system"
			? systemTheme === "dark"
				? "github-dark"
				: "github-light"
			: theme === "dark"
				? "github-dark"
				: "github-light";

	return (
		<CodeBlock className="my-0 w-full border-border border rounded-md overflow-hidden bg-background dark:bg-background/95">
			<CodeBlockGroup className="border-border border-b px-4 py-2 bg-muted/50 dark:bg-muted/20">
				<div className="bg-muted dark:bg-muted/80 py-1 px-1.5 rounded-sm text-muted-foreground dark:text-muted-foreground/90 text-sm font-medium">
					{title}
				</div>
				<CopyButton text={children} />
			</CodeBlockGroup>
			<div className="*:mt-0 [&_pre]:p-3 w-full bg-background dark:bg-background/95">
				<CodeBlockCode code={children} language={language} theme={codeTheme} />
			</div>
		</CodeBlock>
	);
};

export const JsonViewer = ({
	json,
	isMS,
}: {
	json: FormElementOrList[] | FormStep[] | Record<string, unknown>;
	isMS: boolean;
}) => {
	if (!Array.isArray(json)) {
		json = [json] as FormStep[];
	}

	return (
		<Wrapper title="Form JSON" language="json">
			{JSON.stringify(json, null, 2)}
		</Wrapper>
	);
};

const installableShadcnComponents: Partial<
	Record<FormElement["fieldType"], string>
> = {
	Input: "input",
	Password: "input",
	Textarea: "textarea",
	Checkbox: "checkbox",
	Select: "select",
	Slider: "slider",
	Switch: "switch",
	OTP: "otp",
	RadioGroup: "radio-group",
	ToggleGroup: "toggle-group",
	DatePicker: "popover calendar",
	Separator: "separator",
	MultiSelect: "",
};
//======================================
export function CodeBlockPackagesInstallation() {
	const { theme, systemTheme } = useViteTheme();
	const { formElements } = useFormStore();
	const isMS = useIsMultiStep();
	const codeTheme =
		theme === "system"
			? systemTheme === "dark"
				? "github-dark"
				: "github-light"
			: theme === "dark"
				? "github-dark"
				: "github-light";
	const processedFormElements = isMS
		? flattenFormSteps(formElements as FormStep[])
		: formElements;
	const formElementTypes = (processedFormElements.flat() as FormElement[])
		.filter((el) => !el.static)
		.map((el) => el.fieldType)
		.map((str) => installableShadcnComponents[str])
		.filter((str) => str && str.length > 0);
	const settings = useSettings();
	const preferredPackageManager = settings?.preferredPackageManager || "pnpm";
	const packagesSet = new Set(formElementTypes);
	const packages = Array.from(packagesSet).join(" ");
	const otherPackages = "@tanstack/react-form zod motion";
	const tabsData = [
		{
			value: "pnpm",
			shadcn: `pnpm add shadcn@latest add ${packages}`,
			base: `pnpm add ${otherPackages}`,
			registery:
				"pnpm dlx shadcn@canary add https://tan-form-builder.baskar.dev/r/tanstack-form.json",
		},
		{
			value: "npm",
			shadcn: `npx shadcn@latest add ${packages}`,
			base: `npx i ${otherPackages}`,
			registery:
				"npx shadcn@canary add https://tan-form-builder.baskar.dev/r/tanstack-form.json",
		},
		{
			value: "yarn",
			shadcn: `npx shadcn@latest add ${packages}`,
			base: `npx add ${otherPackages}`,
			registery:
				"yarn shadcn@canary add https://tan-form-builder.baskar.dev/r/tanstack-form.json",
		},
		{
			value: "bun",
			shadcn: `bunx --bun shadcn@latest add ${packages}`,
			base: `bunx --bun add ${otherPackages}`,
			registery:
				"bunx --bun shadcn@canary add https://tan-form-builder.baskar.dev/r/tanstack-form.json",
		},
	];
	const updatePreference = (
		value: SettingsCollection["preferredPackageManager"],
	) => {
		settingsCollection.update("user-settings", (draft) => {
			draft.preferredPackageManager = value;
		});
	};

	return (
		<div className="w-full py-5 max-w-full">
			<h2 className="font-sembold text-start">Install base packages</h2>
			<Tabs
				value={preferredPackageManager}
				onValueChange={(value) =>
					updatePreference(
						value as SettingsCollection["preferredPackageManager"],
					)
				}
				className="w-full mt-2 rounded-md"
			>
				<TabsList>
					{tabsData.map((item) => (
						<TabsTrigger key={item.value} value={item.value}>
							{item.value}
						</TabsTrigger>
					))}
				</TabsList>
				{tabsData.map((item) => (
					<TabsContent key={item.value} value={item.value}>
						<CodeBlock>
							<CodeBlockCode
								code={item.base}
								language="bash"
								theme={codeTheme}
							/>
						</CodeBlock>
					</TabsContent>
				))}
			</Tabs>
			<h2 className="font-sembold text-start mt-4">
				Install required shadcn components
			</h2>
			<Tabs
				value={preferredPackageManager}
				onValueChange={(value) =>
					updatePreference(
						value as SettingsCollection["preferredPackageManager"],
					)
				}
				className="w-full mt-2 rounded-md"
			>
				<TabsList>
					{tabsData.map((item) => (
						<TabsTrigger key={item.value} value={item.value}>
							{item.value}
						</TabsTrigger>
					))}
				</TabsList>
				{tabsData.map((item) => (
					<TabsContent key={item.value} value={item.value}>
						<CodeBlock>
							<CodeBlockCode
								code={item.shadcn}
								language="bash"
								theme={codeTheme}
							/>
						</CodeBlock>
					</TabsContent>
				))}
			</Tabs>
			<h2 className="font-sembold text-start mt-4">
				Shadcn UI + TanStack Form Integration Registery
			</h2>
			<Tabs
				value={preferredPackageManager}
				onValueChange={(value) =>
					updatePreference(
						value as SettingsCollection["preferredPackageManager"],
					)
				}
				className="w-full mt-2 rounded-md"
			>
				<TabsList>
					{tabsData.map((item) => (
						<TabsTrigger key={item.value} value={item.value}>
							{item.value}
						</TabsTrigger>
					))}
				</TabsList>
				{tabsData.map((item) => (
					<TabsContent key={item.value} value={item.value}>
						<CodeBlock>
							<CodeBlockCode
								code={item.registery}
								language="bash"
								theme={codeTheme}
							/>
						</CodeBlock>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}
const CodeBlockTSX = () => {
	const { formElements, validationSchema, formName } = useFormStore();
	const isMS = useIsMultiStep();
	const settings = useSettings();

	useEffect(() => {
		console.log("Form elements changed, regenerating TSX code:", formElements);
	}, [formElements]);

	// Generate the actual schema object based on validationSchema type
	let schemaObject = null;
	try {
		if (validationSchema === "zod") {
			// For multi-step forms, flatten the formElements first
			const elementsToProcess = isMS
				? flattenFormSteps(formElements as FormStep[]).flat()
				: formElements;
			schemaObject = generateZodSchemaObject(
				elementsToProcess as (FormElement | FormArray)[],
			);
		} else if (validationSchema === "valibot") {
			// For now, just pass null for valibot - can be extended later
			schemaObject = null;
		} else if (validationSchema === "arktype") {
			// For now, just pass null for arktype - can be extended later
			schemaObject = null;
		}
	} catch (error) {
		console.error("Failed to generate schema object:", error);
		schemaObject = null;
	}

	const generatedCode = generateFormCode({
		formElements: formElements as FormElementOrList[],
		isMS,
		validationSchema: schemaObject,
		settings,
		formName,
	});
	const formattedCode = generatedCode.map((item) => ({
		...item,
		code: formatCode(item.code),
	}));
	return (
		<div className="relative max-w-full flex flex-col gap-y-5">
			{formattedCode.map((item) => (
				<Wrapper key={item.code} title={item.file} language="tsx">
					{item.code}
				</Wrapper>
			))}
		</div>
	);
};
const CodeBlockSchema = () => {
	const { formElements, validationSchema, formName } = useFormStore();
	const isMS = useIsMultiStep();
	const { schemaName } = generateFormNames(formName);

	useEffect(() => {
		console.log(
			"Form elements changed, regenerating schema code:",
			formElements,
		);
	}, [formElements]);

	const parsedFormElements = isMS
		? flattenFormSteps(formElements as FormStep[])
		: formElements.flat();

	let generatedCode = "";
	let stepSchemas: (FormElement | FormArray)[][] | undefined;

	// Generate step schemas for multi-step forms
	if (isMS) {
		stepSchemas = (formElements as FormStep[]).map((step) =>
			step.stepFields.flat(),
		);
	}

	switch (validationSchema) {
		case "zod":
			generatedCode = getZodSchemaString(
				isMS
					? (formElements as FormStep[])
					: (parsedFormElements as FormElement[]),
				isMS,
				schemaName,
			);
			break;
		case "valibot":
			generatedCode = getValiSchemaString(
				isMS
					? (formElements as FormStep[])
					: (parsedFormElements as FormElement[]),
				isMS,
				schemaName,
			);
			break;
		case "arktype":
			generatedCode = getArkTypeSchemaString(
				parsedFormElements as FormElement[],
				isMS,
				stepSchemas,
				schemaName,
			);
			break;
		default:
			generatedCode = getZodSchemaString(
				parsedFormElements as FormElement[],
				isMS,
				schemaName,
			);
			break;
	}
	const formattedCode = formatCode(generatedCode);
	return (
		<div className="relative max-w-full">
			<Wrapper title="schema.ts" language="typescript">
				{formattedCode}
			</Wrapper>
		</div>
	);
};

export function GeneratedFormCodeViewer() {
	return (
		<Tabs defaultValue="tsx" className="w-full min-w-full flex">
			<div className="flex justify-between">
				<TabsList>
					<TabsTrigger value="tsx">TSX</TabsTrigger>
					<TabsTrigger value="schema">Schema</TabsTrigger>
				</TabsList>
				{/* <GeneratedCodeInfoCard /> */}
			</div>
			<TabsContent value="tsx" tabIndex={-1}>
				<ScrollArea className="h-[70vh]">
					<CodeBlockPackagesInstallation />
					<div className="border-t border-dashed w-full mt-6" />
					<CodeBlockTSX />
				</ScrollArea>
			</TabsContent>
			<TabsContent value="schema" tabIndex={-1}>
				<ScrollArea className="h-[60vh]">
					<CodeBlockSchema />
				</ScrollArea>
			</TabsContent>
		</Tabs>
	);
}
