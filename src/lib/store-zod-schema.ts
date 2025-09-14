import { z } from 'zod';

// Base field types union
const FieldTypeSchema = z.enum([
  'Input',
  'Password',
  'OTP',
  'Textarea',
  'Checkbox',
  'RadioGroup',
  'ToggleGroup',
  'Switch',
  'Slider',
  'Select',
  'MultiSelect',
  'DatePicker',
  'H1',
  'H2',
  'H3',
  'P',
  'Separator',
  'FormArray'
]);

// Option schema for select/radio fields
const OptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

// Base shared form properties (kept for reference but not exported)
const SharedFormPropsSchema = z.object({
  name: z.string(),
  label: z.string().optional(),
  description: z.string().optional(),
  required: z.boolean().optional(),
  static: z.boolean().optional(),
});

// Individual form element schemas
const InputElementSchema = z.object({
  id: z.string(),
  fieldType: z.literal('Input'),
  name: z.string(),
  label: z.string().optional(),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  type: z.string().optional(),
  required: z.boolean().optional(),
  static: z.boolean().optional(),
});

const PasswordElementSchema = z.object({
  id: z.string(),
  fieldType: z.literal('Password'),
  name: z.string(),
  label: z.string().optional(),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  type: z.literal('password'),
  required: z.boolean().optional(),
  static: z.boolean().optional(),
});

const OTPElementSchema = z.object({
  id: z.string(),
  fieldType: z.literal('OTP'),
  name: z.string(),
  label: z.string().optional(),
  description: z.string().optional(),
  required: z.boolean().optional(),
  static: z.boolean().optional(),
});

const TextareaElementSchema = z.object({
  id: z.string(),
  fieldType: z.literal('Textarea'),
  name: z.string(),
  label: z.string().optional(),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  static: z.boolean().optional(),
});

const CheckboxElementSchema = z.object({
  id: z.string(),
  fieldType: z.literal('Checkbox'),
  label: z.string().optional(),
  description: z.string().optional(),
  required: z.boolean().optional(),
  static: z.boolean().optional(),
});

const RadioGroupElementSchema = z.object({
  id: z.string(),
  fieldType: z.literal('RadioGroup'),
  name: z.string(),
  label: z.string().optional(),
  description: z.string().optional(),
  options: z.array(OptionSchema),
  required: z.boolean().optional(),
  static: z.boolean().optional(),
});

const ToggleGroupElementSchema = z.object({
  id: z.string(),
  fieldType: z.literal('ToggleGroup'),
  name: z.string(),
  label: z.string().optional(),
  description: z.string().optional(),
  options: z.array(OptionSchema),
  type: z.enum(['single', 'multiple']),
  required: z.boolean().optional(),
  static: z.boolean().optional(),
});

const SwitchElementSchema = z.object({
  id: z.string(),
  fieldType: z.literal('Switch'),
  name: z.string(),
  label: z.string().optional(),
  description: z.string().optional(),
  required: z.boolean().optional(),
  static: z.boolean().optional(),
});

const SliderElementSchema = z.object({
  id: z.string(),
  fieldType: z.literal('Slider'),
  name: z.string(),
  label: z.string().optional(),
  description: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  required: z.boolean().optional(),
  static: z.boolean().optional(),
});

const SelectElementSchema = z.object({
  id: z.string(),
  fieldType: z.literal('Select'),
  name: z.string(),
  label: z.string().optional(),
  description: z.string().optional(),
  options: z.array(OptionSchema),
  placeholder: z.string(),
  required: z.boolean().optional(),
  static: z.boolean().optional(),
});

const MultiSelectElementSchema = z.object({
  id: z.string(),
  fieldType: z.literal('MultiSelect'),
  name: z.string(),
  label: z.string().optional(),
  description: z.string().optional(),
  options: z.array(OptionSchema),
  placeholder: z.string(),
  required: z.boolean().optional(),
  static: z.boolean().optional(),
});

const DatePickerElementSchema = z.object({
  id: z.string(),
  fieldType: z.literal('DatePicker'),
  name: z.string(),
  label: z.string().optional(),
  description: z.string().optional(),
  required: z.boolean().optional(),
  static: z.boolean().optional(),
});

// Static elements
const H1ElementSchema = z.object({
  id: z.string(),
  fieldType: z.literal('H1'),
  name: z.string(),
  content: z.string(),
  static: z.literal(true),
});

const H2ElementSchema = z.object({
  id: z.string(),
  fieldType: z.literal('H2'),
  name: z.string(),
  content: z.string(),
  static: z.literal(true),
});

const H3ElementSchema = z.object({
  id: z.string(),
  fieldType: z.literal('H3'),
  name: z.string(),
  content: z.string(),
  static: z.literal(true),
});

const ParagraphElementSchema = z.object({
  id: z.string(),
  fieldType: z.literal('P'),
  name: z.string(),
  content: z.string(),
  static: z.literal(true),
});

const DividerElementSchema = z.object({
  id: z.string(),
  fieldType: z.literal('Separator'),
  name: z.string(),
  static: z.literal(true),
});

// FormArrayEntry schema (forward reference to FormElementListSchema)
const FormArrayEntrySchema = z.object({
  id: z.string(),
  fields: z.lazy(() => FormElementListSchema),
});

// FormArray schema
const FormArraySchema = z.object({
  fieldType: z.literal('FormArray'),
  id: z.string(),
  name: z.string(),
  label: z.string().optional(),
  arrayField: z.lazy(() => FormElementListSchema),
  entries: z.array(FormArrayEntrySchema),
});

// Individual form element union
const BaseFormElementSchema = z.union([
  InputElementSchema,
  PasswordElementSchema,
  OTPElementSchema,
  TextareaElementSchema,
  CheckboxElementSchema,
  RadioGroupElementSchema,
  ToggleGroupElementSchema,
  SwitchElementSchema,
  SliderElementSchema,
  SelectElementSchema,
  MultiSelectElementSchema,
  DatePickerElementSchema,
  H1ElementSchema,
  H2ElementSchema,
  H3ElementSchema,
  ParagraphElementSchema,
  DividerElementSchema,
]);

// FormElement can be a single element or an array of elements
const FormElementSchema = z.union([
  BaseFormElementSchema,
  z.array(BaseFormElementSchema),
]);

// FormElementList can be an array of FormElements or FormElementOrLists
const FormElementListSchema: z.ZodType = z.array(FormElementSchema);

// FormStep schema
const FormStepSchema = z.object({
  id: z.string(),
  stepFields: FormElementListSchema,
});

// FormArray array schema
const FormArrayArraySchema = z.array(FormArraySchema);

// FormStep array schema
const FormStepArraySchema = z.array(FormStepSchema);

// Form elements can be one of three types: FormElementList, FormStep[], or FormArray[]
const FormElementsSchema = z.union([
  FormElementListSchema,
  FormStepArraySchema,
  FormArrayArraySchema,
]);

// Validation schema and framework enums
const ValidationSchemaEnum = z.enum(['zod', 'valibot', 'arktype']);
const FrameworkEnum = z.enum(['react', 'vue', 'angular', 'solid']);

// Main form builder state schema
const FormBuilderStateSchema = z.object({
  isMS: z.boolean(),
  formElements: FormElementsSchema,
  formName: z.string(),
  schemaName: z.string(),
  validationSchema: ValidationSchemaEnum,
  framework: FrameworkEnum,
  lastAddedStepIndex: z.number().optional(),
});

// URL search params schema for TanStack Router
// This is a flattened version suitable for URL parameters
const FormStateSearchParamsSchema = z.object({
  // Core state
  isMS: z.string().transform((val) => val === 'true').optional().default('true'),
  formName: z.string().optional().default('Form'),
  schemaName: z.string().optional().default('formSchema'),
  validationSchema: ValidationSchemaEnum.optional().default('zod'),
  framework: FrameworkEnum.optional().default('react'),
  lastAddedStepIndex: z.string().transform((val) => val ? parseInt(val) : undefined).optional(),

  // Form elements as JSON string (since URL params can't handle complex nested structures)
  formElements: z.string().optional().default('[]').transform((val) => {
    try {
      return JSON.parse(val);
    } catch {
      return [];
    }
  }).pipe(FormElementsSchema),
});

// Export schemas and types
export {
  FormBuilderStateSchema,
  FormStateSearchParamsSchema,
  FormElementsSchema,
  FormElementSchema,
  FormStepSchema,
  FormArraySchema,
  FormArrayEntrySchema,
  BaseFormElementSchema,
  FormElementListSchema,
  ValidationSchemaEnum,
  FrameworkEnum,
  FieldTypeSchema,
  OptionSchema,
  SharedFormPropsSchema,
};

// Type exports
export type FormBuilderState = z.infer<typeof FormBuilderStateSchema>;
export type FormStateSearchParams = z.infer<typeof FormStateSearchParamsSchema>;
export type FormElements = z.infer<typeof FormElementsSchema>;
export type FormElement = z.infer<typeof FormElementSchema>;
export type FormStep = z.infer<typeof FormStepSchema>;
export type FormArray = z.infer<typeof FormArraySchema>;
export type FormArrayEntry = z.infer<typeof FormArrayEntrySchema>;
export type BaseFormElement = z.infer<typeof BaseFormElementSchema>;
export type FormElementList = z.infer<typeof FormElementListSchema>;
export type ValidationSchema = z.infer<typeof ValidationSchemaEnum>;
export type Framework = z.infer<typeof FrameworkEnum>;
export type FieldType = z.infer<typeof FieldTypeSchema>;
export type Option = z.infer<typeof OptionSchema>;
