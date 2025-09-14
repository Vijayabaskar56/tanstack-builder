/** biome-ignore-all lint/correctness/noChildrenProp: Required for form field rendering */
// render-form-element.tsx
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import {
	MultiSelect,
	MultiSelectContent,
	MultiSelectItem,
	MultiSelectList,
	MultiSelectTrigger,
	MultiSelectValue,
} from "@/components/ui/multi-select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { FormElement } from "@/form-types";
import { cn } from "@/lib/utils";
import type { AppForm } from "../../hooks/use-form-builder";
export const RenderFormElement = ({
	formElement,
	form,
}: {
	formElement: FormElement;
	form: AppForm;
}): React.ReactElement => {
	switch (formElement.fieldType) {
		case "Input":
			return (
				<form.AppField
					name={formElement.name}
					children={(field) => (
						<field.FormItem className="w-full">
							<field.FormLabel>
								{formElement.label} {formElement.required ? " *" : ""}
							</field.FormLabel>
							<field.FormControl>
								<Input
         							placeholder={formElement.placeholder}
									disabled={formElement.disabled}
									type={formElement.type ?? "text"}
									name={formElement.name}
									value={(field.state.value as string | undefined) ?? ""}
									onChange={(e) => {
										field.handleChange(e.target.value);
									}}
									onBlur={field.handleBlur}
								/>
							</field.FormControl>
							<field.FormDescription>
								{formElement.description}
							</field.FormDescription>
							<field.FormMessage />
						</field.FormItem>
					)}
				/>
			);
		case "Password":
			return (
				<form.AppField
					name={formElement.name}
					children={(field) => (
						<field.FormItem className="w-full">
							<field.FormLabel>
								{formElement.label} {formElement.required && " *"}
							</field.FormLabel>
							<field.FormControl>
								<Input
									placeholder={formElement.placeholder}
									disabled={formElement.disabled}
									type={"password"}
									name={formElement.name}
									value={(field.state.value as string | undefined) ?? ""}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
								/>
							</field.FormControl>
							<field.FormDescription>
								{formElement.description}
							</field.FormDescription>
							<field.FormMessage />
						</field.FormItem>
					)}
				/>
			);
		case "OTP":
			return (
				<form.AppField
					name={formElement.name}
					children={(field) => (
						<field.FormItem className="w-full">
							<field.FormLabel>
								{formElement.label} {formElement.required && "*"}
							</field.FormLabel>
							<field.FormControl>
								<InputOTP
									maxLength={formElement.maxLength ?? 6}
									name={formElement.name}
									value={(field.state.value as string | undefined) ?? ""}
									onChange={field.handleChange}
									required={formElement.required}
								>
									<InputOTPGroup>
										<InputOTPSlot index={0} />
										<InputOTPSlot index={1} />
										<InputOTPSlot index={2} />
									</InputOTPGroup>
									<InputOTPSeparator />
									<InputOTPGroup>
										<InputOTPSlot index={3} />
										<InputOTPSlot index={4} />
										<InputOTPSlot index={5} />
									</InputOTPGroup>
								</InputOTP>
							</field.FormControl>
							<field.FormDescription>
								{formElement.description}
							</field.FormDescription>
							<field.FormMessage />
						</field.FormItem>
					)}
				/>
			);
		case "Textarea":
			return (
				<form.AppField
					name={formElement.name}
					children={(field) => (
						<field.FormItem className="w-full">
							<field.FormLabel>
								{formElement.label} {formElement.required && "*"}
							</field.FormLabel>
							<field.FormControl>
								<Textarea
						         placeholder={formElement.placeholder}
									required={formElement.required}
									disabled={formElement.disabled}
									value={(field.state.value as string | undefined) ?? ""}
									name={formElement.name}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
									className="resize-none"
								/>
							</field.FormControl>
							<field.FormDescription>
								{formElement.description}
							</field.FormDescription>
							<field.FormMessage />
						</field.FormItem>
					)}
				/>
			);
		case "Checkbox":
			return (
				<form.AppField
					name={formElement.name}
					children={(field) => (
						<field.FormItem className="flex items-start gap-2 w-full py-1 space-y-0">
							<field.FormControl>
								<Checkbox
          checked={Boolean(field.state.value)}
									onCheckedChange={field.handleChange}
								/>
							</field.FormControl>
							<div>
								<field.FormLabel className="space-y-1 leading-none">
									{formElement.label} {formElement.required && " *"}
								</field.FormLabel>
								{formElement.description ? (
									<field.FormDescription>
										{formElement.description}
									</field.FormDescription>
								) : null}
								<field.FormMessage />
							</div>
						</field.FormItem>
					)}
				/>
			);
		case "RadioGroup":
			return (
				<form.AppField
					name={formElement.name}
					children={(field) => (
						<field.FormItem className="flex flex-col gap-2 w-full py-1">
							<field.FormLabel className="mt-0">
								{formElement?.label} {formElement.required && " *"}
							</field.FormLabel>
							<field.FormControl>
								<RadioGroup
									onValueChange={field.handleChange}
									name={formElement.name}
									value={(field.state.value as string | undefined) ?? ""}
								>
									{formElement.options.map(({ label, value }) => (
										<div key={value} className="flex items-center gap-x-2">
											<RadioGroupItem value={value} id={value} required={formElement.required} />
											<Label htmlFor={value}>{label}</Label>
										</div>
									))}
								</RadioGroup>
							</field.FormControl>
							{formElement.description && (
								<field.FormDescription>
									{formElement.description}
								</field.FormDescription>
							)}
							<field.FormMessage />
						</field.FormItem>
					)}
				/>
			);
		case "ToggleGroup": {
			const options = formElement.options.map(({ label, value }) => (
				<ToggleGroupItem
					name={formElement.name}
					value={value}
					key={value}
					className="flex items-center gap-x-2 px-1"
				>
					{label}
				</ToggleGroupItem>
			));
			return (
				<form.AppField
					name={formElement.name}
					children={(field) => (
						<field.FormItem className="flex flex-col gap-2 w-full py-1">
							<field.FormLabel className="mt-0">
								{formElement?.label} {formElement.required && "*"}
							</field.FormLabel>
							<field.FormControl>
								{formElement.type === "single" ? (
									<ToggleGroup
										type="single"
										variant="outline"
										onValueChange={field.handleChange}
										defaultValue={formElement.defaultValue}
										className="flex justify-start items-center w-full"
									>
										{options}
									</ToggleGroup>
								) : (
									<ToggleGroup
										type="multiple"
										variant="outline"
										onValueChange={field.handleChange}
										defaultValue={
											Array.isArray(formElement.defaultValue)
												? formElement.defaultValue.filter(
														(val) => val !== undefined,
													)
												: [formElement.defaultValue].filter(
														(val) => val !== undefined,
													)
										}
										className="flex justify-start items-center w-full"
									>
										{options}
									</ToggleGroup>
								)}
							</field.FormControl>
							{formElement.description && (
								<field.FormDescription>
									{formElement.description}
								</field.FormDescription>
							)}
							<field.FormMessage />
						</field.FormItem>
					)}
				/>
			);
		}
		case "Switch":
			return (
				<form.AppField
					name={formElement.name}
					children={(field) => (
						<field.FormItem className="flex flex-col p-3 justify-center w-full border rounded">
							<div className="flex items-center justify-between h-full">
								<field.FormLabel className="w-full grow">
									{formElement.label}
								</field.FormLabel>
								<field.FormControl>
									<Switch
										name={formElement.name}
										checked={Boolean(field.state.value)}
										onCheckedChange={(checked) => {
											field.handleChange(checked);
											// Trigger validation by simulating blur
											field.handleBlur();
										}}
									/>
								</field.FormControl>
							</div>
							{formElement.description && (
								<field.FormDescription>
									{formElement.description}
								</field.FormDescription>
							)}
						</field.FormItem>
					)}
				/>
			);
		case "Slider":
			return (
				<form.AppField
					name={formElement.name}
					children={(field) => {
						const min = formElement.min || 0;
						const max = formElement.max || 100;
						const step = formElement.step || 1;
						const defaultSliderValue = formElement.defaultValue || min;
						const currentValue = field.state.value;
						const sliderValue = Array.isArray(currentValue)
							? currentValue
							: [currentValue || defaultSliderValue];

						return (
							<field.FormItem className="w-full">
								<field.FormLabel className="flex justify-between items-center">
									{formElement.label} {formElement.required ? " *" : ""}
									<span className="text-sm text-muted-foreground">
										{sliderValue[0] || min} / {max}
									</span>
								</field.FormLabel>
								<field.FormControl>
									<Slider
										name={formElement.name}
										min={min}
										max={max}
										step={step}
										value={sliderValue}
										onValueChange={(newValue) => {
											field.handleChange(newValue[0]);
											// Trigger validation by simulating blur
											field.handleBlur();
										}}
									/>
								</field.FormControl>
								<field.FormDescription className="py-1">
									{formElement.description}
								</field.FormDescription>
								<field.FormMessage />
							</field.FormItem>
						);
					}}
				/>
			);
		case "Select":
			return (
				<form.AppField
					name={formElement.name}
					children={(field) => (
						<field.FormItem className="w-full">
							<field.FormLabel>
								{formElement.label} {formElement.required && " *"}
							</field.FormLabel>
							<Select
								name={formElement.name}
								value={(field.state.value as string | undefined) ?? ""}
								onValueChange={field.handleChange}
								defaultValue={String(field?.state.value ?? "")}
							>
								<field.FormControl>
									<SelectTrigger className="w-full">
										<SelectValue
											placeholder={formElement.placeholder || "Select item"}
										/>
									</SelectTrigger>
								</field.FormControl>
								<SelectContent>
									{formElement.options.map(({ label, value }) => (
										<SelectItem key={value} value={value}>
											{label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<field.FormDescription>
								{formElement.description}
							</field.FormDescription>
							<field.FormMessage />
						</field.FormItem>
					)}
				/>
			);
		case "MultiSelect":
			return (
				<form.AppField
					name={formElement.name}
					children={(field) => (
						<>
						<field.FormItem className="w-full">
							<field.FormLabel>
								{formElement.label} {formElement.required ? " *" : ""}
							</field.FormLabel>
							<MultiSelect
								// value={field.state.value as string[]}
								onValueChange={field.handleChange}
							>
								<field.FormControl>
									<MultiSelectTrigger>
										<MultiSelectValue
											placeholder={formElement.placeholder || "Select item"}
										/>
									</MultiSelectTrigger>
								</field.FormControl>
								<MultiSelectContent>
									<MultiSelectList>
										{formElement.options.map(({ label, value }) => (
											<MultiSelectItem key={value} value={value}>
												{label}
											</MultiSelectItem>
										))}
									</MultiSelectList>
								</MultiSelectContent>
							</MultiSelect>
							<field.FormDescription>
								{formElement.description}
							</field.FormDescription>
							<field.FormMessage />
						</field.FormItem>
						</>
					)}
				/>
			);
		case "DatePicker":
			return (
				<form.AppField
					name={formElement.name}
					children={(field) => {
						const date = field.state.value;
						return (
							<field.FormItem className="flex flex-col w-full">
								<div>
									<field.FormLabel>
										{formElement.label} {formElement.required ? " *" : ""}
									</field.FormLabel>
								</div>
								<field.FormControl>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant={"outline"}
												className={cn(
													"w-full justify-start text-start font-normal",
													!date && "text-muted-foreground",
												)}
											>
												<CalendarIcon className="mr-2 size-4" />
												{date ? (
													format(date as Date, "PPP")
												) : (
													<span>Pick a date</span>
												)}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={field.state.value as Date | undefined}
												onSelect={(newDate) => {
													field.handleChange(newDate);
												}}

											/>
										</PopoverContent>
									</Popover>
								</field.FormControl>
								<field.FormDescription>
									{formElement.description}
								</field.FormDescription>
								<field.FormMessage />
							</field.FormItem>
						);
					}}
				/>
			);
		case "H1":
			return (
				<h1
					key={formElement.content}
					className={cn("mt-6 font-bold text-3xl", formElement.className)}
				>
					{formElement.content}
				</h1>
			);
		case "H2":
			return <h2 className="mt-4 font-bold text-xl">{formElement.content}</h2>;
		case "H3":
			return (
				<h3 className="mt-3 font-semiboldbold text-lg">
					{formElement.content} content
				</h3>
			);
		case "P":
			return (
				<p className="tracking-wider text-foreground/60 pt-0 dark:text-foreground/60 mb-4 mt-0 text-wrap">
					{formElement.content}
				</p>
			);
		case "Separator":
			return (
				<div className="py-3 w-full">
					<Separator {...formElement} />
				</div>
			);
		default:
			return <div>Invalid Form Element</div>;
	}
};
