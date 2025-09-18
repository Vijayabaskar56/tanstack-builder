// generate-valibot-schema.tsx
import * as v from "valibot";
import type { FormArray, FormElement } from "@/types/form-types";
import { isStatic } from "@/lib/utils";

// Type definitions for Valibot schemas
/** Valibot schema type - represents any Valibot schema */
type ValiSchema = any;
/** Record of field names to Valibot schemas */
type ValiSchemaRecord = Record<string, ValiSchema>;

// Type guard to check if an element is a FormArray
const isFormArray = (element: unknown): element is FormArray => {
  return (
    typeof element === "object" &&
    element !== null &&
    "arrayField" in element &&
    "fieldType" in element &&
    element.fieldType === "FormArray"
  );
};

export const generateValiSchemaObject = (
  formElements: (FormElement | FormArray)[],
) => {
  const schemaObject: ValiSchemaRecord = {};
  const addType = (element: FormElement | FormArray): void => {
    if (isFormArray(element)) {
      // Handle FormArray
      // Use the template arrayField for schema generation
      const actualFields = element.arrayField;
      const arraySchema = generateValiSchemaObject(
        actualFields as FormElement[],
      );
      let elementSchema: ValiSchema = v.array(arraySchema.objectSchema);

      if (!("required" in element) || element.required !== true) {
        elementSchema = v.optional(elementSchema);
      }

      schemaObject[element.name] = elementSchema;
      return;
    }

    // Handle regular FormElement
    if (isStatic(element.fieldType)) return;
    let elementSchema: ValiSchema;
    switch (element.fieldType) {
      case "Input":
      case "Password":
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
      case "OTP":
        elementSchema = v.pipe(
          v.string(),
          v.minLength(
            element.maxLength || 6,
            `OTP must be at least ${element.maxLength || 6} characters`,
          ),
        );
        break;
      case "DatePicker":
        elementSchema = v.pipe(
          v.string(),
          v.transform((value: string) => new Date(value)),
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
                v.array(v.unknown()),
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
      case "Textarea":
        elementSchema = v.pipe(
          v.string(),
          v.nonEmpty("This Field is Required"),
          v.minLength(10, "Minimum Value Should be 10"),
        );
        break;
      default:
        elementSchema = v.string();
    }
    if (element.fieldType === "Slider") {
      if (element.min !== undefined) {
        elementSchema = v.pipe(
          elementSchema as any, // Valibot pipe requires specific schema types
          v.minValue(element.min, `Must be at least ${element.min}`),
        );
      }
      if (element.max !== undefined) {
        elementSchema = v.pipe(
          elementSchema as any, // Valibot pipe requires specific schema types
          v.maxValue(element.max, `Must be at most ${element.max}`),
        );
      }
    }
    if (!("required" in element) || element.required !== true) {
      elementSchema = v.optional(elementSchema);
    }
    const fieldName = element.name.split(".").pop() || element.name;
    schemaObject[fieldName] = elementSchema;
  };

  // Process all elements, handling both arrays and single elements
  formElements.forEach((element) => {
    if (Array.isArray(element)) {
      element.forEach(addType);
    } else {
      addType(element);
    }
  });

  return { schemaObject, objectSchema: v.object(schemaObject) };
};
export const generateValiSchemaString = (schema: ValiSchema): string => {
  // Debug: Log the schema structure to understand what we're working with
  console.log("Schema structure:", JSON.stringify(schema, null, 2));

  // Handle pipe schemas (chained validations)
  if (schema?.type === "pipe") {
    const pipeItems = schema.pipe;
    if (!pipeItems || pipeItems.length === 0) return "v.unknown()";

    // Handle optional pipe with default value
    if (pipeItems[pipeItems.length - 1]?.type === "optional") {
      const baseSchema = pipeItems[0];
      const baseString = generateValiSchemaString(baseSchema);
      const defaultValue = pipeItems[pipeItems.length - 1].default;
      return `v.optional(${baseString}, ${JSON.stringify(defaultValue)})`;
    }

    // Handle common transform patterns
    if (
      pipeItems.length >= 3 &&
      pipeItems[0]?.type === "string" &&
      pipeItems[1]?.type === "transform" &&
      pipeItems[2]?.type === "number"
    ) {
      return "v.pipe(v.string(), v.transform(Number), v.number())";
    }

    if (
      pipeItems.length >= 3 &&
      pipeItems[0]?.type === "string" &&
      pipeItems[1]?.type === "transform" &&
      pipeItems[2]?.type === "date"
    ) {
      return "v.pipe(v.string(), v.transform((value) => new Date(value)), v.date())";
    }

    // Build pipe string from individual validations
    let result = generateValiSchemaString(pipeItems[0]);
    let hasValidations = false;

    for (let i = 1; i < pipeItems.length; i++) {
      const pipeItem = pipeItems[i];
      if (pipeItem?.type === "min_length") {
        result = `v.pipe(${result}, v.minLength(${pipeItem.requirement}, "${pipeItem.message || ""}"))`;
        hasValidations = true;
      } else if (pipeItem?.type === "min_value") {
        result = `v.pipe(${result}, v.minValue(${pipeItem.requirement}, "${pipeItem.message || ""}"))`;
        hasValidations = true;
      } else if (pipeItem?.type === "max_value") {
        result = `v.pipe(${result}, v.maxValue(${pipeItem.requirement}, "${pipeItem.message || ""}"))`;
        hasValidations = true;
      } else if (pipeItem?.type === "email") {
        result = `v.pipe(${result}, v.email("${pipeItem.message || ""}"))`;
        hasValidations = true;
      }
    }
    return hasValidations ? result : generateValiSchemaString(pipeItems[0]);
  }

  // Handle optional schemas
  if (schema?.type === "optional") {
    const wrapped = generateValiSchemaString(schema.wrapped);
    const defaultValue = schema.default;
    return `v.optional(${wrapped}, ${JSON.stringify(defaultValue)})`;
  }

  // Handle primitive types
  if (schema?.type === "string") {
    return "v.string()";
  }
  if (schema?.type === "number") {
    return "v.number()";
  }
  if (schema?.type === "boolean") {
    return "v.boolean()";
  }
  if (schema?.type === "date") {
    return "v.date()";
  }

  // Handle arrays
  if (schema?.type === "array") {
    const elementType = generateValiSchemaString(schema.element);
    // For arrays with unknown elements, generate v.array() without element type
    if (elementType === "v.unknown()") {
      return `v.array().nonempty("Please select at least one item")`;
    }
    return `v.array(${elementType})`;
  }

  // Handle objects
  if (schema?.type === "object") {
    const shape = schema.entries || {};
    const shapeStrs = Object.entries(shape).map(([key, value]) => {
      // Quote keys that need it (contain spaces or start with number)
      const needsQuotes = /\s/.test(key) || /^\d/.test(key);
      const quotedKey = needsQuotes ? `"${key}"` : key;
      return `${quotedKey}: ${generateValiSchemaString(value)}`;
    });
    return `v.object({\n  ${shapeStrs.join(",\n  ")}\n})`;
  }

  // Try to detect schema type by checking for specific properties
  if (schema && typeof schema === "object") {
    // Check if it's a string schema
    if ("minLength" in schema || "maxLength" in schema || "regex" in schema) {
      return "v.string()";
    }

    // Check if it's a number schema
    if ("minimum" in schema || "maximum" in schema || "multipleOf" in schema) {
      return "v.number()";
    }

    // Check if it's an email schema
    if ("format" in schema && schema.format === "email") {
      return "v.pipe(v.string(), v.email())";
    }

    // Check if it's a boolean schema
    if ("type" in schema && schema.type === "boolean") {
      return "v.boolean()";
    }
  }

  return "v.unknown()";
};
// Direct schema string generation approach (similar to Arktype)
export const getValiSchemaStringDirect = (
  formElements: (FormElement | FormArray)[],
): string => {
  const processElements = (elements: (FormElement | FormArray)[]): string[] => {
    return elements
      .filter((element) => {
        if (isFormArray(element)) return true;
        return !isStatic(element.fieldType);
      })
      .map((element) => {
        if (isFormArray(element)) {
          // Handle FormArray
          // Use the template arrayField for schema generation
          const actualFields = element.arrayField;
          const arrayFieldSchemas = processElements(
            actualFields as FormElement[],
          );
          const arrayObjectSchema = `v.object({\n${arrayFieldSchemas.join(",\n")}\n  })`;
          let typeDefinition = `v.array(${arrayObjectSchema})`;

          // Handle optional FormArray
          if (!("required" in element) || element.required !== true) {
            typeDefinition = `v.optional(${typeDefinition})`;
          }

          // Quote keys that need it (contain spaces or start with number)
          const needsQuotes =
            /\s/.test(element.name) || /^\d/.test(element.name);
          const quotedKey = needsQuotes ? `"${element.name}"` : element.name;
          return `  ${quotedKey}: ${typeDefinition}`;
        }

        // Handle regular FormElement
        let typeDefinition: string;

        switch (element.fieldType) {
          case "Input":
          case "Password":
            if (element.type === "email") {
              typeDefinition = "v.pipe(v.string(), v.email())";
            } else if (element.type === "number") {
              typeDefinition =
                "v.pipe(v.string(), v.transform(Number), v.number())";
            } else {
              typeDefinition = "v.string()";
            }
            break;

          case "OTP":
            typeDefinition = `v.pipe(v.string(), v.minLength(${element.maxLength || 6}, "OTP must be at least ${element.maxLength || 6} characters"))`;
            break;

          case "DatePicker":
            typeDefinition =
              "v.pipe(v.string(), v.transform((value) => new Date(value)), v.date())";
            break;

          case "Checkbox":
            typeDefinition = "v.optional(v.boolean(), true)";
            break;

          case "Slider": {
            let sliderSchema =
              "v.pipe(v.string(), v.transform(Number), v.number())";
            if (element.min !== undefined) {
              sliderSchema = `v.pipe(${sliderSchema}, v.minValue(${element.min}, "Must be at least ${element.min}"))`;
            }
            if (element.max !== undefined) {
              sliderSchema = `v.pipe(${sliderSchema}, v.maxValue(${element.max}, "Must be at most ${element.max}"))`;
            }
            typeDefinition = sliderSchema;
            break;
          }

          case "Switch":
            typeDefinition = "v.boolean()";
            break;

          case "Select":
            typeDefinition =
              'v.pipe(v.string(), v.minLength(1, "Please select an item"))';
            break;

          case "ToggleGroup":
            if (element.type === "single") {
              typeDefinition =
                'v.pipe(v.string(), v.minLength(1, "Please select an item"))';
            } else {
              typeDefinition =
                'v.pipe(v.array(v.unknown()), v.minLength(1, "Please select at least one item"))';
            }
            break;

          case "MultiSelect":
            typeDefinition =
              'v.pipe(v.array(v.string()), v.minLength(1, "Please select at least one item"))';
            break;

          case "RadioGroup":
            typeDefinition =
              'v.pipe(v.string(), v.minLength(1, "Please select an item"))';
            break;

          case "Textarea":
            typeDefinition =
              'v.pipe(v.string(), v.nonEmpty("This Field is Required"), v.minLength(10, "Minimum Value Should be 10"))';
            break;

          default:
            typeDefinition = "v.string()";
        }

        // Handle optional fields
        if (!("required" in element) || element.required !== true) {
          typeDefinition = `v.optional(${typeDefinition})`;
        }

        // Strip prefix from field name
        const fieldName = element.name.split(".").pop() || element.name;

        // Quote keys that need it (contain spaces or start with number)
        const needsQuotes = /\s/.test(fieldName) || /^\d/.test(fieldName);
        const quotedKey = needsQuotes ? `"${fieldName}"` : fieldName;
        return `  ${quotedKey}: ${typeDefinition}`;
      });
  };

  const schemaEntries = processElements(formElements).join(",\n");

  return `import * as v from "valibot"

export const formSchema = v.object({
${schemaEntries}
});`;
};

// Keep the original function for now but use the direct approach
export const getValiSchemaString = (
  formElements: (FormElement | FormArray)[],
): string => {
  return getValiSchemaStringDirect(formElements);
};
