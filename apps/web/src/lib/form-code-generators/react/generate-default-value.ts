// with default Value

import type { FormElement, FormElementOrList } from "@/form-types";
import { useFormStore } from "@/hooks/use-form-store";

/**
 * Gets the appropriate default value for a form field based on its type
 */
const getFieldDefaultValue = (
	field: FormElement,
): string | number | boolean | string[] | undefined => {
	if (field.static) {
		return undefined; // Static elements don't need default values
	}

	switch (field.fieldType) {
		case "Input":
		case "Password":
		case "Textarea":
		case "OTP":
		case "DatePicker":
			return ""; // Text-based fields default to empty string

		case "Checkbox":
		case "Switch":
			return false; // Boolean fields default to false

		case "RadioGroup":
		case "Select":
			// Return first option value if available, otherwise empty string
			if ("options" in field && field.options && field.options.length > 0) {
				return field.options[0].value;
			}
			return "";

		case "MultiSelect":
		case "ToggleGroup":
			// Multi-select fields default to empty array
			if ("type" in field && field.type === "multiple") {
				return [];
			}
			// Single toggle group - return first option if available
			if ("options" in field && field.options && field.options.length > 0) {
				return field.options[0].value;
			}
			return field.fieldType === "MultiSelect" ? [] : "";

		case "Slider":
			// Slider defaults to min value or 0
			if ("min" in field && typeof field.min === "number") {
				return field.min;
			}
			return 0;

		default:
			return ""; // Default fallback
	}
};

/**
 * Recursively processes form elements to build default values object
 */
export const processFormElements = (
	elements: FormElementOrList[],
): Record<string, string | number | boolean | string[]> => {
	const defaults: Record<string, string | number | boolean | string[]> = {};

	elements.forEach((element) => {
		if (Array.isArray(element)) {
			// Handle nested array of elements
			element.forEach((nestedElement) => {
				if (!nestedElement.static && nestedElement.name) {
					const defaultValue = getFieldDefaultValue(nestedElement);
					if (defaultValue !== undefined) {
						defaults[nestedElement.name] = defaultValue;
					}
				}
			});
		} else {
			// Handle single element
			if (!element.static && element.name) {
				const defaultValue = getFieldDefaultValue(element);
				if (defaultValue !== undefined) {
					defaults[element.name] = defaultValue;
				}
			}
		}
	});

	return defaults;
};

/**
 * Converts an object to a JavaScript object literal string with properly quoted keys
 */
const objectToLiteralString = (
	obj: Record<string, string | number | boolean | string[]>,
): string => {
	const entries = Object.entries(obj);

	if (entries.length === 0) {
		return "{}";
	}

	const formattedEntries = entries.map(([key, value]) => {
		let valueStr: string;

		if (typeof value === "string") {
			valueStr = `"${value}"`;
		} else if (typeof value === "boolean") {
			valueStr = value.toString();
		} else if (typeof value === "number") {
			valueStr = value.toString();
		} else if (Array.isArray(value)) {
			valueStr = JSON.stringify(value);
		} else {
			valueStr = String(value);
		}

		// Quote keys that need it (contain spaces, special chars, or start with number)
		const needsQuotes = /[\s-]/.test(key) || /^\d/.test(key);
		const quotedKey = needsQuotes ? `"${key}"` : key;

		return `  ${quotedKey}: ${valueStr}`;
	});

	return `{\n${formattedEntries.join(",\n")}\n}`;
};

export const getDefaultValues = () => {
	const { validationSchema, schemaName, computed } = useFormStore();
	const schema = schemaName ? schemaName : "formSchema";

	// Get the flattened form elements to process
	const formElements = computed.flattenedElements;

	// Generate default values based on form field types
	const defaultValues = processFormElements(formElements);

	// Convert the defaults object to a JavaScript object literal string
	const defaultsString = objectToLiteralString(defaultValues);

	switch (validationSchema) {
		case "zod":
			return `${defaultsString} as z.infer<typeof ${schema}>`;
		case "valibot":
			return `${defaultsString} as v.InferInput<typeof ${schema}>`;
		case "arktype":
			return `${defaultsString} as typeof ${schema}.infer`;
		default:
			return `${defaultsString} as z.infer<typeof ${schema}>`;
	}
};
