import { describe, expect, it } from 'vitest';
import { extractImportDependencies } from '../../../src/lib/form-code-generators/react/generate-imports';

describe('extractImportDependencies', () => {
	it('should extract registry dependencies and dependencies correctly', () => {
		const importSet = new Set([
			'import { FieldDescription, FieldLegend } from "@/components/ui/field"',
			'import { Button } from "@/components/ui/button"',
			'import { toast } from "sonner"',
			'import { format } from "date-fns"',
			'import { useForm } from "@tanstack-form/react"',
			'import { Calendar as CalendarIcon } from "lucide-react"',
		]);

		const result = extractImportDependencies(importSet);

		expect(result.registryDependencies).toEqual(['field', 'button']);
		expect(result.dependencies).toEqual(['sonner', 'date-fns', '@tanstack-form/react','lucide-react',]);
	});

	it('should handle empty import set', () => {
		const importSet = new Set<string>();

		const result = extractImportDependencies(importSet);

		expect(result.registryDependencies).toEqual([]);
		expect(result.dependencies).toEqual([]);
	});

	it('should handle imports without from clause', () => {
		const importSet = new Set([
			'import React from "react"',
			'import { useState } from "react"',
		]);

		const result = extractImportDependencies(importSet);

		expect(result.registryDependencies).toEqual([]);
		expect(result.dependencies).toEqual(['react']);
	});
});