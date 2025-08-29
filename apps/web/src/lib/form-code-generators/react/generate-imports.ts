import type { FormElement } from '@/form-types';
import { useFormStore } from '@/hooks/use-form-store';

export const generateImports = (formElements: FormElement[]): Set<string> => {
  const importSet = new Set([
    "import { formSchema } from '../form-schema'",
    'import { Button } from "@/components/ui/button"',
    'import { useAppForm } from "@/components/ui/tanstack-form"',
    'import { useStore , revalidateLogic } from "@tanstack/react-form"',
    'import { useCallback } from "react"',
    'import { toast } from "sonner"'
  ]);
  const processField = (field: FormElement) => {
    const { validationSchema } = useFormStore();
    switch (field.fieldType) {
      case 'DatePicker':
        importSet.add('import { format } from "date-fns"');
        importSet.add(
          'import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"',
        );
        importSet.add('import { cn } from "@/lib/utils"');
        importSet.add('import { Calendar } from "@/components/ui/calendar"');
        importSet.add(
          'import { Calendar as CalendarIcon } from "lucide-react"',
        );
        break;
      case 'OTP':
        importSet.add(
          'import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot\n} from "@/components/ui/input-otp"',
        );
        break;
      case 'Select':
        importSet.add(
          'import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"',
        );
        break;
      case 'MultiSelect':
        importSet.add(
          `import {
              MultiSelect,
              MultiSelectContent,
              MultiSelectItem,
              MultiSelectList,
              MultiSelectTrigger,
              MultiSelectValue,
            } from '@/components/ui/multi-select'`,
        );
        importSet.add(
          "\n // IMPORTANT: multi-select is not a shadcn component, so you need to copy it from the souce code and install dependencies. GitHub: https://github.com/Ali-Hussein-dev/formcn/blob/main/apps/web/src/components/ui/multi-select.tsx",
        );
        break;
      case 'Password':
        importSet.add("import { Input } from '@/components/ui/input'");
        break;
      case 'RadioGroup':
        importSet.add(
          "import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'",
        );
        break;
      case 'ToggleGroup':
        importSet.add(
          "import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'",
        );
        break;
      case 'H1':
      case 'H2':
      case 'H3':
      case 'P':
        break;
      default:
        importSet.add(
          `import { ${field.fieldType} } from "@/components/ui/${field.fieldType.toLowerCase()}"`,
        );
        break;
    }

    if (validationSchema === 'zod') {
      importSet.add('import * as z from "zod"');
    } else if (validationSchema === 'valibot') {
      importSet.add('import { valibotSchema } from "valibot"');
    } else if (validationSchema === 'arktype') {
      importSet.add('import { type } from "arktype"');
    }
  };

  formElements.flat().forEach(processField);

  return importSet;
};
