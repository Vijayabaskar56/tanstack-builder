import { useFormStore } from "@/hooks/use-form-store";
import { FormArray, FormElement, FormStep } from "@/types/form-types";
import { flattenFormSteps } from "../form-elements-helpers";
import { getArkTypeSchemaString } from "./generate-arktype-schema";
import { getValiSchemaString } from "./generate-valibot-schema";
import { getZodSchemaString } from "./generate-zod-schema";

export const generateValidationCode = () => {
	const { isMS, schemaName, validationSchema, formElements } = useFormStore();
	const parsedFormElements = isMS
		? flattenFormSteps(formElements as FormStep[])
		: formElements.flat();

	let stepSchemas: (FormElement | FormArray)[][] | undefined;

	// Generate step schemas for multi-step forms
	if (isMS) {
		stepSchemas = (formElements as FormStep[]).map((step) =>
			step.stepFields.flat(),
		);
	}
	switch (validationSchema) {
		case "zod":
			return getZodSchemaString(
				isMS
					? (formElements as FormStep[])
					: (parsedFormElements as FormElement[]),
				isMS,
				schemaName,
			);
		case "valibot":
			return getValiSchemaString(
				isMS
					? (formElements as FormStep[])
					: (parsedFormElements as FormElement[]),
				isMS,
				schemaName,
			);
		case "arktype":
			return getArkTypeSchemaString(
				parsedFormElements as FormElement[],
				isMS,
				stepSchemas,
				schemaName,
			);
		default:
			return getZodSchemaString(
				parsedFormElements as FormElement[],
				isMS,
				schemaName,
			);
	}
};
