import { createFileRoute, Link } from "@tanstack/react-router";
import ComponentCard from "@/components/component-card";
import ComponentDetails from "@/components/component-details";
import { Wrapper } from "@/components/generated-code/code-viewer";
import { Button } from "@/components/ui/button";
import { CodeBlock, CodeBlockCode } from "@/components/ui/code-block";
import CopyButton from "@/components/ui/copy-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsCollection } from "@/db-collections/settings.collections";
import useSettings from "@/hooks/use-settings";
import { updatePreferredPackageManager } from "@/lib/utils";
import { BookingForm as BookingFormComp } from "../../registry/default/booking-form";
import { CheckboxForm } from "../../registry/default/checkbox-field";
import { ContacUsForm } from "../../registry/default/contactu-form";
import { BookingForm as CustomerSupportForm } from "../../registry/default/customersupport-form";
import { DatePickerForm } from "../../registry/default/date-picker-field";
import { EventRegistrationForm } from "../../registry/default/eventRegistration-form";
import { DraftForm as FeedbackForm } from "../../registry/default/feedback-form";
import { InputForm } from "../../registry/default/input-field";
import { JobApplicationForm } from "../../registry/default/jobapplication-form";
import { MultiSelectForm } from "../../registry/default/multi-select-field";
import { OTPForm } from "../../registry/default/otp-field";
import { PasswordForm } from "../../registry/default/password-field";
import { PurchaseOrderForm } from "../../registry/default/purchase-order-form";
import { RadioGroupForm } from "../../registry/default/radio-group-field";
import { SelectForm } from "../../registry/default/select-field";
import { SignUp } from "../../registry/default/signup-form";
import { SliderForm } from "../../registry/default/slider-field";
import { DraftForm as SurveyForm } from "../../registry/default/surve-formy";
import { SwitchForm } from "../../registry/default/switch-field";
import { TextareaForm } from "../../registry/default/textarea-field";
import { ToggleGroupForm } from "../../registry/default/toggle-group-field";
import { DraftForm as WaitlistForm } from "../../registry/default/waitlist-form";

const fieldItems = [
	{
		name: "checkbox-field",
		title: "Checkbox Field",
		description: "A checkbox field form.",
		component: CheckboxForm,
	},
	{
		name: "input-field",
		title: "Input Field",
		description: "An input field form.",
		component: InputForm,
	},
	{
		name: "password-field",
		title: "Password Field",
		description: "A password field form with visibility toggle.",
		component: PasswordForm,
	},
	{
		name: "otp-field",
		title: "OTP Field",
		description: "An OTP field form.",
		component: OTPForm,
	},
	{
		name: "textarea-field",
		title: "Textarea Field",
		description: "A textarea field form.",
		component: TextareaForm,
	},
	{
		name: "radio-group-field",
		title: "Radio Group Field",
		description: "A radio group field form.",
		component: RadioGroupForm,
	},
	{
		name: "toggle-group-field",
		title: "Toggle Group Field",
		description: "A toggle group field form.",
		component: ToggleGroupForm,
	},
	{
		name: "switch-field",
		title: "Switch Field",
		description: "A switch field form.",
		component: SwitchForm,
	},
	{
		name: "slider-field",
		title: "Slider Field",
		description: "A slider field form.",
		component: SliderForm,
	},
	{
		name: "select-field",
		title: "Select Field",
		description: "A select field form.",
		component: SelectForm,
	},
	{
		name: "multi-select-field",
		title: "Multi Select Field",
		description: "A multi-select field form.",
		component: MultiSelectForm,
	},
	{
		name: "date-picker-field",
		title: "Date Picker Field",
		description: "A date picker field form.",
		component: DatePickerForm,
	},
];

const items = [
	{
		name: "waitlist-form",
		title: "Waitlist Form",
		description: "A waitlist form for email signup.",
		component: WaitlistForm,
	},
	{
		name: "feedback-form",
		title: "Feedback Form",
		description: "A simple feedback form.",
		component: FeedbackForm,
	},
	{
		name: "contact-us-form",
		title: "Contact Us Form",
		description: "A contact form for users to send messages.",
		component: ContacUsForm,
	},
	{
		name: "signup-form",
		title: "Signup Form",
		description: "A signup form with name, email, password, and confirmation.",
		component: SignUp,
	},
	{
		name: "customer-support-form",
		title: "Customer Support Form",
		description: "A form for submitting customer support requests.",
		component: CustomerSupportForm,
	},
	{
		name: "booking-form",
		title: "Booking Form",
		description:
			"A booking form for placing orders with product selection, personal details, and payment.",
		component: BookingFormComp,
	},
	{
		name: "event-registration-form",
		title: "Event Registration Form",
		description: "A form for registering for events.",
		component: EventRegistrationForm,
	},
	{
		name: "job-application-form",
		title: "Job Application Form",
		description: "A form for job applications.",
		component: JobApplicationForm,
	},
	{
		name: "survey-form",
		title: "Survey Form",
		description: "A multi-step survey form.",
		component: SurveyForm,
	},
	{
		name: "purchase-order-form",
		title: "Purchase Order Form",
		description:
			"A purchase order form with multiple items using array fields.",
		component: PurchaseOrderForm,
	},
];

const registryItems = items.map((item) => ({
	name: item.name,
	type: "registry:ui" as const,
	title: item.title,
	description: item.description,
	meta: { colSpan: 2 },
}));

const fieldRegistryItems = fieldItems.map((item) => ({
	name: item.name,
	type: "registry:ui" as const,
	title: item.title,
	description: item.description,
	meta: { colSpan: 1 },
}));

const tanstackRegistry = {
	name: "tanstack-form",
	type: "registry:ui" as const,
	title: "Tanstack Form + ShadCN",
	description: "Build Composable Form With Tanstack Form and ShadCN",
	meta: { colspan: 1 },
};

const exampleCode = `import { draftFormSchema } from './schema'
import { useAppForm } from "@/components/ui/tanstack-form"
import { revalidateLogic } from "@tanstack/react-form"
import { toast } from "sonner"
import * as z from "zod"
import { FieldDescription , FieldLegend} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function DraftForm() {
  const draftForm = useAppForm({
    defaultValues: {
      email: ""
    } as z.input < typeof draftFormSchema > ,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: draftFormSchema,
      onDynamicAsyncDebounceMs: 300
    },
    onSubmit: ({ value }) => {
      toast.success("success");
    },
  });
  return (
  <div>
    <draftForm.AppForm>
      <draftForm.Form>
          <h1 className="text-3xl font-bold">Waitlist</h1>
 <FieldDescription>"Join our waitlist to get early access"</FieldDescription>;
 <draftForm.AppField name={"email"}>
                {(field) => (
                    <field.FieldSet className="w-full">
                      <field.Field>
                        <field.FieldLabel htmlFor={"email"}>Your Email *</field.FieldLabel>
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
  )}`;

const manualCode = `import {
	createFormHook,
	createFormHookContexts,
	revalidateLogic,
	useStore,
} from "@tanstack/react-form";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Button, type buttonVariants } from "@/components/ui/button";
import {
	Field as DefaultField,
	FieldError as DefaultFieldError,
	FieldSet as DefaultFieldSet,
	FieldContent,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSeparator,
	FieldTitle,
	fieldVariants,
} from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const {
	fieldContext,
	formContext,
	useFieldContext: _useFieldContext,
	useFormContext,
} = createFormHookContexts();

const { useAppForm, withForm, withFieldGroup } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		Field,
		FieldError,
		FieldSet,
		FieldContent,
		FieldDescription,
		FieldGroup,
		FieldLabel,
		FieldLegend,
		FieldSeparator,
		FieldTitle,
		InputGroup,
		InputGroupAddon,
		InputGroupInput,
	},
	formComponents: {
		SubmitButton,
		StepButton,
		FieldLegend,
		FieldDescription,
		FieldSeparator,
		Form,
	},
});

type FormItemContextValue = {
	id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
	{} as FormItemContextValue,
);

function FieldSet({
	className,
	children,
	...props
}: React.ComponentProps<"fieldset">) {
	const id = React.useId();

	return (
		<FormItemContext.Provider value={{ id }}>
			<DefaultFieldSet className={cn("grid gap-1", className)} {...props}>
				{children}
			</DefaultFieldSet>
		</FormItemContext.Provider>
	);
}

const useFieldContext = () => {
	const { id } = React.useContext(FormItemContext);
	const { name, store, ...fieldContext } = _useFieldContext();

	const errors = useStore(store, (state) => state.meta.errors);
	if (!fieldContext) {
		throw new Error("useFieldContext should be used within <FormItem>");
	}

	return {
		id,
		name,
		formItemId: \`\${id}-form-item\`,
		formDescriptionId: \`\${id}-form-item-description\`,
		formMessageId: \`\${id}-form-item-message\`,
		errors,
		store,
		...fieldContext,
	};
};

function Field({
	children,
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
	const { errors, formItemId, formDescriptionId, formMessageId } =
		useFieldContext();

	return (
		<DefaultField
			data-invalid={!!errors.length}
			id={formItemId}
			aria-describedby={
				!errors.length
					? \`\${formDescriptionId}\`
					: \`\${formDescriptionId} \${formMessageId}\`
			}
			aria-invalid={!!errors.length}
			{...props}
		>
			{children}
		</DefaultField>
	);
}

function FieldError({ className, ...props }: React.ComponentProps<"p">) {
	const { errors, formMessageId } = useFieldContext();
	const body = errors.length ? String(errors.at(0)?.message ?? "") : "";
	if (!body) return null;
	return (
		<DefaultFieldError
			data-slot="form-message"
			id={formMessageId}
			className={cn("text-destructive text-sm", className)}
			{...props}
			errors={body ? [{ message: body }] : []}
		/>
	);
}

function Form({
	children,
	...props
}: Omit<React.ComponentPropsWithoutRef<"form">, "onSubmit" & "noValidate"> & {
	children?: React.ReactNode;
}) {
	const form = useFormContext();
	const handleSubmit = React.useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			e.stopPropagation();
			form.handleSubmit();
		},
		[form],
	);
	return (
		<form
			onSubmit={handleSubmit}
			className={cn(
				"flex flex-col p-2 md:p-5 w-full mx-auto gap-2",
				props.className,
			)}
			noValidate
			{...props}
		>
			{children}
		</form>
	);
}

function SubmitButton({
	label,
	className,
	size,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		label: string;
	}) {
	const form = useFormContext();
	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => (
				<Button
					className={className}
					size={size}
					type="submit"
					disabled={isSubmitting}
					{...props}
				>
					{isSubmitting && <Spinner />}
					{label}
				</Button>
			)}
		</form.Subscribe>
	);
}

function StepButton({
	label,
	handleMovement,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		label: React.ReactNode | string;
		handleMovement: () => void;
	}) {
	return (
		<Button
			size="sm"
			variant="ghost"
			type="button"
			onClick={handleMovement}
			{...props}
		>
			{label}
		</Button>
	);
}

export {
	revalidateLogic,
	useAppForm,
	useFieldContext,
	useFormContext,
	withFieldGroup,
	withForm,
};`;

export const Route = createFileRoute("/form-registry")({
	component: RouteComponent,
});

function RouteComponent() {
	const settings = useSettings();
	const preferredPackageManager = settings?.preferredPackageManager || "pnpm";
	const tabsData = [
		{
			value: "pnpm",
			registery:
				"pnpm dlx shadcn@canary add https://tan-form-builder.baskar.dev/r/tanstack-form.json",
		},
		{
			value: "npm",
			registery:
				"npx shadcn@canary add https://tan-form-builder.baskar.dev/r/tanstack-form.json",
		},
		{
			value: "yarn",
			registery:
				"yarn shadcn@canary add https://tan-form-builder.baskar.dev/r/tanstack-form.json",
		},
		{
			value: "bun",
			registery:
				"bunx --bun shadcn@canary add https://tan-form-builder.baskar.dev/r/tanstack-form.json",
		},
	];

	return (
		<div className="container mx-auto p-8">
			<div className="flex justify-between flex-col lg:flex-row mb-8">
				<h1 className="text-4xl font-bold mb-8">TanStack Form Registry</h1>
				<Button variant="default" size="lg" className="w-32 rounded" asChild>
					<Link to="/form-builder">Start Building</Link>
				</Button>
			</div>
			<h2 className="text-2xl font-semibold mb-4">Installation</h2>
			<Tabs defaultValue="cli" className="w-full mt-2 rounded-md">
				<TabsList>
					<TabsTrigger value="cli">CLI</TabsTrigger>
					<TabsTrigger value="manual">Manual</TabsTrigger>
				</TabsList>
				<TabsContent value="cli">
					<Tabs
						value={preferredPackageManager}
						onValueChange={(value) =>
							updatePreferredPackageManager(
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
								<div className="relative">
									<CodeBlock>
										<CodeBlockCode
											code={item.registery}
											language="bash"
											// theme={codeTheme}
										/>
									</CodeBlock>
									<div className="absolute top-2 right-2">
										<CopyButton text={item.registery} />
									</div>
								</div>
							</TabsContent>
						))}
					</Tabs>
					<p className="mb-4">
						Add the tanstack-form component to your project using the shadcn
						CLI.
					</p>
				</TabsContent>
				<TabsContent value="manual">
					<Wrapper
						children={manualCode}
						language="tsx"
						title="Manual Installation"
					/>
				</TabsContent>
			</Tabs>
			{/* <ComponentDetails component={tanstackRegistry} /> */}
			<h2 className="text-2xl font-semibold mb-4">Usage</h2>
			<p className="mb-4">
				This tanstack-form registry component provides a comprehensive set of
				hooks and components for building forms with TanStack Form. It includes
				form validation, field management, and UI components.
			</p>
			<p className="mb-4">Here's a basic example of how to use it:</p>
			<Wrapper children={exampleCode} language="tsx" title="Example Usage" />

			<h2 className="text-2xl font-semibold my-4">Anatomy</h2>
			<p className="mb-4">
				The tanstack-form has Super Cool Form Composition Feature that allow
				Breaking Large and Complex Form into Composable Field, The Registry Uses
				Form Composition + ShadCN Field Components to Allow Ultimate Flexibiity
			</p>
			<div className="flex lg:flex-row flex-col gap-3 content-center items-center">
				<img src="/assets/anotomy-of-form.png" alt="anotomy-of-form" />
				<ul className="list-disc list-inside mb-8 flex flex-col gap-1">
					<li>
						<strong>AppForm:</strong> The main form instance created with
						useAppForm, providing form state and methods.
					</li>
					<li>
						<strong>Form:</strong> The root form element that handles submission
						and provides form context.
					</li>
					<li>
						<strong>AppField:</strong> A field component that integrates with
						the form instance for validation and state management.
					</li>
					<li>
						<strong>FieldSet:</strong> Groups related form fields together.
					</li>
					<li>
						<strong>Field:</strong> Wraps individual form fields with
						validation, error handling, and accessibility attributes.
					</li>
					<li>
						<strong>FieldLabel:</strong> Provides accessible labels for form
						fields.
					</li>
					<li>
						<strong>FieldError:</strong> Displays validation errors for the
						field.
					</li>
					<li>
						<strong>FieldDescription:</strong> Provides additional descriptive
						text for form fields.
					</li>
					<li>
						<strong>FieldLegend:</strong> Provides legends for fieldsets.
					</li>
					<li>
						<strong>SubmitButton:</strong> A button component that submits the
						form and shows loading state during submission.
					</li>
					<li>
						<strong>InputGroup, InputGroupInput, InputGroupAddon:</strong>{" "}
						Components for grouping inputs with addons.
					</li>
				</ul>
			</div>
			<h2 className="text-3xl font-bold my-8">Field Examples</h2>
			<div className="grid grid-cols-12 gap-4">
				{fieldRegistryItems.map((registryItem) => (
					<ComponentCard
						className="p-5 flex-1 justify-center items-center content-center"
						key={registryItem.name}
						component={registryItem}
					>
						{(() => {
							const item = fieldItems.find((i) => i.name === registryItem.name);
							return item ? (
								<>
									<item.component />
									<ComponentDetails component={registryItem} />
								</>
							) : null;
						})()}
					</ComponentCard>
				))}
			</div>
			<h2 className="text-3xl font-bold my-8">Form Examples</h2>
			<div className="grid grid-cols-12 gap-4 mb-8">
				{registryItems.map((registryItem) => (
					<ComponentCard
						key={registryItem.name}
						component={registryItem}
						className=""
					>
						{(() => {
							const item = items.find((i) => i.name === registryItem.name);
							return item ? <item.component /> : null;
						})()}
						<ComponentDetails component={registryItem} />
					</ComponentCard>
				))}
			</div>
		</div>
	);
}
