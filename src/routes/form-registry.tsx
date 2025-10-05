import { createFileRoute, Link } from "@tanstack/react-router";
import ComponentCli from "@/components/cli-commands";
import { ClientOnly } from "@/components/client-only";
import CodeBlock from "@/components/code-block";
import ComponentCard from "@/components/component-card";
import ComponentDetails from "@/components/component-details";
import { Wrapper } from "@/components/generated-code/code-viewer";
import { Button } from "@/components/ui/button";
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

export const Route = createFileRoute("/form-registry")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="container mx-auto p-8">
			<div className="flex justify-between flex-col lg:flex-row mb-8">
				<h1 className="text-4xl font-bold mb-8">TanStack Form Registry</h1>
				<Button variant="default" size="lg" className="w-32 rounded" asChild>
					<Link to="/form-builder">Start Building</Link>
				</Button>
			</div>
			<h2 className="text-2xl font-semibold mb-4">Installation</h2>
			<p className="mb-4">
				Add the tanstack-form component to your project using the shadcn CLI.
			</p>
			{/* <ComponentDetails component={tanstackRegistry} /> */}
			<div className="relative mb-4">
				<ClientOnly>
					<ComponentCli name={tanstackRegistry.name} />
				</ClientOnly>
			</div>
			<h2 className="text-2xl font-semibold mb-4">Usage</h2>
			<p className="mb-4">
				This tanstack-form registry component provides a comprehensive set of
				hooks and components for building forms with TanStack Form. It includes
				form validation, field management, and UI components.
			</p>
			<p className="mb-4">Here's a basic example of how to use it:</p>
			<Wrapper children={exampleCode} language="tsx" title="Example Usage" />

			<h2 className="text-2xl font-semibold mb-4">Anatomy</h2>
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
