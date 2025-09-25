import * as v from "valibot";
import { templates } from "@/constants/templates";

// Base schemas defined inline to maintain type inference
const OptionSchema = v.object({
	value: v.string(),
	label: v.string(),
});

// Base form element schemas - defined as variables within the same scope
const baseFormElementSchemas = [
	// Input
	v.object({
		id: v.string(),
		fieldType: v.literal("Input"),
		name: v.string(),
		label: v.optional(v.string()),
		description: v.optional(v.string()),
		placeholder: v.optional(v.string()),
		type: v.optional(v.string()),
		required: v.optional(v.boolean()),
		static: v.optional(v.boolean()),
	}),
	// Password
	v.object({
		id: v.string(),
		fieldType: v.literal("Password"),
		name: v.string(),
		label: v.optional(v.string()),
		description: v.optional(v.string()),
		placeholder: v.optional(v.string()),
		type: v.literal("password"),
		required: v.optional(v.boolean()),
		static: v.optional(v.boolean()),
	}),
	// OTP
	v.object({
		id: v.string(),
		fieldType: v.literal("OTP"),
		name: v.string(),
		label: v.optional(v.string()),
		description: v.optional(v.string()),
		required: v.optional(v.boolean()),
		static: v.optional(v.boolean()),
	}),
	// Textarea
	v.object({
		id: v.string(),
		fieldType: v.literal("Textarea"),
		name: v.string(),
		label: v.optional(v.string()),
		description: v.optional(v.string()),
		placeholder: v.optional(v.string()),
		required: v.optional(v.boolean()),
		static: v.optional(v.boolean()),
	}),
	// Checkbox
	v.object({
		id: v.string(),
		fieldType: v.literal("Checkbox"),
		label: v.optional(v.string()),
		description: v.optional(v.string()),
		required: v.optional(v.boolean()),
		static: v.optional(v.boolean()),
	}),
	// RadioGroup
	v.object({
		id: v.string(),
		fieldType: v.literal("RadioGroup"),
		name: v.string(),
		label: v.optional(v.string()),
		description: v.optional(v.string()),
		options: v.array(OptionSchema),
		required: v.optional(v.boolean()),
		static: v.optional(v.boolean()),
	}),
	// ToggleGroup
	v.object({
		id: v.string(),
		fieldType: v.literal("ToggleGroup"),
		name: v.string(),
		label: v.optional(v.string()),
		description: v.optional(v.string()),
		options: v.array(OptionSchema),
		type: v.picklist(["single", "multiple"]),
		required: v.optional(v.boolean()),
		static: v.optional(v.boolean()),
	}),
	// Switch
	v.object({
		id: v.string(),
		fieldType: v.literal("Switch"),
		name: v.string(),
		label: v.optional(v.string()),
		description: v.optional(v.string()),
		required: v.optional(v.boolean()),
		static: v.optional(v.boolean()),
	}),
	// Slider
	v.object({
		id: v.string(),
		fieldType: v.literal("Slider"),
		name: v.string(),
		label: v.optional(v.string()),
		description: v.optional(v.string()),
		min: v.optional(v.number()),
		max: v.optional(v.number()),
		step: v.optional(v.number()),
		required: v.optional(v.boolean()),
		static: v.optional(v.boolean()),
	}),
	// Select
	v.object({
		id: v.string(),
		fieldType: v.literal("Select"),
		name: v.string(),
		label: v.optional(v.string()),
		description: v.optional(v.string()),
		options: v.array(OptionSchema),
		placeholder: v.string(),
		required: v.optional(v.boolean()),
		static: v.optional(v.boolean()),
	}),
	// MultiSelect
	v.object({
		id: v.string(),
		fieldType: v.literal("MultiSelect"),
		name: v.string(),
		label: v.optional(v.string()),
		description: v.optional(v.string()),
		options: v.array(OptionSchema),
		placeholder: v.string(),
		required: v.optional(v.boolean()),
		static: v.optional(v.boolean()),
	}),
	// DatePicker
	v.object({
		id: v.string(),
		fieldType: v.literal("DatePicker"),
		name: v.string(),
		label: v.optional(v.string()),
		description: v.optional(v.string()),
		required: v.optional(v.boolean()),
		static: v.optional(v.boolean()),
	}),
	// Static elements
	v.object({
		id: v.string(),
		fieldType: v.literal("H1"),
		name: v.string(),
		content: v.string(),
		static: v.literal(true),
	}),
	v.object({
		id: v.string(),
		fieldType: v.literal("H2"),
		name: v.string(),
		content: v.string(),
		static: v.literal(true),
	}),
	v.object({
		id: v.string(),
		fieldType: v.literal("H3"),
		name: v.string(),
		content: v.string(),
		static: v.literal(true),
	}),
	v.object({
		id: v.string(),
		fieldType: v.literal("P"),
		name: v.string(),
		content: v.string(),
		static: v.literal(true),
	}),
	v.object({
		id: v.string(),
		fieldType: v.literal("Separator"),
		name: v.string(),
		static: v.literal(true),
	}),
];

// Create base form element union
const BaseFormElementSchema = v.union(baseFormElementSchemas);

// Create form element schema (single element or array of elements)
const FormElementSchema = v.union([
	BaseFormElementSchema,
	v.array(BaseFormElementSchema),
]);

// Form element list schema
const FormElementListSchema = v.array(FormElementSchema);

// Form step schema
const FormStepSchema = v.object({
	id: v.string(),
	stepFields: FormElementListSchema,
});

// Form array entry schema
const FormArrayEntrySchema = v.object({
	id: v.string(),
	fields: FormElementListSchema,
});

// Form array schema
const FormArraySchema = v.object({
	fieldType: v.literal("FormArray"),
	id: v.string(),
	name: v.string(),
	label: v.optional(v.string()),
	arrayField: FormElementListSchema,
	entries: v.array(FormArrayEntrySchema),
});

// Form elements union
export const FormElementsSchema = v.union([
	FormElementListSchema,
	v.array(FormStepSchema),
	v.array(FormArraySchema),
]);

// Main form state search params schema with everything defined inline
// This ensures proper type inference flow without losing types through separate schema references
export const FormStateSearchParamsSchemaSingle = v.object({
	// Core state
	isMS: v.optional(v.boolean(), false),
	formName: v.optional(v.string(), "Form"),
	schemaName: v.optional(v.string(), "formSchema"),
	validationSchema: v.optional(
		v.picklist(["zod", "valibot", "arktype"]),
		"zod",
	),
	framework: v.optional(
		v.picklist(["react", "vue", "angular", "solid"]),
		"react",
	),
	lastAddedStepIndex: v.optional(v.number()),

	// Share param for sharing form state
	share: v.optional(v.string()),

	// Form elements - now properly typed due to inline definition with default
	formElements: v.optional(FormElementsSchema, templates.contactUs.template),
});

// Type export for the single schema
export type FormStateSearchParamsSingle = v.InferOutput<
	typeof FormStateSearchParamsSchemaSingle
>;
