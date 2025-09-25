import { useLoaderData, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import type * as v from "valibot";
import { revalidateLogic, useAppForm } from "@/components/ui/tanstack-form";
import { useFormStore, useIsMultiStep } from "@/hooks/use-form-store";
import useSettings from "@/hooks/use-settings";
import { getDefaultFormElement } from "@/lib/form-code-generators/react/generate-default-value";
import { flattenFormSteps } from "@/lib/form-elements-helpers";
import { generateValiSchemaObject } from "@/lib/schema-generators/generate-valibot-schema";
import type { FormElement, FormElements, FormStep } from "@/types/form-types";

interface DefaultValues {
	[key: string]: unknown;
}
export type AppForm = ReturnType<typeof useAppForm> & {
	baseStore: {
		state: {
			values: DefaultValues;
			isSubmitting: boolean;
			isSubmitted: boolean;
		};
	};
	handleSubmit: () => void;
	AppForm: React.ComponentType<React.PropsWithChildren>;
	AppField: React.ComponentType<{
		name: string;
		children: (field: {
			FormItem: React.ComponentType<React.PropsWithChildren>;
			FormLabel: React.ComponentType<React.PropsWithChildren>;
			FormControl: React.ComponentType<React.PropsWithChildren>;
			FormDescription: React.ComponentType<React.PropsWithChildren>;
			FormMessage: React.ComponentType<React.PropsWithChildren>;
			state: { value: unknown };
			handleChange: (value: unknown) => void;
			handleBlur: () => void;
		}) => React.ReactElement;
	}>;
	reset: () => void;
};

export const useFormBuilder = (): {
	form: AppForm;
	resetForm: () => void;
} => {
	const isMS = useIsMultiStep();
	const { actions, formElements } = useFormStore();
	const shared = useLoaderData({ from: "/form-builder" });
	const hasProcessedShared = useRef(false);
	const navigator = useNavigate()
	useEffect(() => {
		if (shared && !hasProcessedShared.current) {
			hasProcessedShared.current = true;
			try {
				console.log("🚀 ~ useFormBuilder ~ shared:", shared);
				actions.setFormElements(shared as FormElements);
				//TODO: Find a Way to remove it
				// navigator({ search: true })
			} catch (error) {
				console.error("Failed to parse share param:", error);
			}
		}
	}, [shared]);
	const flattenFormElements = isMS
		? flattenFormSteps(formElements as FormStep[]).flat()
		: (formElements.flat() as FormElement[]);
	const filteredFormFields = flattenFormElements.filter((o) => !o.static);
	const settings = useSettings();
	const valiSchema = useMemo(
		() => generateValiSchemaObject(filteredFormFields),
		[filteredFormFields],
	);

	const defaultValue = useMemo(
		() => getDefaultFormElement(filteredFormFields),
		[filteredFormFields],
	);
	const form = useAppForm({
		defaultValues: defaultValue as v.InferInput<typeof valiSchema.objectSchema>,
		validationLogic: revalidateLogic(),
		validators: { onDynamic: valiSchema.objectSchema },
		onSubmit: () => {
			toast.success("Submitted Successfully");
		},
		onSubmitInvalid({ formApi }) {
			if (settings.focusOnError) {
				const errorMap = formApi.state.errorMap.onDynamic;
				const inputs = Array.from(
					document.querySelectorAll("#previewForm input"),
				) as HTMLInputElement[];

				let firstInput: HTMLInputElement | undefined;
				for (const input of inputs) {
					if (errorMap?.[input.name]) {
						firstInput = input;
						break;
					}
				}
				firstInput?.focus();
			}
		},
	});
	const { reset } = form;
	const resetForm = () => {
		actions.resetFormElements();
		reset();
	};
	return { form: form as unknown as AppForm, resetForm };
};
