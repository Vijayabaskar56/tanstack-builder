import { describe, expect, it } from "vitest";
import { getValiSchemaString } from "@/lib/schema-generators/generate-valibot-schema";

describe("Valibot Schema Generator - FormArray Support", () => {
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

		const schemaString = getValiSchemaString(formElements as any);

		expect(schemaString).toContain("users");
		expect(schemaString).toContain("v.array");
		expect(schemaString).toContain("v.object");
		expect(schemaString).toContain("v.string()");
		expect(schemaString).toContain(
			'v.pipe(v.string(), v.minLength(1, "This field is required"), v.email())',
		);
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

		const schemaString = getValiSchemaString(formElements as any);

		expect(schemaString).toContain("items");
		expect(schemaString).toContain("v.array");
		expect(schemaString).toContain("v.optional(v.boolean())");
		expect(schemaString).toContain("v.pipe(v.string(), v.minLength(1");
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

		const schemaString = getValiSchemaString(formElements as any);

		expect(schemaString).toContain("title");
		expect(schemaString).toContain("users");
		expect(schemaString).toContain("v.array");
		expect(schemaString).toContain("v.object");
	});

	it("should handle Password field type", () => {
		const formElements = [
			{
				fieldType: "Password" as const,
				id: "password",
				name: "password",
				label: "Password",
				required: true,
				type: "password",
			},
		];

		const schemaString = getValiSchemaString(formElements as any);

		expect(schemaString).toContain("password");
		expect(schemaString).toContain("v.string()");
	});

	it("should handle Slider field type with min/max validation", () => {
		const formElements = [
			{
				fieldType: "Slider" as const,
				id: "volume",
				name: "volume",
				label: "Volume",
				required: true,
				min: 0,
				max: 100,
			},
		];

		const schemaString = getValiSchemaString(formElements as any);

		expect(schemaString).toContain("volume");
		expect(schemaString).toContain(
			"v.pipe(v.string(), v.transform(Number), v.number())",
		);
		expect(schemaString).toContain("Must be at least 0");
		expect(schemaString).toContain("Must be at most 100");
	});

	it("should handle Switch field type", () => {
		const formElements = [
			{
				fieldType: "Switch" as const,
				id: "notifications",
				name: "notifications",
				label: "Enable Notifications",
				required: true,
			},
		];

		const schemaString = getValiSchemaString(formElements as any);

		expect(schemaString).toContain("notifications");
		expect(schemaString).toContain("v.boolean()");
	});
});

describe("Valibot Schema Generator - Multi-Step Form Support", () => {
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

		const schemaString = getValiSchemaString(formElements as any);

		expect(schemaString).toContain("export const formSchema = v.object");
		expect(schemaString).toContain("name:");
		expect(schemaString).toContain("email:");
		expect(schemaString).not.toContain("formSchemaSteps");
	});

	it("should generate both formSchema and formSchemaSteps for multi-step forms", () => {
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

		const schemaString = getValiSchemaString(
			formElements as any,
			true, // isMultiStep
		);

		expect(schemaString).toContain("export const formSchema = v.object");
		expect(schemaString).toContain("export const formSchemaSteps = [");
		expect(schemaString).toContain("// Step 1");
		expect(schemaString).toContain("// Step 2");
		expect(schemaString).toContain("v.pick(formSchema");
		expect(schemaString).toContain("name: true");
		expect(schemaString).toContain("email: true");
	});
});
