// apps/web/src/hooks/use-form-store.ts
import { useStore } from "@tanstack/react-store";
import { batch, Derived, Store } from "@tanstack/store";
import { v4 as uuid } from "uuid";
import type { Framework, ValidationSchema } from "@/components/builder/types";
import { defaultFormElements } from "@/constants/default-form-element";
import { templates } from "@/constants/templates";
import type {
	AppendElement,
	DropElement,
	EditElement,
	FormElement,
	FormElementList,
	FormElementOrList,
	FormStep,
	ReorderElements,
	SetTemplate,
} from "../form-types";
import {
	dropAtIndex,
	flattenFormSteps,
	insertAtIndex,
	transformToStepFormList,
} from "../lib/form-elements-helpers";

// Core state type without actions
type FormBuilderCoreState = {
	isMS: boolean;
	formElements: FormElementList | FormStep[];
	formName: string;
	schemaName: string;
	validationSchema: ValidationSchema;
	framework: Framework;
};
// Actions type
type FormBuilderActions = {
	setFormName: (formName: string) => void;
	setSchemaName: (schemaName: string) => void;
	setValidationSchema: (validationSchema: ValidationSchema) => void;
	setFramework: (framework: Framework) => void;
	// Save/Load functions
	saveForm: (formName: string) => void;
	loadForm: (formName: string) => void;
	getSavedForms: () => Array<{ name: string; data: Record<string, unknown>; createdAt: string }>;
	deleteSavedForm: (formName: string) => void;
	appendElement: AppendElement;
	dropElement: DropElement;
	editElement: EditElement;
	reorder: ReorderElements;
	setTemplate: SetTemplate;
	resetFormElements: () => void;
	setIsMS: (isMS: boolean) => void;
	addFormStep: (position?: number) => void;
	removeFormStep: (stepIndex: number) => void;
	reorderSteps: (newOrder: FormStep[]) => void;
	// Batch operations
	batchAppendElements: (elements: Array<FormElementOrList>) => void;
	batchEditElements: (
		edits: Array<{
			fieldIndex: number;
			j?: number;
			stepIndex?: number;
			modifiedFormElement: any;
		}>,
	) => void;
};
// Complete state type
type FormBuilderState = FormBuilderCoreState & FormBuilderActions;
// Type guard for FormStep
const isFormStep = (
	element: FormElementOrList | FormStep,
): element is FormStep => {
	return (
		typeof element === "object" &&
		element !== null &&
		"stepFields" in element &&
		Array.isArray((element as FormStep).stepFields)
	);
};
// Helper type for form elements that can be either single or array
type FormElementContainer = FormElement | FormElement[];
// Type-safe helper to check if form elements are multi-step
const isMultiStepForm = (
	formElements: FormElementList | FormStep[],
): formElements is FormStep[] => {
	return formElements.length > 0 && isFormStep(formElements[0]);
};
const initialFormElements = templates["contactUs"]
	.template as FormElementOrList[];
const initialCoreState: FormBuilderCoreState = {
	formElements: initialFormElements,
	isMS: false,
	formName: "Form",
	schemaName: "formSchema",
	validationSchema: "zod",
	framework: "react",
};

const formBuilderCoreStore = new Store<FormBuilderCoreState>(initialCoreState, {
	updateFn: (prevState) => (updater) => {
		const newState =
			typeof updater === "function" ? updater(prevState) : updater;
		if (newState.formElements.length === 0 && newState.isMS) {
			// Automatically add a default step if switching to multi-step with no elements
			return {
				...newState,
				formElements: [{ id: uuid(), stepFields: [] }] as FormStep[],
			};
		}
		return newState;
	},
	onUpdate: () => {
		console.debug("Form builder state updated:", formBuilderCoreStore.state);
	},
});

class FormBuilderError extends Error {
	constructor(
		message: string,
		public code: string,
	) {
		super(message);
		this.name = "FormBuilderError";
	}
}

const validateStepIndex = (formSteps: FormStep[], stepIndex: number): void => {
	if (stepIndex < 0 || stepIndex >= formSteps.length) {
		throw new FormBuilderError(
			`Invalid step index: ${stepIndex}. Must be between 0 and ${formSteps.length - 1}`,
			"INVALID_STEP_INDEX",
		);
	}
};
const validateFieldIndex = (
	fields: FormElementList,
	fieldIndex: number,
): void => {
	if (fieldIndex < 0 || fieldIndex >= fields.length) {
		throw new FormBuilderError(
			`Invalid field index: ${fieldIndex}. Must be between 0 and ${fields.length - 1}`,
			"INVALID_FIELD_INDEX",
		);
	}
};
const validateFieldType = (
	fieldType: string,
): fieldType is keyof typeof defaultFormElements => {
	if (!(fieldType in defaultFormElements)) {
		throw new FormBuilderError(
			`Unknown field type: ${fieldType}`,
			"UNKNOWN_FIELD_TYPE",
		);
	}
	return true;
};
const createActions = (
	store: Store<FormBuilderCoreState>,
): FormBuilderActions => {
	const appendElement: AppendElement = (options) => {
		const { fieldIndex, fieldType, id, name, content, required, ...rest } = options || {
			fieldIndex: null,
		};
		validateFieldType(fieldType);
		store.setState((state) => {
			const newFormElement = {
				id: id || uuid(),
				...defaultFormElements[fieldType],
				content: content || defaultFormElements[fieldType].content,
				label: content || (defaultFormElements[fieldType] as any).label,
				name: name || `${fieldType}-${Date.now()}`,
				required: required || true,
				fieldType,
				...rest,
			} as FormElement;
			if (state.isMS) {
				const stepIndex = options?.stepIndex ?? 0;
				const formSteps = state.formElements as FormStep[];
				validateStepIndex(formSteps, stepIndex);
				const step = formSteps[stepIndex];
				const stepFields = [...step.stepFields];
				if (typeof fieldIndex === "number") {
					validateFieldIndex(stepFields, fieldIndex);
					// Handle nested array
					const existingElement = stepFields[fieldIndex];
					if (Array.isArray(existingElement)) {
						stepFields[fieldIndex] = [...existingElement, newFormElement];
					} else {
						stepFields[fieldIndex] = [existingElement, newFormElement];
					}
				} else {
					stepFields.push(newFormElement);
				}
				const updatedSteps = formSteps.map((s, i) =>
					i === stepIndex ? { ...s, stepFields } : s,
				);
				return { ...state, formElements: updatedSteps };
			} else {
				const formElements = state.formElements as FormElementList;
				if (typeof fieldIndex === "number") {
					validateFieldIndex(formElements, fieldIndex);
					const updatedElements = [...formElements];
					const existingElement = updatedElements[fieldIndex];
					if (Array.isArray(existingElement)) {
						updatedElements[fieldIndex] = [...existingElement, newFormElement];
					} else {
						updatedElements[fieldIndex] = [existingElement, newFormElement];
					}
					return { ...state, formElements: updatedElements };
				} else {
					return { ...state, formElements: [...formElements, newFormElement] };
				}
			}
		});
	};
	const dropElement: DropElement = (options) => {
		store.setState((state) => {
			const { j, fieldIndex } = options;
			if (state.isMS) {
				const stepIndex = options?.stepIndex ?? 0;
				const formSteps = state.formElements as FormStep[];
				validateStepIndex(formSteps, stepIndex);
				const step = formSteps[stepIndex];
				const stepFields = [...step.stepFields];
				if (typeof j === "number") {
					validateFieldIndex(stepFields, fieldIndex);
					// Remove from nested array
					const existingElement = stepFields[fieldIndex];
					if (Array.isArray(existingElement)) {
						if (j < 0 || j >= existingElement.length) {
							throw new FormBuilderError(
								`Invalid nested index: ${j}`,
								"INVALID_NESTED_INDEX",
							);
						}
						const [updatedArray] = dropAtIndex(existingElement, j);
						stepFields[fieldIndex] =
							(updatedArray as any).length === 1
								? (updatedArray as any)[0]
								: (updatedArray as any);
					}
				} else {
					validateFieldIndex(stepFields, fieldIndex);
					// Remove from main step fields
					const updatedFields = dropAtIndex(stepFields, fieldIndex);
					stepFields.splice(0, stepFields.length, ...updatedFields);
				}
				const updatedSteps = formSteps.map((s, i) =>
					i === stepIndex ? { ...s, stepFields } : s,
				);
				return { ...state, formElements: updatedSteps };
			} else {
				const formElements = state.formElements as FormElementList;
				if (typeof j === "number" && Array.isArray(formElements[fieldIndex])) {
					validateFieldIndex(formElements, fieldIndex);
					const existingElement = formElements[fieldIndex];
					if (Array.isArray(existingElement)) {
						if (j < 0 || j >= existingElement.length) {
							throw new FormBuilderError(
								`Invalid nested index: ${j}`,
								"INVALID_NESTED_INDEX",
							);
						}
						const [updatedArray] = dropAtIndex(existingElement, j);
						const updatedElements = [...formElements];
						updatedElements[fieldIndex] =
							(updatedArray as any).length === 1
								? (updatedArray as any)[0]
								: (updatedArray as any);
						return { ...state, formElements: updatedElements };
					}
				} else {
					validateFieldIndex(formElements, fieldIndex);
					// Remove from main array
					const updatedElements = dropAtIndex(formElements, fieldIndex);
					return { ...state, formElements: updatedElements };
				}
			}
			return state;
		});
	};

	const editElement: EditElement = (options) => {
		const { j, fieldIndex, modifiedFormElement } = options;
		store.setState((state) => {
			if (state.isMS) {
				const stepIndex = options.stepIndex ?? 0;
				const formSteps = state.formElements as FormStep[];
				validateStepIndex(formSteps, stepIndex);
				const step = formSteps[stepIndex];
				const stepFields = [...step.stepFields];
				validateFieldIndex(stepFields, fieldIndex);
				const currentElement = stepFields[fieldIndex];
				if (typeof j === "number" && Array.isArray(currentElement)) {
					if (j < 0 || j >= currentElement.length) {
						throw new FormBuilderError(
							`Invalid nested index: ${j}`,
							"INVALID_NESTED_INDEX",
						);
					}
					// Edit nested element in array
					const updatedArray = [...currentElement];
					updatedArray[j] = {
						...updatedArray[j],
						...modifiedFormElement,
					} as FormElement;
					stepFields[fieldIndex] = updatedArray;
				} else {
					// Edit single element
					stepFields[fieldIndex] = {
						...currentElement,
						...modifiedFormElement,
					} as FormElementOrList;
				}
				const updatedSteps = formSteps.map((s, i) =>
					i === stepIndex ? { ...s, stepFields } : s,
				);
				return { ...state, formElements: updatedSteps };
			} else {
				// Single form
				const formElements = state.formElements as FormElementList;
				const updatedElements = [...formElements];
				if (typeof j === "number" && Array.isArray(formElements[fieldIndex])) {
					validateFieldIndex(formElements, fieldIndex);
					// Edit nested element in array
					const currentElement = formElements[fieldIndex] as FormElement[];
					if (j < 0 || j >= currentElement.length) {
						throw new FormBuilderError(
							`Invalid nested index: ${j}`,
							"INVALID_NESTED_INDEX",
						);
					}
					const updatedArray = [...currentElement];
					updatedArray[j] = {
						...updatedArray[j],
						...modifiedFormElement,
					} as FormElement;
					updatedElements[fieldIndex] = updatedArray;
				} else {
					validateFieldIndex(formElements, fieldIndex);
					// Edit single element
					updatedElements[fieldIndex] = {
						...formElements[fieldIndex],
						...modifiedFormElement,
					} as FormElementOrList;
				}
				return { ...state, formElements: updatedElements };
			}
		});
	};
	const reorder: ReorderElements = (options): void => {
		const { newOrder, fieldIndex } = options;
		store.setState((state) => {
			if (state.isMS) {
				const stepIndex = options.stepIndex ?? 0;
				const formSteps = state.formElements as FormStep[];
				validateStepIndex(formSteps, stepIndex);
				const step = formSteps[stepIndex];
				const stepFields = [...step.stepFields];
				if (typeof fieldIndex === "number") {
					validateFieldIndex(stepFields, fieldIndex);
					stepFields[fieldIndex] = newOrder as FormElementOrList;
				} else {
					stepFields.splice(
						0,
						stepFields.length,
						...(newOrder as FormElementList),
					);
				}
				const updatedSteps = formSteps.map((s, i) =>
					i === stepIndex ? { ...s, stepFields } : s,
				);
				return { ...state, formElements: updatedSteps };
			} else {
				// Single form
				if (typeof fieldIndex === "number") {
					const formElements = [...(state.formElements as FormElementList)];
					validateFieldIndex(formElements, fieldIndex);
					formElements[fieldIndex] = newOrder as FormElementOrList;
					return { ...state, formElements };
				} else {
					return { ...state, formElements: newOrder };
				}
			}
		});
	};

	const reorderSteps = (newOrder: FormStep[]): void => {
		store.setState((state) => ({ ...state, formElements: newOrder }));
	};
	const setTemplate: SetTemplate = (templateName: keyof typeof templates) => {
		const template = templates[templateName]?.template;
		if (!template) {
			throw new FormBuilderError(
				`Template '${templateName}' not found`,
				"TEMPLATE_NOT_FOUND",
			);
		}
		if (template.length === 0) {
			throw new FormBuilderError(
				`Template '${templateName}' is empty`,
				"EMPTY_TEMPLATE",
			);
		}
		const isTemplateMSForm = template.length > 0 && isFormStep(template[0]);
		store.setState((state) => ({
			...state,
			formElements: template,
			isMS: isTemplateMSForm,
		}));
	};
	const resetFormElements = () => {
		store.setState((state) => ({ ...state, formElements: [] }));
	};
	const setIsMS = (isMS: boolean) => {
		store.setState((state) => {
			let formElements = state.formElements;
			if (isMS) {
				formElements = transformToStepFormList(
					formElements as FormElementOrList[],
				);
			} else {
				formElements = flattenFormSteps(
					formElements as FormStep[],
				) as FormElementOrList[];
			}
			return { ...state, isMS, formElements };
		});
	};
	const addFormStep = (currentPosition?: number) => {
		store.setState((state) => {
			if (!state.isMS) {
				throw new FormBuilderError(
					"Cannot add form step to single-step form",
					"NOT_MULTI_STEP_FORM",
				);
			}
			const defaultStep: FormStep = { id: uuid(), stepFields: [] };
			const formSteps = state.formElements as FormStep[];
			if (typeof currentPosition === "number") {
				if (currentPosition < 0 || currentPosition >= formSteps.length) {
					throw new FormBuilderError(
						`Invalid position: ${currentPosition}. Must be between 0 and ${formSteps.length - 1}`,
						"INVALID_POSITION",
					);
				}
				const nextPosition = currentPosition + 1;
				const updatedSteps = insertAtIndex(
					formSteps,
					defaultStep,
					nextPosition,
				);
				return { ...state, formElements: updatedSteps };
			} else {
				return { ...state, formElements: [...formSteps, defaultStep] };
			}
		});
	};
	const removeFormStep = (stepIndex: number) => {
		store.setState((state) => {
			if (!state.isMS) {
				throw new FormBuilderError(
					"Cannot remove form step from single-step form",
					"NOT_MULTI_STEP_FORM",
				);
			}
			const formSteps = state.formElements as FormStep[];
			validateStepIndex(formSteps, stepIndex);
			if (formSteps.length <= 1) {
				throw new FormBuilderError(
					"Cannot remove the last step from a multi-step form",
					"CANNOT_REMOVE_LAST_STEP",
				);
			}
			const updatedSteps = dropAtIndex(formSteps, stepIndex);
			return { ...state, formElements: updatedSteps };
		});
	};
	const setFormName = (formName: string) => {
		store.setState((state) => ({ ...state, formName }));
	};
	const setSchemaName = (schemaName: string) => {
		store.setState((state) => ({ ...state, schemaName }));
	};
	const setValidationSchema = (validationSchema: ValidationSchema) => {
		store.setState((state) => ({ ...state, validationSchema }));
	};
	const setFramework = (framework: Framework) => {
		store.setState((state) => ({ ...state, framework }));
	};

	// Save/Load functions
	const saveForm = (formName: string) => {
		if (typeof window === "undefined") return;

		const state = store.state;
		const formData = {
			name: formName,
			data: {
				isMS: state.isMS,
				formElements: state.formElements,
				formName: state.formName,
				schemaName: state.schemaName,
				validationSchema: state.validationSchema,
				framework: state.framework,
			},
			createdAt: new Date().toISOString(),
		};

		try {
			const savedForms = JSON.parse(localStorage.getItem("savedForms") || "[]");
			const existingIndex = savedForms.findIndex((form: any) => form.name === formName);

			if (existingIndex !== -1) {
				savedForms[existingIndex] = formData;
			} else {
				savedForms.push(formData);
			}

			localStorage.setItem("savedForms", JSON.stringify(savedForms));
		} catch (error) {
			console.error("Failed to save form:", error);
		}
	};

	const loadForm = (formName: string) => {
		if (typeof window === "undefined") return;

		try {
			const savedForms = JSON.parse(localStorage.getItem("savedForms") || "[]");
			const formData = savedForms.find((form: any) => form.name === formName);

			if (formData) {
				const { data } = formData;
				store.setState({
					isMS: data.isMS,
					formElements: data.formElements,
					formName: data.formName || formName,
					schemaName: data.schemaName,
					validationSchema: data.validationSchema,
					framework: data.framework,
				});
			}
		} catch (error) {
			console.error("Failed to load form:", error);
		}
	};

	const getSavedForms = (): Array<{ name: string; data: Record<string, unknown>; createdAt: string }> => {
		if (typeof window === "undefined") return [];

		try {
			return JSON.parse(localStorage.getItem("savedForms") || "[]");
		} catch (error) {
			console.error("Failed to get saved forms:", error);
			return [];
		}
	};

	const deleteSavedForm = (formName: string) => {
		if (typeof window === "undefined") return;

		try {
			const savedForms = JSON.parse(localStorage.getItem("savedForms") || "[]");
			const filteredForms = savedForms.filter((form: any) => form.name !== formName);
			localStorage.setItem("savedForms", JSON.stringify(filteredForms));
		} catch (error) {
			console.error("Failed to delete saved form:", error);
		}
	};

	const batchAppendElements = (elements: Array<FormElementOrList>) => {
		batch(() => {
			elements.forEach((element) => {
				try {
					if (Array.isArray(element)) {
						element.forEach((el, i) => {
							if (i === 0) {
								appendElement(el as FormElement);
							} else {
								// ? Case where we have a nested array
								appendElement({
									fieldIndex: i + 1,
									stepIndex: 0,
									...el,
								});
							}
						});
					} else {
						appendElement(element as FormElement);
					}
				} catch (error) {
					console.error(
						`Failed to append element of type ${(element as any)?.fieldType}:`,
						error,
					);
					throw error;
				}
			});
		});
	};
	const batchEditElements = (
		edits: Array<{
			fieldIndex: number;
			j?: number;
			stepIndex?: number;
			modifiedFormElement: any;
		}>,
	) => {
		batch(() => {
			edits.forEach(({ fieldIndex, j, stepIndex, modifiedFormElement }) => {
				try {
					editElement({ fieldIndex, j, stepIndex, modifiedFormElement });
				} catch (error) {
					console.error(
						`Failed to edit element at index ${fieldIndex}:`,
						error,
					);
					throw error;
				}
			});
		});
	};
	return {
		appendElement,
		dropElement,
		editElement,
		reorder,
		reorderSteps,
		setTemplate,
		resetFormElements,
		setIsMS,
		addFormStep,
		removeFormStep,
		batchAppendElements,
		batchEditElements,
		setFormName,
		setSchemaName,
		setValidationSchema,
		setFramework,
		saveForm,
		loadForm,
		getSavedForms,
		deleteSavedForm,
	};
};
const formBuilderActions = createActions(formBuilderCoreStore);

const flattenedFormElementsStore = new Derived({
	fn: ({ currDepVals }) => {
		const [state] = currDepVals;
		if (state.isMS) {
			return flattenFormSteps(state.formElements as FormStep[]);
		}
		return state.formElements as FormElementList;
	},
	deps: [formBuilderCoreStore],
});
const formValidationStore = new Derived({
	fn: ({ currDepVals }) => {
		const [state] = currDepVals;
		const elements = state.isMS
			? flattenFormSteps(state.formElements as FormStep[])
			: (state.formElements as FormElementList);
		const hasRequiredFields = elements.some(
			(el) => !Array.isArray(el) && "required" in el && el.required,
		);
		const totalFields = elements.filter((el) => !Array.isArray(el)).length;
		return {
			hasRequiredFields,
			totalFields,
			isValid: totalFields > 0,
		};
	},
	deps: [formBuilderCoreStore],
});
const unmountFlattened = flattenedFormElementsStore.mount();
const unmountValidation = formValidationStore.mount();
const batchOperations = (operations: Array<() => void>) => {
	batch(() => {
		operations.forEach((op) => op());
	});
};
const createStoreSubscriptions = () => {
	const subscriptions = new Set<() => void>();
	const subscribeToFormChanges = (
		callback: (state: FormBuilderCoreState) => void,
	) => {
		const unsubscribe = formBuilderCoreStore.subscribe(() => {
			callback(formBuilderCoreStore.state);
		});
		subscriptions.add(unsubscribe);
		return unsubscribe;
	};
	const subscribeToValidationChanges = (
		callback: (validation: any) => void,
	) => {
		const unsubscribe = formValidationStore.subscribe(() => {
			callback(formValidationStore.state);
		});
		subscriptions.add(unsubscribe);
		return unsubscribe;
	};
	const unsubscribeAll = () => {
		subscriptions.forEach((unsub) => unsub());
		subscriptions.clear();
	};
	return {
		subscribeToFormChanges,
		subscribeToValidationChanges,
		unsubscribeAll,
	};
};
const batchFormOperations = {
	setTemplateAndAddElements: (
		templateName: keyof typeof templates,
		additionalElements: Array<{
			fieldType: keyof typeof defaultFormElements;
			stepIndex?: number;
		}>,
	) => {
		batch(() => {
			formBuilderActions.setTemplate(templateName);
			additionalElements.forEach(({ fieldType, stepIndex }) => {
				formBuilderActions.appendElement({ fieldType, stepIndex });
			});
		});
	},
	convertToMultiStepAndAddSteps: (stepCount: number) => {
		batch(() => {
			formBuilderActions.setIsMS(true);
			for (let i = 1; i < stepCount; i++) {
				formBuilderActions.addFormStep();
			}
		});
	},
	bulkElementOperations: (
		operations: Array<
			| { type: "append"; options: Parameters<AppendElement>[0] }
			| { type: "edit"; options: Parameters<EditElement>[0] }
			| { type: "drop"; options: Parameters<DropElement>[0] }
		>,
	) => {
		batch(() => {
			operations.forEach(({ type, options }) => {
				try {
					switch (type) {
						case "append":
							formBuilderActions.appendElement(options);
							break;
						case "edit":
							formBuilderActions.editElement(options);
							break;
						case "drop":
							formBuilderActions.dropElement(options);
							break;
					}
				} catch (error) {
					console.error(`Batch operation failed for ${type}:`, error);
					throw error;
				}
			});
		});
	},
};
export const useFormStore = () => {
	const coreState = useStore(formBuilderCoreStore);
	const flattenedElements = useStore(flattenedFormElementsStore);
	const validation = useStore(formValidationStore);
	return {
		// Core state (read-only)
		isMS: coreState.isMS,
		formElements: coreState.formElements,
		formName: coreState.formName,
		schemaName: coreState.schemaName,
		validationSchema: coreState.validationSchema,
		framework: coreState.framework,
		// Actions (write operations)
		actions: formBuilderActions,
		// Computed values (derived state)
		computed: {
			flattenedElements,
			validation,
		},
		// Batch operations utilities
		batch: {
			operations: batchOperations,
			formOperations: batchFormOperations,
		},
		subscriptions: createStoreSubscriptions(),
		errors: {
			FormBuilderError,
		},
		// Direct store access for advanced usage
		stores: {
			core: formBuilderCoreStore,
			flattened: flattenedFormElementsStore,
			validation: formValidationStore,
		},
	};
};
export const formBuilderCoreStoreInstance = formBuilderCoreStore;
export const flattenedFormElementsStoreInstance = flattenedFormElementsStore;
export const formValidationStoreInstance = formValidationStore;
// Cleanup function for unmounting derived stores
export const cleanupFormBuilderStore = () => {
	unmountFlattened();
	unmountValidation();
};
export { FormBuilderError };
export const createFormBuilderSelector = <T>(
	selector: (state: FormBuilderCoreState) => T,
) => {
	return () => useStore(formBuilderCoreStore, selector);
};
export const useFormElementsOnly = createFormBuilderSelector(
	(state) => state.formElements,
);
export const useIsMultiStep = createFormBuilderSelector((state) => state.isMS);
export const useFormElementCount = createFormBuilderSelector((state) => {
	if (state.isMS) {
		return (state.formElements as FormStep[]).reduce(
			(total, step) => total + step.stepFields.length,
			0,
		);
	}
	return (state.formElements as FormElementList).length;
});
// Performance-optimized selectors using shallow comparison
export const useFormElementsShallow = () =>
	useStore(formBuilderCoreStore, (state) => state.formElements);
export const useFormStepsShallow = () =>
	useStore(formBuilderCoreStore, (state) =>
		state.isMS ? (state.formElements as FormStep[]) : [],
	);
// Example usage documentation

/*Usage Examples:
  1. Basic usage:   const { isMS, formElements, actions, computed } = useFormBuilderStoreTanStack();
  2. Performance - optimized with selectors: const formElements = useFormElementsOnly(); const isMultiStep = useIsMultiStep();
  3. Batch operations:   const { batch } = useFormBuilderStoreTanStack(); batch.formOperations.setTemplateAndAddElements('contactUs', [{ fieldType: 'Input' }, { fieldType: 'Textarea' }]);
  4. Direct store subscription:   const { subscriptions } = useFormBuilderStoreTanStack(); const unsubscribe = subscriptions.subscribeToFormChanges((state) => { console.log('Form changed:', state); });
  5. Error try { actions.appendElement({ fieldType: 'InvalidType' }); } catch(error) { if (error instanceof FormBuilderError) { console.error('Form builder error:', error.code, error.message); } };
  */
