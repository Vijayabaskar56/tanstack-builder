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
					v.transform((value: any) => new Date(value)),
					v.date(),
				);
				break;
			case "Checkbox":
				elementSchema = v.optional(v.boolean(), true);
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
			default:
				elementSchema = v.string();
		}
		if (element.fieldType === "Slider") {
			if (element.min !== undefined) {
				elementSchema = v.pipe(
					elementSchema,
					v.minValue(element.min, `Must be at least ${element.min}`),
				);
			}
			if (element.max !== undefined) {
				elementSchema = v.pipe(
					elementSchema,
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
	return v.object(schemaObject);
};
export const generateValiSchemaString = (schema: any): string => {
	if ("pipe" in schema && schema.pipe && schema.pipe.length > 0) {
		const pipeItems = schema.pipe;
		if (pipeItems[pipeItems.length - 1]?.kind === "optional") {
			const baseSchema = pipeItems[0];
			const baseString = generateValiSchemaString(baseSchema);
			const defaultValue = pipeItems[pipeItems.length - 1].default;
			return `v.optional(${baseString}, ${JSON.stringify(defaultValue)})`;
		}
		if (
			pipeItems.length >= 3 &&
			pipeItems[0]?.kind === "string" &&
			pipeItems[1]?.kind === "transform" &&
			pipeItems[2]?.kind === "number"
		) {
			return "v.pipe(v.string(), v.transform(Number), v.number())";
		}
		if (
			pipeItems.length >= 3 &&
			pipeItems[0]?.kind === "string" &&
			pipeItems[1]?.kind === "transform" &&
			pipeItems[2]?.kind === "date"
		) {
			return "v.pipe(v.string(), v.transform((value) => new Date(value)), v.date())";
		}
		let result = generateValiSchemaString(pipeItems[0]);
		let hasValidations = false;
		for (let i = 1; i < pipeItems.length; i++) {
			const pipeItem = pipeItems[i];
			if (pipeItem?.kind === "min_length") {
				result = `v.pipe(${result}, v.minLength(${pipeItem.requirement}, "${pipeItem.message || ""}"))`;
				hasValidations = true;
			} else if (pipeItem?.kind === "min_value") {
				result = `v.pipe(${result}, v.minValue(${pipeItem.requirement}, "${pipeItem.message || ""}"))`;
				hasValidations = true;
			} else if (pipeItem?.kind === "max_value") {
				result = `v.pipe(${result}, v.maxValue(${pipeItem.requirement}, "${pipeItem.message || ""}"))`;
				hasValidations = true;
			} else if (pipeItem?.kind === "email") {
				result = `v.pipe(${result}, v.email("${pipeItem.message || ""}"))`;
				hasValidations = true;
			}
		}
		return hasValidations ? result : generateValiSchemaString(pipeItems[0]);
	}
	if (schema?.kind === "optional") {
		const wrapped = generateValiSchemaString(schema.wrapped);
		const defaultValue = schema.default;
		return `v.optional(${wrapped}, ${JSON.stringify(defaultValue)})`;
	}
	if (schema?.kind === "string") {
		return "v.string()";
	}
	if (schema?.kind === "number") {
		return "v.number()";
	}
	if (schema?.kind === "boolean") {
		return "v.boolean()";
	}
	if (schema?.kind === "date") {
		return "v.date()";
	}
	if (schema?.kind === "array") {
		const elementType = generateValiSchemaString(schema.type);
		return `v.array(${elementType})`;
	}
	if (schema?.kind === "object") {
		const shape = schema.entries || {};
		const shapeStrs = Object.entries(shape).map(
			([key, value]) => `${key}: ${generateValiSchemaString(value)}`,
		);
		return `v.object({\n  ${shapeStrs.join(",\n  ")}\n})`;
	}
	return "v.unknown()";
};
export const getValiSchemaString = (formElements: FormElement[]): string => {
	const schema = generateValiSchemaObject(formElements);
	const schemaEntries = Object.entries((schema as any).entries || {})
		.map(([key, value]) => {
			return `"${key}": ${generateValiSchemaString(value)}`;
		})
		.join(",\n");
	return `import * as v from "valibot"
export interface ActionResponse<T = any> {    success: boolean    message: string    errors?: {        [K in keyof T]?: string[]    }    inputs?: T}
export const formSchema = v.object({${schemaEntries}});`;
};
