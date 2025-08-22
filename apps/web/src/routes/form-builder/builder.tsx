import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FormBuilder } from "@/components/builder/form-builder";
import { Canvas } from "../../components/builder/Canvas";
import { FieldLibrary } from "../../components/builder/FieldLibrary";
import {
	type BuilderState,
	createDefaultField,
	type Field,
	type FieldType,
} from "../../components/builder/types";

export const Route = createFileRoute("/form-builder/builder")({
	component: BuilderComponent,
});

function BuilderComponent() {
	const [state, setState] = useState<BuilderState>({
		fields: [],
		selectedId: undefined,
	});

	const handleAddField = (type: FieldType) => {
		const id = `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
		const newField = createDefaultField(type, id);
		setState((prev) => ({
			...prev,
			fields: [...prev.fields, newField],
			selectedId: id,
		}));
	};

	const handleSelectField = (id: string) => {
		setState((prev) => ({ ...prev, selectedId: id }));
	};

	const handleUpdateField = (id: string, updates: Partial<Field>) => {
		setState((prev) => ({
			...prev,
			fields: prev.fields.map((field) =>
				field.id === id ? { ...field, ...updates } : field,
			),
		}));
	};

	const handleDeleteField = (id: string) => {
		setState((prev) => ({
			...prev,
			fields: prev.fields.filter((field) => field.id !== id),
			selectedId: prev.selectedId === id ? undefined : prev.selectedId,
		}));
	};

	const handleMoveField = (id: string, direction: "up" | "down") => {
		setState((prev) => {
			const index = prev.fields.findIndex((field) => field.id === id);
			if (index === -1) return prev;

			const newIndex = direction === "up" ? index - 1 : index + 1;
			if (newIndex < 0 || newIndex >= prev.fields.length) return prev;

			const newFields = [...prev.fields];
			const [movedField] = newFields.splice(index, 1);
			newFields.splice(newIndex, 0, movedField);

			return { ...prev, fields: newFields };
		});
	};

	const handleDuplicateField = (id: string) => {
		const field = state.fields.find((f) => f.id === id);
		if (!field) return;

		const newId = `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
		const duplicatedField = {
			...field,
			id: newId,
			name: `${field.name}-copy`,
			label: `${field.label} (Copy)`,
		};

		setState((prev) => ({
			...prev,
			fields: [...prev.fields, duplicatedField],
			selectedId: newId,
		}));
	};

	return (
		<main className=" h-[calc(100vh-8rem)] flex overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
			<div className="border-r bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<FieldLibrary onAddField={handleAddField} />
			</div>
			{/* Center Canvas */}
			<div className="flex-1  bg-gradient-to-br from-background via-background to-muted/10">
				<FormBuilder />
			</div>
		</main>
	);
}
