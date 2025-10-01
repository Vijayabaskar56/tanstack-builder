import { Button, type buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import {
	createFormHook,
	createFormHookContexts,
	revalidateLogic,
	useStore,
} from "@tanstack/react-form";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Input } from "./input";
import { Textarea } from "./textarea";
const {
	fieldContext,
	formContext,
	useFieldContext: _useFieldContext,
	useFormContext,
} = createFormHookContexts();

const { useAppForm, withForm, withFieldGroup } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		FormLabel,
		FormControl,
		FormDescription,
		FormMessage,
		FormItem,
		FormInput,
		FormTextarea,
	},
	formComponents: {
		SubmitButton,
		StepButton,
		Form,
	},
});

type FormItemContextValue = {
	id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
	{} as FormItemContextValue,
);

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
	const id = React.useId();

	return (
		<FormItemContext.Provider value={{ id }}>
			<div
				data-slot="form-item"
				className={cn("grid gap-1", className)}
				{...props}
			/>
		</FormItemContext.Provider>
	);
}

const useFieldContext = () => {
	const { id } = React.useContext(FormItemContext);
	const { name, store, ...fieldContext } = _useFieldContext();

	const errors = useStore(store, (state) => state.meta.errors);
	if (!fieldContext) {
		throw new Error("useFieldContext should be used within <FormItem>");
	}

	return {
		id,
		name,
		formItemId: `${id}-form-item`,
		formDescriptionId: `${id}-form-item-description`,
		formMessageId: `${id}-form-item-message`,
		errors,
		store,
		...fieldContext,
	};
};

function FormLabel({
	className,
	...props
}: React.ComponentProps<typeof Label>) {
	const { formItemId, errors } = useFieldContext();

	return (
		<Label
			data-slot="form-label"
			data-error={!!errors.length}
			className={cn("data-[error=true]:text-destructive", className)}
			htmlFor={formItemId}
			{...props}
		/>
	);
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
	const { errors, formItemId, formDescriptionId, formMessageId } =
		useFieldContext();

	return (
		<Slot
			data-slot="form-control"
			id={formItemId}
			aria-describedby={
				!errors.length
					? `${formDescriptionId}`
					: `${formDescriptionId} ${formMessageId}`
			}
			aria-invalid={!!errors.length}
			{...props}
		/>
	);
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
	const { formDescriptionId } = useFieldContext();

	return (
		<p
			data-slot="form-description"
			id={formDescriptionId}
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
	const { errors, formMessageId } = useFieldContext();
	const body = errors.length
		? String(errors.at(0)?.message ?? "")
		: props.children;
	if (!body) return null;
	return (
		<p
			data-slot="form-message"
			id={formMessageId}
			className={cn("text-destructive text-sm", className)}
			{...props}
		>
			{body}
		</p>
	);
}

function FormInput({
	...props
}: Omit<React.ComponentProps<typeof Input>, "onChange" | "onBlur">) {
	const {
		errors,
		formItemId,
		formDescriptionId,
		formMessageId,
		name,
		handleBlur,
		handleChange,
		store,
	} = useFieldContext();
	return (
		<Input
			{...props}
			id={formItemId}
			name={props.name || name}
			placeholder={props.placeholder || ""}
			type={props.type || "text"}
			onBlur={handleBlur}
			value={store.state.value as string}
			onChange={(e) => handleChange(e.target.value)}
			aria-describedby={
				!errors.length
					? `${formDescriptionId}`
					: `${formDescriptionId} ${formMessageId}`
			}
			aria-invalid={!!errors.length}
		/>
	);
}

function FormTextarea({
	...props
}: Omit<React.ComponentProps<typeof Textarea>, "onChange" | "onBlur">) {
	const {
		errors,
		formItemId,
		formDescriptionId,
		formMessageId,
		name,
		handleBlur,
		handleChange,
		store,
	} = useFieldContext();
	return (
		<Textarea
			{...props}
			id={formItemId}
			name={props.name || name}
			placeholder={props.placeholder || ""}
			onBlur={handleBlur}
			value={store.state.value as string}
			onChange={(e) => handleChange(e.target.value)}
			aria-describedby={
				!errors.length
					? `${formDescriptionId}`
					: `${formDescriptionId} ${formMessageId}`
			}
			aria-invalid={!!errors.length}
		/>
	);
}

function Form({
	children,
	...props
}: Omit<React.ComponentPropsWithoutRef<"form">, "onSubmit" & "noValidate"> & {
	children?: React.ReactNode;
}) {
	const form = useFormContext();
	const handleSubmit = React.useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			e.stopPropagation();
			form.handleSubmit();
		},
		[form],
	);
	return (
		<form
			onSubmit={handleSubmit}
			className={cn(
				"flex flex-col p-2 md:p-5 w-full mx-auto gap-2",
				props.className,
			)}
			noValidate
			{...props}
		>
			{children}
		</form>
	);
}

function SubmitButton({
	label,
	className,
	size,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		label: string;
	}) {
	const form = useFormContext();
	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => (
				<Button
					className={className}
					size={size}
					type="submit"
					disabled={isSubmitting}
					{...props}
				>
					{isSubmitting && (
						<div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
					)}
					{label}
				</Button>
			)}
		</form.Subscribe>
	);
}

function StepButton({
	label,
	handleMovement,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		label: string;
		handleMovement: () => void;
	}) {
	return (
		<Button
			size="sm"
			variant="ghost"
			type="button"
			onClick={handleMovement}
			{...props}
		>
			{label}
		</Button>
	);
}

export {
	useAppForm,
	useFormContext,
	useFieldContext,
	withForm,
	withFieldGroup,
	revalidateLogic,
};
