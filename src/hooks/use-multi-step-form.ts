// use-multi-step-form.tsx
import { useState } from "react";
import type { FormStep } from "@/types/form-types";

type UseFormStepsProps = {
  initialSteps: Record<number, string[]>;
  onStepValidation?: (step: string[]) => Promise<boolean> | boolean;
};

export type UseMultiFormStepsReturn = {
  steps: Record<number, string[]>;

  currentStep: number;

  currentStepData: string[];

  progress: number;

  isFirstStep: boolean;

  isLastStep: boolean;

  goToNext: () => Promise<boolean>;

  goToPrevious: () => void;
};

export function useMultiStepForm({
  initialSteps,
  onStepValidation,
}: UseFormStepsProps): UseMultiFormStepsReturn {
  const steps = initialSteps;
  const [currentStep, setCurrentStep] = useState(1);
  const goToNext = async () => {
    const currentStepData = initialSteps[currentStep - 1];

    if (onStepValidation) {
      const isValid = await onStepValidation(
        currentStepData as unknown as string[],
      );
      if (!isValid) return false;
    }

    if (currentStep < Object.keys(currentStepData).length + 1) {
      setCurrentStep((prev) => prev + 1);
      return true;
    }
    return false;
  };

  const goToPrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return {
    steps,
    currentStep,
    currentStepData: steps[currentStep - 1] as string[],
    progress: (currentStep / Object.keys(steps).length) * 100,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === Object.keys(steps).length,
    goToNext,
    goToPrevious,
  };
}
