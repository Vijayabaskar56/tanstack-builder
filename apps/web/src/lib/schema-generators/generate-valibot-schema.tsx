import * as v from "valibot";
import type { FormElement } from "@/form-types";
import { isStatic } from "@/lib/utils";

export const generateValiSchemaObject = (formElements: FormElement[]) => {
	const schemaObject: Record<string, any> = {};
	const addType = (element: FormElement): void => {
		if (isStatic(element.fieldType)) return;
		let elementSchema: any;
		switch (element.fieldType) {
			case "Input":
				if (element.type === "email") {
					elementSchema = v.pipe(v.string(), v.email());
					break;
				}
				if (element.type === "number") {
					elementSchema = v.pipe(v.string(), v.transform(Number), v.number());
					break;
				}
				elementSchema = v.string();
				break;
			case "DatePicker":
				elementSchema = v.pipe(
					v.string(),
					v.transform((value: string) => new Date(value)),
					v.date(),
				);
				break;
			case "Checkbox":
				elementSchema = v.optional(v.boolean(), true)
				break;
			case "Slider":
				elementSchema = v.pipe(v.string(), v.transform(Number), v.number());
				break;
			case "Switch":
				elementSchema = v.boolean();
				break;
			case "Select":
				elementSchema = v.pipe(
					v.string(),
					v.minLength(1, "Please select an item"),
				);
				break;
			case "ToggleGroup":
				elementSchema =
					element.type === "single"
						? v.pipe(v.string(), v.minLength(1, "Please select an item"))
						: v.pipe(
								v.array(v.string()),
								v.minLength(1, "Please select at least one item"),
							);
				break;
			case "MultiSelect":
				elementSchema = v.pipe(
					v.array(v.string()),
					v.minLength(1, "Please select at least one item"),
				);
				break;
			case "RadioGroup":
				elementSchema = v.pipe(
					v.string(),
					v.minLength(1, "Please select an item"),
				);
				break;
			case "Textarea":
				elementSchema = v.pipe(
					v.string(),
     v.nonEmpty('This Field is Required'),
					v.minLength(10, "Minimum Value Should be 10"),
				);
				break;
			default:
				elementSchema = v.string();
		}
		if (element.fieldType === "Slider") {
			if (element.min !== undefined) {
				elementSchema = v.pipe(
					elementSchema as any,
					v.minValue(element.min, `Must be at least ${element.min}`),
				);
			}
			if (element.max !== undefined) {
				elementSchema = v.pipe(
					elementSchema as any,
					v.maxValue(element.max, `Must be at most ${element.max}`),
				);
			}
		}
		if (!("required" in element) || element.required !== true) {
			elementSchema = v.optional(elementSchema);
		}
		schemaObject[element.name] = elementSchema;
	};
	formElements.flat().forEach(addType);
	return { schemaObject, objectSchema: v.object(schemaObject) };
};
export const generateValiSchemaString = (schema: any): string => {
	// Debug: Log the schema structure to understand what we're working with
	console.log("Schema structure:", JSON.stringify(schema, null, 2));

	// Handle pipe schemas (chained validations)
	if (schema?.type === "pipe") {
		const pipeItems = schema.pipe;
		if (!pipeItems || pipeItems.length === 0) return "v.unknown()";

		// Handle optional pipe with default value
		if (pipeItems[pipeItems.length - 1]?.type === "optional") {
			const baseSchema = pipeItems[0];
			const baseString = generateValiSchemaString(baseSchema);
			const defaultValue = pipeItems[pipeItems.length - 1].default;
			return `v.optional(${baseString}, ${JSON.stringify(defaultValue)})`;
		}

		// Handle common transform patterns
		if (
			pipeItems.length >= 3 &&
			pipeItems[0]?.type === "string" &&
			pipeItems[1]?.type === "transform" &&
			pipeItems[2]?.type === "number"
		) {
			return "v.pipe(v.string(), v.transform(Number), v.number())";
		}

		if (
			pipeItems.length >= 3 &&
			pipeItems[0]?.type === "string" &&
			pipeItems[1]?.type === "transform" &&
			pipeItems[2]?.type === "date"
		) {
			return "v.pipe(v.string(), v.transform((value) => new Date(value)), v.date())";
		}

		// Build pipe string from individual validations
		let result = generateValiSchemaString(pipeItems[0]);
		let hasValidations = false;

		for (let i = 1; i < pipeItems.length; i++) {
			const pipeItem = pipeItems[i];
			if (pipeItem?.type === "min_length") {
				result = `v.pipe(${result}, v.minLength(${pipeItem.requirement}, "${pipeItem.message || ""}"))`;
				hasValidations = true;
			} else if (pipeItem?.type === "min_value") {
				result = `v.pipe(${result}, v.minValue(${pipeItem.requirement}, "${pipeItem.message || ""}"))`;
				hasValidations = true;
			} else if (pipeItem?.type === "max_value") {
				result = `v.pipe(${result}, v.maxValue(${pipeItem.requirement}, "${pipeItem.message || ""}"))`;
				hasValidations = true;
			} else if (pipeItem?.type === "email") {
				result = `v.pipe(${result}, v.email("${pipeItem.message || ""}"))`;
				hasValidations = true;
			}
		}
		return hasValidations ? result : generateValiSchemaString(pipeItems[0]);
	}

	// Handle optional schemas
	if (schema?.type === "optional") {
		const wrapped = generateValiSchemaString(schema.wrapped);
		const defaultValue = schema.default;
		return `v.optional(${wrapped}, ${JSON.stringify(defaultValue)})`;
	}

	// Handle primitive types
	if (schema?.type === "string") {
		return "v.string()";
	}
	if (schema?.type === "number") {
		return "v.number()";
	}
	if (schema?.type === "boolean") {
		return "v.boolean()";
	}
	if (schema?.type === "date") {
		return "v.date()";
	}

	// Handle arrays
	if (schema?.type === "array") {
		const elementType = generateValiSchemaString(schema.element);
		return `v.array(${elementType})`;
	}

	// Handle objects
	if (schema?.type === "object") {
		const shape = schema.entries || {};
		const shapeStrs = Object.entries(shape).map(
			([key, value]) => `${key}: ${generateValiSchemaString(value)}`,
		);
		return `v.object({\n  ${shapeStrs.join(",\n  ")}\n})`;
	}

	// Try to detect schema type by checking for specific properties
	if (schema && typeof schema === "object") {
		// Check if it's a string schema
		if ("minLength" in schema || "maxLength" in schema || "regex" in schema) {
			return "v.string()";
		}

		// Check if it's a number schema
		if ("minimum" in schema || "maximum" in schema || "multipleOf" in schema) {
			return "v.number()";
		}

		// Check if it's an email schema
		if ("format" in schema && schema.format === "email") {
			return "v.pipe(v.string(), v.email())";
		}

		// Check if it's a boolean schema
		if ("type" in schema && schema.type === "boolean") {
			return "v.boolean()";
		}
	}

	return "v.unknown()";
};
// Direct schema string generation approach (similar to Arktype)
export const getValiSchemaStringDirect = (
	formElements: FormElement[],
): string => {
	const schemaEntries = formElements
		.filter((element) => !isStatic(element.fieldType))
		.map((element) => {
			let typeDefinition: string;

			switch (element.fieldType) {
				case "Input":
					if (element.type === "email") {
						typeDefinition = "v.pipe(v.string(), v.email())";
					} else if (element.type === "number") {
						typeDefinition =
							"v.pipe(v.string(), v.transform(Number), v.number())";
					} else {
						typeDefinition = "v.string()";
					}
					break;

				case "DatePicker":
					typeDefinition =
						"v.pipe(v.string(), v.transform((value) => new Date(value)), v.date())";
					break;

				case "Checkbox":
					typeDefinition = "v.optional(v.boolean(), true)";
					break;

				case "Slider": {
					let sliderSchema =
						"v.pipe(v.string(), v.transform(Number), v.number())";
					if (element.min !== undefined) {
						sliderSchema = `v.pipe(${sliderSchema}, v.minValue(${element.min}, "Must be at least ${element.min}"))`;
					}
					if (element.max !== undefined) {
						sliderSchema = `v.pipe(${sliderSchema}, v.maxValue(${element.max}, "Must be at most ${element.max}"))`;
					}
					typeDefinition = sliderSchema;
					break;
				}

				case "Switch":
					typeDefinition = "v.boolean()";
					break;

				case "Select":
					typeDefinition =
						'v.pipe(v.string(), v.minLength(1, "Please select an item"))';
					break;

				case "ToggleGroup":
					if (element.type === "single") {
						typeDefinition =
							'v.pipe(v.string(), v.minLength(1, "Please select an item"))';
					} else {
						typeDefinition =
							'v.pipe(v.array(v.string()), v.minLength(1, "Please select at least one item"))';
					}
					break;

				case "MultiSelect":
					typeDefinition =
						'v.pipe(v.array(v.string()), v.minLength(1, "Please select at least one item"))';
					break;

				case "RadioGroup":
					typeDefinition =
						'v.pipe(v.string(), v.minLength(1, "Please select an item"))';
					break;

				default:
					typeDefinition = "v.string()";
			}

			// Handle optional fields
			if (!("required" in element) || element.required !== true) {
				typeDefinition = `v.optional(${typeDefinition})`;
			}

			return `  "${element.name}": ${typeDefinition}`;
		})
		.join(",\n");

	return `import * as v from "valibot"

export const formSchema = v.object({
${schemaEntries}
});`;
};

// Keep the original function for now but use the direct approach
export const getValiSchemaString = (formElements: FormElement[]): string => {
	return getValiSchemaStringDirect(formElements);
};
