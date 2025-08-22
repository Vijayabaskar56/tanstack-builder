// generate-arktype-schema.tsx

import { type } from "arktype";
import type { FormElement } from "@/form-types";
import { isStatic } from "@/lib/utils";
export const generateArkTypeSchemaObject = (formElements: FormElement[]) => {
	const schemaObject: Record<string, string> = {};
	const addType = (element: FormElement): void => {
		if (isStatic(element.fieldType)) return;
		let elementType: string;
		switch (element.fieldType) {
			case "Input":
				if (element.type === "email") {
					elementType = "string.email";
				} else if (element.type === "number") {
					elementType = "number";
				} else {
					elementType = "string";
				}
				break;
			case "DatePicker":
				elementType = "string.date.parse";
				break;
			case "Checkbox":
				elementType = "boolean";
				break;
			case "Slider":
				elementType = "number";
				break;
			case "Switch":
				elementType = "boolean";
				break;
			case "Select":
				elementType = "string";
				break;
			case "ToggleGroup":
				elementType = element.type === "single" ? "string" : "string[]";
				break;
			case "MultiSelect":
				elementType = "string[]";
				break;
			case "RadioGroup":
				elementType = "string";
				break;
			default:
				elementType = "string";
		}
		// Add validation constraints
		if (element.fieldType === "Slider") {
			if (element.min !== undefined && element.max !== undefined) {
				elementType = `number >= ${element.min} & number <= ${element.max}`;
			} else if (element.min !== undefined) {
				elementType = `number >= ${element.min}`;
			} else if (element.max !== undefined) {
				elementType = `number <= ${element.max}`;
			}
		}
		// Handle required/optional fields
		if (!("required" in element) || element.required !== true) {
			elementType = `${elementType}?`;
		}
		schemaObject[element.name] = elementType;
	};
	formElements.flat().forEach(addType);
	return type(schemaObject);
};
export const generateArkTypeSchemaString = (schema: any): string => {
	if (!schema) return "unknown";
	// Handle primitive types
	if (schema.kind === "string") return "string";
	if (schema.kind === "number") return "number";
	if (schema.kind === "boolean") return "boolean";
	// Handle constraints
	if (schema.kind === "constraint") {
		const baseType = generateArkTypeSchemaString(schema.type);
		if (schema.rule?.kind === "min") {
			return `${baseType} >= ${schema.rule.rule}`;
		}
		if (schema.rule?.kind === "max") {
			return `${baseType} <= ${schema.rule.rule}`;
		}
		if (schema.rule?.kind === "regex") {
			if (schema.rule.rule.source.includes("@")) {
				return "string.email";
			}
			return baseType;
		}
		return baseType;
	}
	// Handle array types
	if (schema.kind === "array") {
		const elementType = generateArkTypeSchemaString(schema.type);
		return `${elementType}[]`;
	}
	// Handle object types
	if (schema.kind === "object") {
		const shape = schema.entries || {};
		const shapeStrs = Object.entries(shape).map(
			([key, value]) => `${key}: "${generateArkTypeSchemaString(value)}"`,
		);
		return `{ ${shapeStrs.join(", ")} }`;
	}
	// Handle union types
	if (schema.kind === "union") {
		if (schema.branches?.length === 2) {
			const [first, second] = schema.branches;
			if (second.kind === "undefined") {
				return `${generateArkTypeSchemaString(first)}?`;
			}
		}
		const unionStrs =
			schema.branches?.map((branch: any) =>
				generateArkTypeSchemaString(branch),
			) || [];
		return unionStrs.join(" | ");
	}
	// Handle transform types (like date parsing)
	if (schema.kind === "transform") {
		if (
			schema.kind === "transform" &&
			schema.type?.kind === "string" &&
			schema.to?.kind === "date"
		) {
			return "string.date.parse";
		}
		return generateArkTypeSchemaString(schema.type);
	}
	return "unknown";
};
export const getArkTypeSchemaString = (formElements: FormElement[]): string => {
	const schema = generateArkTypeSchemaObject(formElements);
	// Get the object entries from the arktype schema
	const schemaEntries = Object.entries((schema as any).entries || {})
		.map(([key, value]) => {
			return `${key}: "${generateArkTypeSchemaString(value)}"`;
		})
		.join(",\n  ");
	return `import { type } from "arktype"
export interface ActionResponse<T = any> {    success: boolean    message: string    errors?: {        [K in keyof T]?: string[]    }    inputs?: T}
export const formSchema = type({  ${schemaEntries}});`;
};
