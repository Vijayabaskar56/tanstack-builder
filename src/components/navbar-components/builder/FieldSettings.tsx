/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
//FieldSettings.tsx

import { Plus, Settings, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import type { ChoiceField, Field, Option } from "./types";

interface FieldSettingsProps {
	field?: Field;
	onUpdateField: (id: string, updates: Partial<Field>) => void;
}

export function FieldSettings({ field, onUpdateField }: FieldSettingsProps) {
	const [activeTab, setActiveTab] = useState("general");

	if (!field) {
		return (
			<div className="h-full flex flex-col">
				<div className="p-4 border-b">
					<h2 className="text-lg font-semibold">Field Settings</h2>
				</div>
				<div className="flex-1 flex items-center justify-center">
					<div className="text-center">
						<Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-medium mb-2">No field selected</h3>
						<p className="text-sm text-muted-foreground">
							Select a field from the form to customize its properties
						</p>
					</div>
				</div>
			</div>
		);
	}

	const handleUpdate = (updates: Partial<Field>) => {
		onUpdateField(field.id, updates);
	};

	const handleOptionAdd = () => {
		if (field.type === "radio" || field.type === "select") {
			const newOption: Option = {
				id: `option_${Date.now()}`,
				label: `Option ${(field as ChoiceField).options?.length || 0 + 1}`,
				value: `option${(field as ChoiceField).options?.length || 0 + 1}`,
			};
			handleUpdate({
				options: [...((field as ChoiceField).options || []), newOption],
			});
		}
	};

	const handleOptionUpdate = (optionId: string, updates: Partial<Option>) => {
		if (field.type === "radio" || field.type === "select") {
			const updatedOptions = (field as ChoiceField).options?.map((option) =>
				option.id === optionId ? { ...option, ...updates } : option,
			);
			handleUpdate({ options: updatedOptions });
		}
	};

	const handleOptionDelete = (optionId: string) => {
		if (field.type === "radio" || field.type === "select") {
			const updatedOptions = (field as ChoiceField).options?.filter(
				(option) => option.id !== optionId,
			);
			handleUpdate({ options: updatedOptions });
		}
	};

	return (
		<div className="h-full flex flex-col">
			{/* Header */}
			<div className="p-4 border-b">
				<h2 className="text-lg font-semibold">Field Settings</h2>
				<p className="text-sm text-muted-foreground capitalize">
					{field.type} field
				</p>
			</div>

			{/* Settings Content */}
			<div className="flex-1 overflow-y-auto">
				<Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
					<div className="p-4 border-b">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="general">General</TabsTrigger>
							<TabsTrigger value="validation">Validation</TabsTrigger>
							<TabsTrigger value="appearance">Appearance</TabsTrigger>
						</TabsList>
					</div>

					<div className="p-4">
						<TabsContent value="general" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle className="text-base">Basic Properties</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="label">Label</Label>
										<Input
											id="label"
											value={field.label}
											onChange={(e) => handleUpdate({ label: e.target.value })}
											placeholder="Enter field label"
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="name">Field Name</Label>
										<Input
											id="name"
											value={field.name}
											onChange={(e) => handleUpdate({ name: e.target.value })}
											placeholder="Enter field name"
										/>
									</div>

									{/* Options for radio/select fields */}
									{(field.type === "radio" || field.type === "select") && (
										<div className="space-y-3">
											<div className="flex items-center justify-between">
												<Label>Options</Label>
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={handleOptionAdd}
												>
													<Plus className="h-3 w-3 mr-1" />
													Add Option
												</Button>
											</div>
											<div className="space-y-2">
												{(field as ChoiceField).options?.map(
													(option: Option, index: number) => (
														<div
															key={option.id}
															className="flex items-center space-x-2"
														>
															<Input
																value={option.label}
																onChange={(e) =>
																	handleOptionUpdate(option.id, {
																		label: e.target.value,
																	})
																}
																placeholder={`Option ${index + 1}`}
																className="flex-1"
															/>
															<Input
																value={option.value}
																onChange={(e) =>
																	handleOptionUpdate(option.id, {
																		value: e.target.value,
																	})
																}
																placeholder="value"
																className="w-20"
															/>
															<Button
																type="button"
																variant="ghost"
																size="sm"
																onClick={() => handleOptionDelete(option.id)}
															>
																<X className="h-3 w-3" />
															</Button>
														</div>
													),
												)}
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="validation" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle className="text-base">Validation Rules</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center space-x-2">
										<Checkbox
											id="required"
											checked={field.validation?.required}
											onCheckedChange={(checked) =>
												handleUpdate({
													validation: {
														...field.validation,
														required: checked as boolean,
													},
												})
											}
										/>
										<Label htmlFor="required">Required field</Label>
									</div>

									{(field.type === "text" ||
										field.type === "email" ||
										field.type === "textarea") && (
										<>
											<div className="space-y-2">
												<Label htmlFor="minLength">Minimum Length</Label>
												<Input
													id="minLength"
													type="number"
													value={field.validation?.minLength || ""}
													onChange={(e) =>
														handleUpdate({
															validation: {
																...field.validation,
																minLength: e.target.value
																	? Number.parseInt(e.target.value)
																	: undefined,
															},
														})
													}
													placeholder="No minimum"
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="maxLength">Maximum Length</Label>
												<Input
													id="maxLength"
													type="number"
													value={field.validation?.maxLength || ""}
													onChange={(e) =>
														handleUpdate({
															validation: {
																...field.validation,
																maxLength: e.target.value
																	? Number.parseInt(e.target.value)
																	: undefined,
															},
														})
													}
													placeholder="No maximum"
												/>
											</div>
										</>
									)}

									{field.type === "number" && (
										<>
											<div className="space-y-2">
												<Label htmlFor="min">Minimum Value</Label>
												<Input
													id="min"
													type="number"
													value={field.validation?.min || ""}
													onChange={(e) =>
														handleUpdate({
															validation: {
																...field.validation,
																min: e.target.value
																	? Number.parseInt(e.target.value)
																	: undefined,
															},
														})
													}
													placeholder="No minimum"
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="max">Maximum Value</Label>
												<Input
													id="max"
													type="number"
													value={field.validation?.max || ""}
													onChange={(e) =>
														handleUpdate({
															validation: {
																...field.validation,
																max: e.target.value
																	? Number.parseInt(e.target.value)
																	: undefined,
															},
														})
													}
													placeholder="No maximum"
												/>
											</div>
										</>
									)}

									{(field.type === "text" || field.type === "email") && (
										<div className="space-y-2">
											<Label htmlFor="pattern">Pattern (Regex)</Label>
											<Input
												id="pattern"
												value={field.validation?.pattern || ""}
												onChange={(e) =>
													handleUpdate({
														validation: {
															...field.validation,
															pattern: e.target.value,
														},
													})
												}
												placeholder="Custom validation pattern"
											/>
										</div>
									)}
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="appearance" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle className="text-base">Appearance</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="placeholder">Placeholder Text</Label>
										<Input
											id="placeholder"
											value={field.appearance?.placeholder || ""}
											onChange={(e) =>
												handleUpdate({
													appearance: {
														...field.appearance,
														placeholder: e.target.value,
													},
												})
											}
											placeholder="Enter placeholder text"
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="helpText">Help Text</Label>
										<Input
											id="helpText"
											value={field.appearance?.helpText || ""}
											onChange={(e) =>
												handleUpdate({
													appearance: {
														...field.appearance,
														helpText: e.target.value,
													},
												})
											}
											placeholder="Enter help text"
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="width">Field Width</Label>
										<select
											id="width"
											value={field.appearance?.width || "full"}
											onChange={(e) =>
												handleUpdate({
													appearance: {
														...field.appearance,
														width: e.target.value as
															| "auto"
															| "full"
															| "1/2"
															| "1/3",
													},
												})
											}
											className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
										>
											<option value="auto">Auto</option>
											<option value="1/3">One Third</option>
											<option value="1/2">Half</option>
											<option value="full">Full Width</option>
										</select>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</div>
				</Tabs>
			</div>
		</div>
	);
}
