// Export Pannel
import { Check, Code, Copy, Download, Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { Field, Option } from "./types";

interface ExportPanelProps {
  fields: Field[];
  onImport: (fields: Field[]) => void;
}

export function ExportPanel({ fields, onImport }: ExportPanelProps) {
  const [copied, setCopied] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const exportJSON = () => {
    const data = JSON.stringify(fields, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "form-builder-export.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedFields = JSON.parse(content) as Field[];

        // Basic validation
        if (!Array.isArray(importedFields)) {
          throw new Error("Invalid format: expected an array of fields");
        }

        onImport(importedFields);
        setImportError(null);
      } catch (error) {
        setImportError("Invalid JSON file or format");
        console.error("Import error:", error);
      }
    };
    reader.readAsText(file);
  };

  const generateInstallCommand = () => {
    const fieldTypes = [...new Set(fields.map((f) => f.type))];
    const commands = [
      "npm install @tanstack/react-form",
      ...fieldTypes
        .map((type) => {
          switch (type) {
            case "checkbox":
            case "radio":
            case "switch":
              return "npm install @radix-ui/react-checkbox @radix-ui/react-radio-group @radix-ui/react-switch";
            case "select":
              return "npm install @radix-ui/react-select";
            case "slider":
              return "npm install @radix-ui/react-slider";
            case "date":
              return "npm install react-datepicker";
            case "file":
              return "npm install react-dropzone";
            default:
              return null;
          }
        })
        .filter(Boolean),
    ];

    return [...new Set(commands)].join("\n");
  };

  const copyInstallCommand = async () => {
    const command = generateInstallCommand();
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const generateFormCode = () => {
    if (fields.length === 0) return "// No fields to generate code for";

    const fieldComponents = fields
      .map((field) => {
        const baseProps = `name="${field.name}"`;
        const label = field.label ? `label="${field.label}"` : "";
        const placeholder = field.appearance?.placeholder
          ? `placeholder="${field.appearance.placeholder}"`
          : "";
        const required = field.validation?.required ? "required" : "";
        const helpText = field.appearance?.helpText
          ? `helpText="${field.appearance.helpText}"`
          : "";

        switch (field.type) {
          case "text":
          case "email":
          case "number":
          case "password":
            return `  <Input ${baseProps} type="${field.type}" ${label} ${placeholder} ${required} ${helpText} />`;
          case "textarea":
            return `  <Textarea ${baseProps} ${label} ${placeholder} ${required} ${helpText} />`;
          case "checkbox":
            return `  <Checkbox ${baseProps} ${label} ${required} />`;
          case "radio": {
            const radioField = field as Field & { options: Option[] };
            const options =
              radioField.options
                ?.map(
                  (opt: Option) =>
                    `    { label: "${opt.label}", value: "${opt.value}" }`,
                )
                .join(",\n") || "";
            return `  <RadioGroup ${baseProps} ${label} ${required}>\n    options={[\n${options}\n    ]}\n  />`;
          }
          case "select": {
            const selectField = field as Field & { options: Option[] };
            const selectOptions =
              selectField.options
                ?.map(
                  (opt: Option) =>
                    `    { label: "${opt.label}", value: "${opt.value}" }`,
                )
                .join(",\n") || "";
            return `  <Select ${baseProps} ${label} ${required}>\n    options={[\n${selectOptions}\n    ]}\n  />`;
          }
          case "switch":
            return `  <Switch ${baseProps} ${label} ${required} />`;
          case "slider":
            return `  <Slider ${baseProps} ${label} min={${field.validation?.min || 0}} max={${field.validation?.max || 100}} />`;
          case "date":
            return `  <DatePicker ${baseProps} ${label} ${required} />`;
          case "file":
            return `  <FileUpload ${baseProps} ${label} ${required} />`;
          default:
            return `  <Input ${baseProps} ${label} ${placeholder} ${required} ${helpText} />`;
        }
      })
      .join("\n");

		return `import { useForm } from '@tanstack/react-form'

export function GeneratedForm() {
  const form = useForm({
    defaultValues: {
${fields.map((f) => `      ${f.name}: ''`).join(",\n")}
    },
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value)
    },
  })

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      e.stopPropagation()
      form.handleSubmit()
    }}>
${fieldComponents}
      <Button type="submit">Submit</Button>
    </form>
  )
}`;
  };

  const copyFormCode = async () => {
    const code = generateFormCode();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Export & Import</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Button onClick={exportJSON} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={importJSON}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import JSON
              </Button>
            </div>
          </div>
          {importError && <p className="text-sm text-red-500">{importError}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Install Dependencies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-muted p-3 rounded-md text-sm font-mono">
            {generateInstallCommand()}
          </div>
          <Button
            onClick={copyInstallCommand}
            variant="outline"
            size="sm"
            className="w-full"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Install Command
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Generated Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-muted p-3 rounded-md text-sm font-mono max-h-40 overflow-y-auto">
            <pre className="whitespace-pre-wrap">{generateFormCode()}</pre>
          </div>
          <Button
            onClick={copyFormCode}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Code className="h-4 w-4 mr-2" />
            Copy Code
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
