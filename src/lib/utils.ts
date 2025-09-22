import { type ClassValue, clsx } from "clsx";
import js_beautify from "js-beautify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isStatic = (fieldType: string) => {
  return ["Separator", "H1", "H2", "H3", "P"].includes(fieldType);
};

export function formatCode(code: string): string {
  // Split code into lines
  const lines = code.split("\n");
  const importLines: string[] = [];
  const nonImportLines: string[] = [];

  // Separate imports from other code
  let currentImport = "";
  let inImport = false;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Check if line starts an import
    if (trimmedLine.startsWith("import ") && trimmedLine.includes("{")) {
      inImport = true;
      currentImport = trimmedLine;

      // If import is complete on one line
      if (trimmedLine.includes("}") && trimmedLine.includes("from")) {
        // Clean up single-line import
        const cleanImport = currentImport.replace(/\s+/g, " ").trim();
        importLines.push(cleanImport);
        currentImport = "";
        inImport = false;
      }
    } else if (inImport) {
      // Continue building multi-line import
      currentImport += ` ${trimmedLine}`;

      // Check if import is complete
      if (trimmedLine.includes("}") && currentImport.includes("from")) {
        // Clean up multi-line import to single line
        const cleanImport = currentImport
          .replace(/\s*\n\s*/g, " ")
          .replace(/\s+/g, " ")
          .replace(/\{\s+/g, "{ ")
          .replace(/\s+\}/g, " }")
          .trim();
        importLines.push(cleanImport);
        currentImport = "";
        inImport = false;
      }
    } else if (trimmedLine.startsWith("import ")) {
      // Handle other types of imports (default imports, etc.)
      importLines.push(trimmedLine);
    } else if (/^["']use (client|server)["']/.test(trimmedLine)) {
      // Handle use client directive
      importLines.push(trimmedLine);
    } else {
      // Regular code line
      nonImportLines.push(line);
    }
  }

  // Format only the non-import code with js_beautify
  const nonImportCode = nonImportLines.join("\n");
  const formattedNonImportCode = js_beautify(nonImportCode, {
    indent_size: 2,
    indent_char: " ",
    max_preserve_newlines: 1,
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    brace_style: "collapse",
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: false,
    end_with_newline: false,
    wrap_line_length: 0,
    comma_first: false,
    e4x: true,
    indent_empty_lines: false,
  });

  // Combine imports and formatted code
  const result = [...importLines, "", ...formattedNonImportCode.split("\n")]
    .filter((line, index, arr) => {
      // Remove excessive empty lines
      if (line.trim() === "") {
        return index === 0 || arr[index - 1]?.trim() !== "";
      }
      return true;
    })
    .join("\n");

  return result;
}
