import { describe, expect, it } from "vitest";
import { getZodSchemaString } from "@/lib/schema-generators/generate-zod-schema";

describe("Zod Schema Generator - FormArray Support", () => {
	it("should generate schema for a simple FormArray", () => {
		const formElements = [
			{
				fieldType: "FormArray" as const,
				id: "users-array",
				name: "users",
				label: "Users",
				arrayField: [
					{
						fieldType: "Input" as const,
						id: "name-field",
						name: "users[0].name",
						label: "Name",
						required: true,
						type: "text",
					},
					{
						fieldType: "Input" as const,
						id: "email-field",
						name: "users[0].email",
						label: "Email",
						required: true,
						type: "email",
					},
				],
				entries: [],
			},
		];

		const schemaString = getZodSchemaString(formElements as any);

		expect(schemaString).toContain("users");
		expect(schemaString).toContain("z.array");
		expect(schemaString).toContain("z.object");
		expect(schemaString).toContain("z.string()");
		expect(schemaString).toContain("z.string()");
	});

	it("should handle multiple field types in FormArray", () => {
		const formElements = [
			{
				fieldType: "FormArray" as const,
				id: "complex-array",
				name: "items",
				label: "Items",
				arrayField: [
					{
						fieldType: "Input" as const,
						id: "name",
						name: "items[0].name",
						label: "Name",
						required: true,
						type: "text",
					},
					{
						fieldType: "Checkbox" as const,
						id: "active",
						name: "items[0].active",
						label: "Active",
						required: false,
					},
					{
						fieldType: "Select" as const,
						id: "role",
						name: "items[0].role",
						label: "Role",
						required: true,
						placeholder: "Select role",
						options: [
							{ value: "admin", label: "Admin" },
							{ value: "user", label: "User" },
						],
					},
				],
				entries: [],
			},
		];

		const schemaString = getZodSchemaString(formElements as any);

		expect(schemaString).toContain("items");
		expect(schemaString).toContain("z.array");
		expect(schemaString).toContain("z.boolean()");
		expect(schemaString).toContain("z.string()");
	});

	it("should handle mixed form elements and FormArrays", () => {
		const formElements = [
			{
				fieldType: "Input" as const,
				id: "title",
				name: "title",
				label: "Title",
				required: true,
				type: "text",
			},
			{
				fieldType: "FormArray" as const,
				id: "users",
				name: "users",
				label: "Users",
				arrayField: [
					{
						fieldType: "Input" as const,
						id: "user-name",
						name: "users[0].name",
						label: "Name",
						required: true,
						type: "text",
					},
				],
				entries: [],
			},
		];

		const schemaString = getZodSchemaString(formElements as any);

		expect(schemaString).toContain("title");
		expect(schemaString).toContain("users");
		expect(schemaString).toContain("z.array");
		expect(schemaString).toContain("z.object");
	});
});

describe("Zod Schema Generator - Multi-Step Form Support", () => {
	it("should generate only formSchema for normal forms", () => {
		const formElements = [
			{
				fieldType: "Input" as const,
				id: "name",
				name: "name",
				label: "Name",
				required: true,
				type: "text",
			},
			{
				fieldType: "Input" as const,
				id: "email",
				name: "email",
				label: "Email",
				required: true,
				type: "email",
			},
		];

		const schemaString = getZodSchemaString(formElements as any);

		expect(schemaString).toContain("export const formSchema = z.object");
		expect(schemaString).toContain("name: z.string()");
		expect(schemaString).toContain("email: z.email()");
		expect(schemaString).not.toContain("stepSchemas");
	});
});
it("should generate both formSchema and stepSchemas for multi-step forms", () => {
	const formElements = [
		{
			id: "step1",
			stepFields: [
				{
					fieldType: "Input" as const,
					id: "name",
					name: "name",
					label: "Name",
					required: true,
					type: "text",
				},
			],
		},
		{
			id: "step2",
			stepFields: [
				{
					fieldType: "Input" as const,
					id: "email",
					name: "email",
					label: "Email",
					required: true,
					type: "email",
				},
			],
		},
	];

	const schemaString = getZodSchemaString(
		formElements as any,
		true, // isMultiStep
	);

	expect(schemaString).toContain("export const formSchema = z.object");
  expect(schemaString).toContain("export const formSchemaSteps = [");
	expect(schemaString).toContain("// Step 1");
	expect(schemaString).toContain("// Step 2");
	expect(schemaString).toContain("formSchema.pick");
	expect(schemaString).toContain("name: true");
	expect(schemaString).toContain("email: true");
});
