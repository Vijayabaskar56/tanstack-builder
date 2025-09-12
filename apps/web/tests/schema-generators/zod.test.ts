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
		expect(schemaString).toContain("z.string().min(1");
		expect(schemaString).toContain("z.email()");
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
		expect(schemaString).toContain("z.string().min(1");
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
