// types.ts
export type FieldType =
	| "text"
	| "email"
	| "number"
	| "password"
	| "textarea"
	| "checkbox"
	| "radio"
	| "select"
	| "date"
	| "otp"
	| "switch"
	| "slider"
	| "file";

export type Option = {
	id: string;
	label: string;
	value: string;
};

export type Validation = {
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	pattern?: string;
	min?: number;
	max?: number;
};

export type Appearance = {
	placeholder?: string;
	helpText?: string;
	width?: "auto" | "full" | "1/2" | "1/3";
};

export type ValidationSchema = "zod" | "valibot" | "arktype";
export type Framework = "react" | "vue" | "angular" | "solid";

export type FieldBase = {
	id: string;
	type: FieldType;
	label: string;
	name: string;
	validation?: Validation;
	appearance?: Appearance;
};

export type ChoiceField = FieldBase & {
	options: Option[];
};

export type Field =
	| FieldBase // generic
	| (FieldBase & { type: "textarea" })
	| (FieldBase & {
			type: "text" | "email" | "number" | "password" | "date" | "otp" | "file";
	  })
	| (FieldBase & { type: "checkbox" })
	| (FieldBase & { type: "switch" })
	| (FieldBase & { type: "slider" })
	| (ChoiceField & { type: "radio" | "select" });

export type BuilderState = {
	fields: Field[];
	selectedId?: string;
};

export const createDefaultField = (type: FieldType, id: string): Field => {
	const base: FieldBase = {
		id,
		type,
		label: `${type[0].toUpperCase()}${type.slice(1)} field`,
		name: `${type}_${id.slice(0, 4)}`,
		validation: {},
		appearance: { placeholder: "", helpText: "", width: "full" },
	};

	if (type === "radio" || type === "select") {
		return {
			...base,
			type,
			options: [
				{ id: `${id}_opt1`, label: "Option 1", value: "option1" },
				{ id: `${id}_opt2`, label: "Option 2", value: "option2" },
			],
		} as Field;
	}

	return base as Field;
};

// Settigns Types
export type Settings = {
	defaultRequiredValidation?: boolean;
	numericInput?: boolean;
	focusOnError?: boolean;
	validationMethod?: "onChange" | "onBlur" | "onDynamic";
	asyncValidation?: number;
	preferredSchema?: ValidationSchema;
	preferredFramework?: Framework;
};
