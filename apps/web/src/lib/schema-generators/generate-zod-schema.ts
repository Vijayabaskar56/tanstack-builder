// generate-zod-schema.tsx
import { type ZodType, z } from "zod";
import type { FormArray, FormElement } from "@/form-types";
import { isStatic } from "@/lib/utils";

// Type guard to check if an element is a FormArray
const isFormArray = (element: any): element is FormArray => {
	return (
		typeof element === "object" && element !== null && "arrayField" in element
	);
};

export const generateZodSchemaObject = (
	formElements: (FormElement | FormArray)[],
): z.ZodObject<any> => {
	const schemaObject: Record<string, ZodType> = {};

	const addType = (element: FormElement | FormArray | FormElement[]): void => {
		if (Array.isArray(element)) {
			element.forEach(addType);
			return;
		}
		if (isFormArray(element)) {
			// Create schema for the array items based on arrayField
			const arrayItemSchema: Record<string, ZodType> = {};

			const addArrayFieldType = (
				field: FormElement | FormArray | FormElement[],
			): void => {
				if (Array.isArray(field)) {
					field.forEach(addArrayFieldType);
					return;
				}
				if (isFormArray(field)) {
					// Handle nested FormArrays recursively
					const nestedArrayItemSchema: Record<string, ZodType> = {};
					const addNestedArrayFieldType = (
						nestedField: FormElement | FormArray | FormElement[],
					): void => {
						if (Array.isArray(nestedField)) {
							nestedField.forEach(addNestedArrayFieldType);
							return;
						}
						if (isFormArray(nestedField)) {
							// For now, skip deeply nested arrays to avoid complexity
							return;
						}
						if (isStatic(nestedField.fieldType)) return;

						let nestedElementSchema: ZodType;
						switch (nestedField.fieldType) {
							case "Input":
							case "Password":
								if (nestedField.type === "email") {
									nestedElementSchema = z.email();
									break;
								}
								if (nestedField.type === "number") {
									nestedElementSchema = z.coerce.number();
									break;
								}
								nestedElementSchema = z
									.string()
									.min(1, "This Field is Required");
								break;
							case "OTP":
								nestedElementSchema = z
									.string()
									.min(
										nestedField.maxLength || 6,
										`OTP must be at least ${nestedField.maxLength || 6} characters`,
									);
								break;
							case "DatePicker":
								nestedElementSchema = z.date();
								break;
							case "Checkbox":
								nestedElementSchema = z
									.boolean()
									.refine((v) => v, { message: "This Field is Required" });
								break;
							case "Slider":
								nestedElementSchema = z.number();
								break;
							case "Switch":
								nestedElementSchema = z.boolean();
								break;
							case "Select":
								nestedElementSchema = z
									.string()
									.min(1, "Please Select an item");
								break;
							case "ToggleGroup":
								nestedElementSchema =
									nestedField.type === "single"
										? z.string().min(1, "Please an item")
										: z
												.array(z.string())
												.nonempty("Please select at least one item");
								break;
							case "MultiSelect":
								nestedElementSchema = z
									.array(z.string())
									.nonempty("Please select at least one item");
								break;
							case "RadioGroup":
								nestedElementSchema = z
									.string()
									.min(1, "Please select an item");
								break;
							case "Textarea":
								nestedElementSchema = z
									.string()
									.nonempty("This Field is Required")
									.min(10, "Minimum Value Should be 10");
								break;
							default:
								nestedElementSchema = z.string();
						}
						if (nestedField.fieldType === "Slider") {
							if (nestedField.min !== undefined) {
								nestedElementSchema = (nestedElementSchema as any).min(
									nestedField.min,
									`Must be at least ${nestedField.min}`,
								);
							}
							if (nestedField.max !== undefined) {
								nestedElementSchema = (nestedElementSchema as any).max(
									nestedField.max,
									`Must be at most ${nestedField.max}`,
								);
							}
						}

						if (!("required" in nestedField) || nestedField.required !== true) {
							nestedElementSchema = nestedElementSchema.optional();
						}
						// Sanitize field name by replacing hyphens with underscores for valid JS property names
						const sanitizedNestedName = nestedField.name.replace(/-/g, "_");
						nestedArrayItemSchema[sanitizedNestedName] =
							nestedElementSchema as ZodType;
					};

					field.arrayField.forEach(addNestedArrayFieldType);
					const nestedArraySchema = z.array(z.object(nestedArrayItemSchema));
					// Sanitize field name by replacing hyphens with underscores for valid JS property names
					const sanitizedFieldName = field.name.replace(/-/g, "_");
					arrayItemSchema[sanitizedFieldName] = nestedArraySchema;
					return;
				}
				if (isStatic(field.fieldType)) return;

				let elementSchema: ZodType;
				switch (field.fieldType) {
					case "Input":
						if (field.type === "email") {
							elementSchema = z.email();
							break;
						}
						if (field.type === "number") {
							elementSchema = z.number();
							break;
						}
						elementSchema = z.string().min(1, "This Field is Required");
						break;
					case "OTP":
						elementSchema = z
							.string()
							.min(
								field.maxLength || 6,
								`OTP must be at least ${field.maxLength || 6} characters`,
							);
						break;
					case "DatePicker":
						elementSchema = z.date();
						break;
					case "Checkbox":
						elementSchema = z
							.boolean()
							.refine((v) => v, { message: "This Field is Required" });
						break;
					case "Slider":
						elementSchema = z.number();
						break;
					case "Switch":
						elementSchema = z.boolean();
						break;
					case "Select":
						elementSchema = z.string().min(1, "Please Select an item");
						break;
					case "ToggleGroup":
						elementSchema =
							field.type === "single"
								? z.string().min(1, "Please an item")
								: z
										.array(z.string())
										.nonempty("Please select at least one item");
						break;
					case "MultiSelect":
						elementSchema = z
							.array(z.string())
							.nonempty("Please select at least one item");
						break;
					case "RadioGroup":
						elementSchema = z.string().min(1, "Please select an item");
						break;
					case "Textarea":
						elementSchema = z
							.string()
							.nonempty("This Field is Required")
							.min(10, "Minimum Value Should be 10");
						break;
					default:
						elementSchema = z.string();
				}
				if (field.fieldType === "Slider") {
					if (field.min !== undefined) {
						elementSchema = (elementSchema as any).min(
							field.min,
							`Must be at least ${field.min}`,
						);
					}
					if (field.max !== undefined) {
						elementSchema = (elementSchema as any).max(
							field.max,
							`Must be at most ${field.max}`,
						);
					}
				}

				if (!("required" in field) || field.required !== true) {
					elementSchema = elementSchema.optional();
				}
				// Sanitize field name by replacing hyphens with underscores for valid JS property names
				const sanitizedFieldName = field.name.replace(/-/g, "_");
				arrayItemSchema[sanitizedFieldName] = elementSchema as ZodType;
			};

			element.arrayField.forEach(addArrayFieldType);
			const arraySchema = z.array(z.object(arrayItemSchema));
			// Sanitize field name by replacing hyphens with underscores for valid JS property names
			const sanitizedElementName = element.name.replace(/-/g, "_");
			schemaObject[sanitizedElementName] = arraySchema;
			return;
		}

		// Handle regular FormElement
		if (isStatic(element.fieldType)) return;

		let elementSchema: ZodType;
		switch (element.fieldType) {
			case "Input":
			case "Password":
				if (element.type === "email") {
					elementSchema = z.email();
					break;
				}
				if (element.type === "number") {
					elementSchema = z.number();
					break;
				}
				elementSchema = z.string().min(1, "This Field is Required");
				break;
			case "OTP":
				elementSchema = z
					.string()
					.min(
						element.maxLength || 6,
						`OTP must be at least ${element.maxLength || 6} characters`,
					);
				break;
			case "DatePicker":
				elementSchema = z.date();
				break;
			case "Checkbox":
				elementSchema = z
					.boolean()
					.refine((v) => v, { message: "This Field is Required" });
				break;
			case "Slider":
				elementSchema = z.number();
				break;
			case "Switch":
				elementSchema = z.boolean();
				break;
			case "Select":
				elementSchema = z.string().min(1, "Please Select an item");
				break;
			case "ToggleGroup":
				elementSchema =
					element.type === "single"
						? z.string().min(1, "Please an item")
						: z.array(z.string()).nonempty("Please select at least one item");
				break;
			case "MultiSelect":
				elementSchema = z
					.array(z.string())
					.nonempty("Please select at least one item");
				break;
			case "RadioGroup":
				elementSchema = z.string().min(1, "Please select an item");
				break;
			case "Textarea":
				elementSchema = z
					.string()
					.nonempty("This Field is Required")
					.min(10, "Minimum Value Should be 10");
				break;
			default:
				elementSchema = z.string();
		}
		if (element.fieldType === "Slider") {
			if (element.min !== undefined) {
				elementSchema = (elementSchema as any).min(
					element.min,
					`Must be at least ${element.min}`,
				);
			}
			if (element.max !== undefined) {
				elementSchema = (elementSchema as any).max(
					element.max,
					`Must be at most ${element.max}`,
				);
			}
		}

		if (!("required" in element) || element.required !== true) {
			elementSchema = elementSchema.optional();
		}
		// Ensure fieldSchema is of typZodType
		// Sanitize field name by replacing hyphens with underscores for valid JS property names
		const sanitizedElementName = element.name.replace(/-/g, "_");
		schemaObject[sanitizedElementName] = elementSchema as ZodType;
	};

	// Process all elements, handling both arrays and single elements
	formElements.forEach((element) => {
		if (Array.isArray(element)) {
			element.forEach(addType);
		} else {
			addType(element);
		}
	});

	return z.object(schemaObject);
};

export const generateZodSchemaString = (schema: ZodType): string => {
	if (schema instanceof z.ZodDefault) {
		return `${generateZodSchemaString(schema.def.innerType as ZodType)}.default(${JSON.stringify(schema.def.defaultValue)})`;
	}

	if (schema instanceof z.ZodBoolean) {
		return "z.boolean()";
	}

	if (schema instanceof z.ZodEmail) {
		return "z.email()";
	}

	if (schema instanceof z.ZodNumber) {
		let result = "z.number()";
		// In Zod v4, constraints are stored in the checks array with _zod.def structure
		if (
			"checks" in schema.def &&
			schema.def.checks &&
			Array.isArray(schema.def.checks)
		) {
			schema.def.checks.forEach((check: any) => {
				// Check if the check object has the _zod property (Zod v4 structure)
				if (check._zod && check._zod.def) {
					const checkDef = check._zod.def;
					if (checkDef.check === "greater_than") {
						result += `.min(${checkDef.value}, "Must be at least ${checkDef.value}")`;
					} else if (checkDef.check === "less_than") {
						result += `.max(${checkDef.value}, "Must be at most ${checkDef.value}")`;
					}
				}
				// Fallback for older Zod versions or different structures
				else if (check.kind === "min") {
					result += `.min(${check.value}, "Must be at least ${check.value}")`;
				} else if (check.kind === "max") {
					result += `.max(${check.value}, "Must be at most ${check.value}")`;
				}
			});
		}

		return result;
	}

	if (schema instanceof z.ZodString) {
		let result = "z.string()";
		let hasMinConstraint = false;

		if (
			"checks" in schema.def &&
			schema.def.checks &&
			Array.isArray(schema.def.checks)
		) {
			schema.def.checks.forEach((check: any) => {
				// Handle different check structures
				if (check.kind === "min") {
					result += `.min(${check.value}, "${check.message || ""}")`;
					hasMinConstraint = true;
				} else if (check.kind === "max") {
					result += `.max(${check.value}, "${check.message || ""}")`;
				} else if (check.kind === "nonempty") {
					result += `.nonempty("${check.message || ""}")`;
					hasMinConstraint = true;
				}
				// Handle Zod v4 structure with _zod property
				else if (check._zod && check._zod.def) {
					const checkDef = check._zod.def;
					if (checkDef.check === "min") {
						result += `.min(${checkDef.value}, "${checkDef.message || ""}")`;
						hasMinConstraint = true;
					} else if (checkDef.check === "max") {
						result += `.max(${checkDef.value}, "${checkDef.message || ""}")`;
					}
				}
			});
		}

		// If this is not an optional string and doesn't have min constraint, add default min(1)
		// This handles the case where required string fields should have min validation
		if (!hasMinConstraint && !(schema instanceof z.ZodOptional)) {
			result += `.min(1, "This field is required")`;
		}

		return result;
	}

	if (schema instanceof z.ZodDate) {
		return "z.date()";
	}

	if (schema instanceof z.ZodArray) {
		const elementString = generateZodSchemaString(schema.element as ZodType);
		// For FormArrays, don't add nonempty validation by default
		return `z.array(${elementString})`;
	}

	if (schema instanceof z.ZodTuple) {
		return `z.tuple([${schema.def.items.map((item) => generateZodSchemaString(item as any)).join(", ")}])`;
	}

	if (schema instanceof z.ZodObject) {
		const shape = schema.shape;
		const shapeStrs = Object.entries(shape).map(([key, value]) => {
			// Quote keys that need it (contain spaces or start with number)
			const needsQuotes = /\s/.test(key) || /^\d/.test(key);
			const quotedKey = needsQuotes ? `"${key}"` : key;
			return `${quotedKey}: ${generateZodSchemaString(value as ZodType)}`;
		});
		return `
    z.object({
      ${shapeStrs.join(",\n  ")}
    })`;
	}

	if (schema instanceof z.ZodOptional) {
		return `${generateZodSchemaString(schema.unwrap() as ZodType)}.optional()`;
	}

	return "z.unknown()";
};

export const getZodSchemaString = (
	formElements: (FormElement | FormArray)[],
): string => {
	const schema = generateZodSchemaObject(formElements);
	const schemaEntries = Object.entries(schema.shape)
		.map(([key, value]) => {
			// Quote keys that need it (contain spaces or start with number)
			const needsQuotes = /\s/.test(key) || /^\d/.test(key);
			const quotedKey = needsQuotes ? `"${key}"` : key;
			return `${quotedKey}: ${generateZodSchemaString(value as ZodType)}`;
		})
		.join(",\n");

	return `
  import * as z from "zod"
  export const formSchema = z.object({\n${schemaEntries}\n});`;
};
