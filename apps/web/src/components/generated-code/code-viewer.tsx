
import {
 CodeBlock,
 CodeBlockCode,
 CodeBlockGroup,
} from "@/components/ui/code-block";
import { CopyButton } from "@/components/ui/copy-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { FormElement, FormElementOrList, FormStep } from "@/form-types";
import { useFormStore, useIsMultiStep } from "@/hooks/use-form-store";
import { generateFormCode } from "@/lib/form-code-generators/react/generate-form-code";
import { flattenFormSteps } from "@/lib/form-elements-helpers";
import { getArkTypeSchemaString } from "@/lib/schema-generators/generate-arktype-schema";
import { getValiSchemaString } from "@/lib/schema-generators/generate-valibot-schema";
import { getZodSchemaString } from "@/lib/schema-generators/generate-zod-schema";
import { formatCode } from "@/lib/utils";

const Wrapper = ({
	children,
	language,
	title,
}: {
	language: string;
	children: string;
	title: string;
}) => {
	return (
		<CodeBlock className="my-0 w-full">
			<CodeBlockGroup className="border-border border-b px-4 py-2">
				<div className="bg-muted py-1 px-1.5 rounded-sm text-muted-foreground text-sm">
					{title}
				</div>
				<CopyButton text={children} />
			</CodeBlockGroup>
			<div
				style={{ height: "100%", maxHeight: "50vh" }}
				className="*:mt-0 [&_pre]:p-3 w-full overflow-y-auto"
			>
				<CodeBlockCode code={children} language={language} />
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
  json = ([json] as FormStep[])
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
	// none-shadcn components
	MultiSelect: "",
};
//======================================
export function CodeBlockPackagesInstallation() {
	const { formElements } = useFormStore();
	const isMS = useIsMultiStep();
	const processedFormElements = isMS
		? flattenFormSteps(formElements as FormStep[])
		: formElements;
	const formElementTypes = (processedFormElements.flat() as FormElement[])
		.filter((el) => !el.static)
		.map((el) => el.fieldType)
		.map((str) => installableShadcnComponents[str])
		.filter((str) => str && str.length > 0);

	const packagesSet = new Set(formElementTypes);
	const packages = Array.from(packagesSet).join(" ");
	const otherPackages = "@tanstack/react-form zod motion";
	const tabsData = [
		{
			value: "pnpm",
			shadcn: `pnpm add shadcn@latest add ${packages}`,
			base: `pnpm add ${otherPackages}`,
   registery : `pnpm dlx shadcn@canary add https://shadcn-tanstack-form.netlify.app/r/tanstack-form.json`
		},
		{
			value: "npm",
			shadcn: `npx shadcn@latest add ${packages}`,
			base: `npx i ${otherPackages}`,
   registery : `npx shadcn@canary add https://shadcn-tanstack-form.netlify.app/r/tanstack-form.json`
		},
		{
			value: "yarn",
			shadcn: `npx shadcn@latest add ${packages}`,
			base: `npx add ${otherPackages}`,
   registery : `yarn shadcn@canary add https://shadcn-tanstack-form.netlify.app/r/tanstack-form.json`
		},
		{
			value: "bun",
			shadcn: `bunx --bun shadcn@latest add ${packages}`,
			base: `bunx --bun add ${otherPackages}`,
   registery : `bunx --bun shadcn@canary add https://shadcn-tanstack-form.netlify.app/r/tanstack-form.json`
		},
	];

	return (
		<div className="w-full py-5 max-w-full">
			<h2 className="font-sembold text-start">Install base packages</h2>
			<Tabs defaultValue="pnpm" className="w-full mt-2 rounded-md">
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
								theme="github-dark"
							/>
						</CodeBlock>
					</TabsContent>
				))}
			</Tabs>
			<h2 className="font-sembold text-start mt-4">
				Install required shadcn components
			</h2>
			<Tabs defaultValue="pnpm" className="w-full mt-2 rounded-md">
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
								theme="github-dark"
							/>
						</CodeBlock>
					</TabsContent>
				))}
			</Tabs>
   <h2 className="font-sembold text-start mt-4">
				Shadcn UI + TanStack Form Integration Registery
			</h2>
   <Tabs defaultValue="pnpm" className="w-full mt-2 rounded-md">
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
								theme="github-dark"
							/>
						</CodeBlock>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}
const CodeBlockTSX = () => {
	const { formElements } = useFormStore();
	const isMS = useIsMultiStep();
	const generatedCode = generateFormCode({
		formElements: formElements as FormElementOrList[],
		isMS,
	});
	const formattedCode = generatedCode.map((item) => ({
		...item,
		code: formatCode(item.code),
	}));
	return (
		<div className="relative max-w-full flex flex-col gap-y-5">
			{formattedCode.map((item) => (
				<Wrapper key={item.file} title={item.file} language="tsx">
					{item.code}
				</Wrapper>
			))}
		</div>
	);
};
const CodeBlockSchema = () => {
	const { formElements, validationSchema } = useFormStore();
	const isMS = useIsMultiStep();
	const parsedFormElements = isMS
		? flattenFormSteps(formElements as FormStep[])
		: formElements.flat();
	let generatedCode = "";
	switch (validationSchema) {
		case "zod":
			generatedCode = getZodSchemaString(parsedFormElements as FormElement[]);
			break;
		case "valibot":
			generatedCode = getValiSchemaString(parsedFormElements as FormElement[]);
			break;
		case "arktype":
			generatedCode = getArkTypeSchemaString(
				parsedFormElements as FormElement[],
			);
			break;
		default:
			generatedCode = getZodSchemaString(parsedFormElements as FormElement[]);
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

//======================================
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
				<CodeBlockTSX />
				<div className="border-t border-dashed w-full mt-6" />
				<CodeBlockPackagesInstallation />
			</TabsContent>
			<TabsContent value="schema" tabIndex={-1}>
				<CodeBlockSchema />
			</TabsContent>
		</Tabs>
	);
}
