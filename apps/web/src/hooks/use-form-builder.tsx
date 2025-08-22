// use-form-builder.tsx
import { useAppForm } from "@/components/ui/tanstack-form";
import type { FormElement, FormStep } from "@/form-types";
import { useFormStore, useIsMultiStep } from "@/hooks/use-form-store";
import { flattenFormSteps } from "@/lib/form-elements-helpers";
import { generateZodSchemaObject } from "@/lib/schema-generators/generate-zod-schema";

interface DefaultValues {
	[key: string]: any;
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
			state: { value: any };
			handleChange: (value: any) => void;
			handleBlur: () => void;
		}) => React.ReactElement;
	}>;
	reset: () => void;
};

export const useFormBuilder = (): {
	form: AppForm;
	onSubmit: (data: any) => Promise<void>;
	resetForm: () => void;
} => {
	interface DefaultValues {
		[key: string]: any;
	}
	const isMS = useIsMultiStep();
	const {actions , formElements}= useFormStore();
	const flattenFormElements = isMS
		? flattenFormSteps(formElements as FormStep[]).flat()
		: (formElements.flat() as FormElement[]);
	const filteredFormFields = flattenFormElements.filter((o) => !o.static);
	const defaultValues: DefaultValues = filteredFormFields.reduce(
		(acc: DefaultValues, element) => {
			acc[element.name] = element?.defaultValue ?? "";
			return acc;
		},
		{},
	);
	const zodSchema = generateZodSchemaObject(filteredFormFields);
	const form = useAppForm({
		validators: { onBlur: zodSchema },
		defaultValues: defaultValues ?? {
			username: "",
			email: "",
			age: 0,
			bio: "",
		},
		listeners: {
			onSubmit: ({ formApi }) => {
				console.log(
					formApi.baseStore.state.values,
					formApi.baseStore.state.fieldMetaBase,
				);
				onSubmit(formApi.getFieldValue("username"));
				formApi.reset();
			},
		},
	});
	const { reset } = form;
	const resetForm = () => {
  actions.resetFormElements()
		reset();
	};
	const onSubmit = async (data: any): Promise<void> => {
		return new Promise<void>((resolve) => setTimeout(() => resolve(), 2000));
	};
	return { form: form as unknown as AppForm, onSubmit, resetForm };
};
