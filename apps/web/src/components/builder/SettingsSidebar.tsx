import { Eye, Hash, Shield } from "lucide-react";
import { useId } from "react";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAppForm } from "@/components/ui/tanstack-form";
import { settingsCollection } from "@/db-collections";
import useSettings from "@/hooks/use-settings";

// Zod schema for settings validation
const settingsSchema = z.object({
	defaultRequiredValidation: z.boolean(),
	numericInput: z.boolean(),
	focusOnError: z.boolean(),
	validationMethod: z.enum(["onChange", "onBlue", "onDynamic"]),
	asyncValidation: z.number().min(0).max(10000),
	preferredSchema: z.enum(["zod", "valibot", "arktype"]),
	preferredFramework: z.enum(["react", "vue", "angular", "solid"]),
});

export function SettingsSidebar() {
	const requiredValidationId = useId();
	const numericInputId = useId();
	const focusOnErrorId = useId();
	const validationMethodId = useId();
	const asyncValidationId = useId();
	const preferredSchemaId = useId();
	const preferredFrameworkId = useId();
	const data = useSettings();
	const form = useAppForm({
		defaultValues: {
			defaultRequiredValidation: data?.defaultRequiredValidation,
			numericInput: data?.numericInput,
			focusOnError: data?.focusOnError,
			validationMethod: data?.validationMethod,
			asyncValidation: data?.asyncValidation,
			preferredSchema: data?.preferredSchema,
			preferredFramework: data?.preferredFramework,
		} as z.input<typeof settingsSchema>,
		validators: {
			onChange: settingsSchema,
		},
		listeners: {
			onChangeDebounceMs: 1000,
			onChange: ({ formApi }) => {
				settingsCollection.update("user-settings", (draft) => {
					draft.defaultRequiredValidation =
						formApi.baseStore.state.values.defaultRequiredValidation;
					draft.numericInput = formApi.baseStore.state.values.numericInput;
					draft.focusOnError = formApi.baseStore.state.values.focusOnError;
					draft.validationMethod =
						formApi.baseStore.state.values.validationMethod;
					draft.asyncValidation =
						formApi.baseStore.state.values.asyncValidation;
					draft.preferredSchema =
						formApi.baseStore.state.values.preferredSchema;
					draft.preferredFramework =
						formApi.baseStore.state.values.preferredFramework;
				});

				//  actions.setSettings(formApi.baseStore.state.values)
			},
		},
	});

	return (
		<div className="flex flex-col h-full md:h-full max-h-[35vh] md:max-h-none">
			<form.AppForm>
				<form
					noValidate
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						void form.handleSubmit();
					}}
				>
					<div className="mb-4 pb-2 px-4 border-b">
        <h3 className="text-lg font-semibold text-primary">
         Settings
        </h3>
        <p className="text-sm text-muted-foreground">
         Configure Your Form
        </p>
       </div>

					<ScrollArea className="flex-1 overflow-auto max-h-[calc(35vh-8rem)] md:max-h-none">
						<div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
							{/* Form Settings */}
							<div>
								<h3 className="text-xs font-medium text-muted-foreground mb-2 pl-3 sm:pl-4">
									Form Settings
								</h3>
								<div className="space-y-3">
									<form.AppField name="defaultRequiredValidation" mode="value">
										{(field) => (
											<div className="flex items-center justify-between p-3 border rounded-lg">
												<div className="flex items-center gap-2">
													<Shield className="w-4 h-4 text-muted-foreground" />
													<Label
														htmlFor={requiredValidationId}
														className="text-sm"
													>
														Default Required Validation
													</Label>
												</div>
												<Switch
													id={requiredValidationId}
													checked={field.state.value}
													onCheckedChange={field.handleChange}
												/>
											</div>
										)}
									</form.AppField>

									<form.AppField name="focusOnError" mode="value">
										{(field) => (
											<div className="flex items-center justify-between p-3 border rounded-lg">
												<div className="flex items-center gap-2">
													<Eye className="w-4 h-4 text-muted-foreground" />
													<Label htmlFor={focusOnErrorId} className="text-sm">
														Focus on Error Fields
													</Label>
												</div>
												<Switch
													id={focusOnErrorId}
													checked={field.state.value}
													onCheckedChange={field.handleChange}
												/>
											</div>
										)}
									</form.AppField>

									<form.AppField name="numericInput" mode="value">
										{(field) => (
											<div className="flex items-center justify-between p-3 border rounded-lg">
												<div className="flex items-center gap-2">
													<Hash className="w-4 h-4 text-muted-foreground" />
													<Label htmlFor={numericInputId} className="text-sm">
														Numeric Input Validation
													</Label>
												</div>
												<Switch
													disabled={true}
													id={numericInputId}
													checked={field.state.value}
													onCheckedChange={field.handleChange}
												/>
											</div>
										)}
									</form.AppField>

									<form.AppField name="validationMethod" mode="value">
										{(field) => (
											<div className="p-3 border rounded-lg">
												<Label
													htmlFor={validationMethodId}
													className="text-sm font-medium mb-2 block"
												>
													Validation Method
												</Label>
												<Select
													value={field.state.value}
													disabled={true}
													onValueChange={(value) =>
														field.handleChange(
															value as z.input<
																typeof settingsSchema
															>["validationMethod"],
														)
													}
												>
													<SelectTrigger id={validationMethodId}>
														<SelectValue placeholder="Select validation method" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="onBlue">On Blur</SelectItem>
														<SelectItem value="onChange">On Change</SelectItem>
														<SelectItem value="onDynamic">
															On Dynamic
														</SelectItem>
													</SelectContent>
												</Select>
												<field.FormMessage />
											</div>
										)}
									</form.AppField>

									<form.AppField name="asyncValidation" mode="value">
										{(field) => (
											<div className="p-3 border rounded-lg">
												<Label
													htmlFor={asyncValidationId}
													className="text-sm font-medium mb-2 block"
												>
													Async Validation Delay (ms)
												</Label>
												<Input
													id={asyncValidationId}
													disabled={true}
													type="number"
													min="0"
													max="10000"
													value={field.state.value}
													onChange={(e) =>
														field.handleChange(Number(e.target.value))
													}
													onBlur={field.handleBlur}
													placeholder="300"
												/>
												<field.FormMessage />
											</div>
										)}
									</form.AppField>

									<form.AppField name="preferredSchema" mode="value">
										{(field) => (
											<div className="p-3 border rounded-lg">
												<Label
													htmlFor={preferredSchemaId}
													className="text-sm font-medium mb-2 block"
												>
													Preferred Schema
												</Label>
												<Select
													value={field.state.value}
													onValueChange={(value) =>
														field.handleChange(
															value as z.input<
																typeof settingsSchema
															>["preferredSchema"],
														)
													}
												>
													<SelectTrigger id={preferredSchemaId}>
														<SelectValue placeholder="Select preferred schema" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="zod">Zod</SelectItem>
														<SelectItem value="valibot">Valibot</SelectItem>
														<SelectItem value="arktype">Arktype</SelectItem>
													</SelectContent>
												</Select>
												<field.FormMessage />
											</div>
										)}
									</form.AppField>

									<form.AppField name="preferredFramework" mode="value">
										{(field) => (
											<div className="p-3 border rounded-lg">
												<Label
													htmlFor={preferredFrameworkId}
													className="text-sm font-medium mb-2 block"
												>
													Preferred Framework
												</Label>
												<Select
													value={field.state.value}
													onValueChange={(value) =>
														field.handleChange(
															value as z.input<
																typeof settingsSchema
															>["preferredFramework"],
														)
													}
												>
													<SelectTrigger id={preferredFrameworkId}>
														<SelectValue placeholder="Select preferred framework" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="react">React</SelectItem>
														<SelectItem value="vue">Vue</SelectItem>
														<SelectItem value="angular">Angular</SelectItem>
														<SelectItem value="solid">Solid</SelectItem>
													</SelectContent>
												</Select>
												<field.FormMessage />
											</div>
										)}
									</form.AppField>
								</div>
							</div>
						</div>
					</ScrollArea>
				</form>
			</form.AppForm>
		</div>
	);
}
