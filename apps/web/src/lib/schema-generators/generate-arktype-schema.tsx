import { type } from "arktype";
import type { FormElement } from "@/form-types";
import { isStatic } from "@/lib/utils";

export const generateArkTypeSchemaObject = (formElements: FormElement[]) => {
	const schemaObject: Record<string, any> = {};

	const addType = (element: FormElement): void => {
		if (isStatic(element.fieldType)) return;

		let elementSchema: any;

		switch (element.fieldType) {
			case "Input":
				if (element.type === "email") {
					elementSchema = type("string.email");
					break;
				}
				if (element.type === "number") {
					elementSchema = type("number");
					break;
				}
				elementSchema = type("string");
				break;

			case "DatePicker":
				elementSchema = type("Date");
				break;

			case "Checkbox":
				elementSchema = type("boolean");
				break;

			case "Slider":
				elementSchema = type("number");
				break;

			case "Switch":
				elementSchema = type("boolean");
				break;

			case "Select":
				elementSchema = type("string >= 1");
				break;

			case "ToggleGroup":
				elementSchema = element.type === "single"
					? type("string >= 1")
					: type("string[] >= 1");
				break;

			case "MultiSelect":
				elementSchema = type("string[] >= 1");
				break;

			case "RadioGroup":
				elementSchema = type("string >= 1");
				break;

			default:
				elementSchema = type("string");
		}

		// Add validation constraints for Slider
		if (element.fieldType === "Slider") {
			if (element.min !== undefined && element.max !== undefined) {
				elementSchema = type(`number >= ${element.min} & number <= ${element.max}`);
			} else if (element.min !== undefined) {
				elementSchema = type(`number >= ${element.min}`);
			} else if (element.max !== undefined) {
				elementSchema = type(`number <= ${element.max}`);
			}
		}

		// Handle required/optional fields - ArkType uses union with undefined for optional
		if (!("required" in element) || element.required !== true) {
			elementSchema = type([elementSchema, "undefined"]);
		}

		schemaObject[element.name] = elementSchema;
	};

	formElements.flat().forEach(addType);
	return type(schemaObject);
};
export const generateArkTypeSchemaString = (schema: any): string => {
	if (!schema) return '"unknown"';

	// Handle string literals directly
	if (typeof schema === "string") {
		return `"${schema}"`;
	}

	// Try to extract the original definition string from ArkType
	if (schema.definition) {
		return `"${schema.definition}"`;
	}

	// Handle ArkType internal structure
	if (schema.inner) {
		return generateArkTypeSchemaString(schema.inner);
	}

	// Handle morphs (transformations)
	if (schema.kind === "morph") {
		return generateArkTypeSchemaString(schema.from);
	}

	// Handle unions (including optional fields)
	if (schema.kind === "union") {
		if (schema.branches?.length === 2) {
			const nonUndefined = schema.branches.find((b: any) => b.kind !== "unit" || b.unit !== undefined);
			const hasUndefined = schema.branches.some((b: any) => b.kind === "unit" && b.unit === undefined);

			if (hasUndefined && nonUndefined) {
				// This is an optional field
				return `${generateArkTypeSchemaString(nonUndefined)} | undefined`;
			}
		}

		const unionStrs = schema.branches?.map((branch: any) =>
			generateArkTypeSchemaString(branch)
		) || [];
		return unionStrs.join(" | ");
	}

	// Handle intersections
	if (schema.kind === "intersection") {
		const intersectionStrs = schema.branches?.map((branch: any) =>
			generateArkTypeSchemaString(branch)
		) || [];
		return intersectionStrs.join(" & ");
	}

	// Handle constraints
	if (schema.kind === "constraint") {
		const base = generateArkTypeSchemaString(schema.base || schema.in);
		if (schema.rule) {
			const rule = schema.rule;
			if (rule.rule !== undefined) {
				if (rule.kind === "min") {
					return `"${base.replace(/"/g, "")} >= ${rule.rule}"`;
				}
				if (rule.kind === "max") {
					return `"${base.replace(/"/g, "")} <= ${rule.rule}"`;
				}
				if (rule.kind === "length") {
					return `"${base.replace(/"/g, "")} >= ${rule.rule}"`;
				}
				if (rule.kind === "regex" && rule.rule.source.includes("@")) {
					return '"string.email"';
				}
			}
		}
		return base;
	}

	// Handle primitive types
	if (schema.kind === "unit") {
		if (schema.unit === undefined) return "undefined";
		if (typeof schema.unit === "string") return `"${schema.unit}"`;
		return schema.unit.toString();
	}

	if (schema.kind === "domain") {
		switch (schema.domain) {
			case "string": return '"string"';
			case "number": return '"number"';
			case "boolean": return '"boolean"';
			case "object": return '"object"';
			case "bigint": return '"bigint"';
			case "symbol": return '"symbol"';
		}
	}

	// Handle built-in types
	if (schema.kind === "proto") {
		if (schema.proto === Date) return '"Date"';
		if (schema.proto === Array) return '"unknown[]"';
		if (schema.proto === RegExp) return '"RegExp"';
	}

	// Handle arrays
	if (schema.kind === "array") {
		const element = generateArkTypeSchemaString(schema.element);
		return `"${element.replace(/"/g, "")}[]"`;
	}

	// Handle sequence (array with constraints)
	if (schema.kind === "sequence") {
		const element = generateArkTypeSchemaString(schema.element);
		if (schema.prefix?.length) {
			const constraints = schema.prefix
				.map((p: any) => {
					if (p.kind === "constraint" && p.rule?.kind === "min") {
						return ` >= ${p.rule.rule}`;
					}
					return "";
				})
				.join("");
			return `"${element.replace(/"/g, "")}[]${constraints}"`;
		}
		return `"${element.replace(/"/g, "")}[]"`;
	}

	// Handle objects
	if (schema.kind === "structure") {
		const required = schema.required || [];
		const optional = schema.optional || [];
		const entries: string[] = [];

		required.forEach((entry: any) => {
			if (entry.key && entry.value) {
				entries.push(`${entry.key}: ${generateArkTypeSchemaString(entry.value)}`);
			}
		});

		optional.forEach((entry: any) => {
			if (entry.key && entry.value) {
				entries.push(`"${entry.key}?": ${generateArkTypeSchemaString(entry.value)}`);
			}
		});

		return `{ ${entries.join(", ")} }`;
	}

	// Fallback - try to determine from domain/kind
	if (schema.domain === "string") return '"string"';
	if (schema.domain === "number") return '"number"';
	if (schema.domain === "boolean") return '"boolean"';
	if (schema.kind === "Date") return '"Date"';

	return '"unknown"';
};
export const getArkTypeSchemaString = (formElements: FormElement[]): string => {
	// Generate ArkType definitions directly from form elements
	const schemaEntries = formElements
		.filter(element => !isStatic(element.fieldType))
		.map(element => {
			let typeDefinition: string;

			switch (element.fieldType) {
				case "Input":
					if (element.type === "email") {
						typeDefinition = '"string.email"';
					} else if (element.type === "number") {
						typeDefinition = '"number"';
					} else {
						typeDefinition = '"string"';
					}
					break;

				case "DatePicker":
					typeDefinition = '"Date"';
					break;

				case "Checkbox":
					typeDefinition = '"boolean"';
					break;

				case "Slider":
					if (element.min !== undefined && element.max !== undefined) {
						typeDefinition = `"number >= ${element.min} & number <= ${element.max}"`;
					} else if (element.min !== undefined) {
						typeDefinition = `"number >= ${element.min}"`;
					} else if (element.max !== undefined) {
						typeDefinition = `"number <= ${element.max}"`;
					} else {
						typeDefinition = '"number"';
					}
					break;

				case "Switch":
					typeDefinition = '"boolean"';
					break;

				case "Select":
					typeDefinition = '"string >= 1"';
					break;

				case "ToggleGroup":
					typeDefinition = element.type === "single"
						? '"string >= 1"'
						: '"string[] >= 1"';
					break;

				case "MultiSelect":
					typeDefinition = '"string[] >= 1"';
					break;

				case "RadioGroup":
					typeDefinition = '"string >= 1"';
					break;

				default:
					typeDefinition = '"string"';
			}

			// Handle optional fields - ArkType uses the ? syntax or union with undefined
			if (!("required" in element) || element.required !== true) {
				const fieldName = `"${element.name}?"`;
				return `  ${fieldName}: ${typeDefinition}`;
			} else {
				return `  "${element.name}": ${typeDefinition}`;
			}
		})
		.join(",\n");

	return `import { type } from "arktype"

export const formSchema = type({
${schemaEntries}
});`;
};
