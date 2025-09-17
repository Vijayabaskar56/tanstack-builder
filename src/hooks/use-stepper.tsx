import { useState, useCallback } from "react";
import type { AnyFormApi } from "@tanstack/react-form";
import type { ZodObject } from "zod";

type HandleCancelOrBackOpts = {
	onBack?: VoidFunction;
	onCancel?: VoidFunction;
};
type StepState = {
	value: number;
	count: number;
	goToNextStep: () => void;
	goToPrevStep: () => void;
	isCompleted: boolean;
};

/**
 * Hook for managing multi-step form navigation and validation
 *
 * @param schemas - Array of Zod schemas for each step
 * @returns Object with stepper state and methods
 */
export function useFormStepper(schemas: ZodObject[]) {
	const stepCount = schemas.length;
	const [currentStep, setCurrentStep] = useState(1); // Start from 1

	const goToNextStep = useCallback(() => {
		setCurrentStep((prev) => Math.min(prev + 1, stepCount));
	}, [stepCount]);

	const goToPrevStep = useCallback(() => {
		setCurrentStep((prev) => Math.max(prev - 1, 1));
	}, []);

	const step: StepState = {
		value: currentStep,
		count: stepCount,
		goToNextStep,
		goToPrevStep,
		isCompleted: currentStep === stepCount,
	};

	const currentValidator = schemas[currentStep - 1]; // Convert to 0-based for array access
	const isFirstStep = currentStep === 1;

	const triggerFormGroup = async (form: AnyFormApi) => {
		// Get all form values
		const allValues = form.baseStore.state.values;

		// Extract only the values for the current step fields
		const currentStepFields = Object.keys(currentValidator.shape);
		const stepValues: Record<string, any> = {};

		for (const fieldName of currentStepFields) {
			if (fieldName in allValues) {
				stepValues[fieldName] = allValues[fieldName];
			}
		}

		const result = currentValidator.safeParse(stepValues);
		if (!result.success) {
			// Trigger validation for current step fields
			for (const fieldName of currentStepFields) {
				await form.validateField(fieldName, "change");
			}
			return result;
		}

		return result;
	};

	const handleNextStepOrSubmit = async (form: AnyFormApi) => {
		const result = await triggerFormGroup(form);
		if (!result.success) {
			return;
		}

		if (currentStep < stepCount) {
			goToNextStep();
			return;
		}

		if (currentStep === stepCount) {
			form.handleSubmit();
		}
	};

	const handleCancelOrBack = (opts?: HandleCancelOrBackOpts) => {
		if (isFirstStep || step.isCompleted) {
			opts?.onCancel?.();
			return;
		}

		if (currentStep > 1) {
			opts?.onBack?.();
			goToPrevStep();
		}
	};

	return {
		step, // Current step state
		currentStep, // Current step number (1-based)
		isFirstStep, // Whether current step is the first step
		currentValidator, // Zod schema for current step
		triggerFormGroup, // Validate current step fields
		handleNextStepOrSubmit, // Handle next/submit action
		handleCancelOrBack, // Handle back/cancel action
	};
}
