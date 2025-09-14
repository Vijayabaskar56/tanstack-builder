// Type definitions for better type safety
type FieldName = string | string[];
type ValidationErrors = {
  fields: Record<string, unknown>;
  form: unknown;
};

// Generic form type that has the methods we need
type FormWithValidation = {
  validateField: (...args: any[]) => any;
  validateArrayFieldsStartingFrom: (...args: any[]) => any;
  getFieldInfo: (...args: any[]) => any;
  getAllErrors: () => ValidationErrors;
};

// Helper function for validating fields (handles both regular and array fields)
export const validateField = (
  form: FormWithValidation,
  fieldName: FieldName,
) => {
  if (Array.isArray(fieldName)) {
    // For array fields, validate the entire array
    const baseFieldName = fieldName[0];
    const fieldInfo = form.getFieldInfo(baseFieldName);
    const arrayLength =
      (fieldInfo.instance?.state.value as unknown[])?.length || 0;
    return form.validateArrayFieldsStartingFrom(
      baseFieldName,
      arrayLength,
      "submit",
    );
  }

  // For regular string fields, validate as normal field
  return form.validateField(fieldName, "submit");
};

// Helper function to check if a field has errors
export const hasFieldErrors = (
  form: FormWithValidation,
  fieldName: FieldName,
  allErrors: ValidationErrors,
) => {
  if (Array.isArray(fieldName)) {
    return hasArrayFieldErrors(form, fieldName[0], allErrors);
  }
  return Object.keys(allErrors.fields).includes(fieldName);
};

// Helper function to check if an array field has errors in any index
export const hasArrayFieldErrors = (
  form: FormWithValidation,
  baseFieldName: string,
  allErrors: ValidationErrors,
) => {
  const fieldInfo = form.getFieldInfo(baseFieldName);
  const arrayLength =
    (fieldInfo.instance?.state.value as unknown[])?.length || 0;

  for (let i = 0; i < arrayLength; i++) {
    const pattern = new RegExp(`^${baseFieldName}\\[${i}\\]`);
    const hasErrorInIndex = Object.keys(allErrors.fields).some((errorField) =>
      pattern.test(errorField),
    );
    if (hasErrorInIndex) return true;
  }
  return false;
};
