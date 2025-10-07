import React, { type ReactElement, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface IconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface AnimatedIconButtonProps {
	icon: ReactElement;
	text: React.ReactNode;
	onClick?: () => void;
	variant?:
		| "ghost"
		| "secondary"
		| "default"
		| "destructive"
		| "outline"
		| "link";
	size?: "sm" | "default" | "lg" | "icon";
	className?: string;
	iconPosition?: "start" | "end";
	renderAs?: "button" | "span";
	// Allow passing through additional props for better integration with other components
	[key: string]: unknown;
}

export const AnimatedIconButton = ({
	icon,
	text,
	onClick,
	variant = "ghost",
	size = "sm",
	className,
	iconPosition = "start",
	renderAs = "button",
	...props
}: AnimatedIconButtonProps) => {
	const iconRef = useRef<IconHandle | null>(null);

	const content = (
		<>
			{iconPosition === "start" &&
				React.cloneElement(icon, {
					ref: iconRef,
				} as React.RefAttributes<IconHandle>)}
			{text}
			{iconPosition === "end" &&
				React.cloneElement(icon, {
					ref: iconRef,
				} as React.RefAttributes<IconHandle>)}
		</>
	);

	const focusClasses =
		"rounded-md outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background";

	if (renderAs === "span") {
		return (
			<span
				className={cn(focusClasses, className)}
				onClick={onClick}
				onMouseEnter={() => iconRef.current?.startAnimation()}
				onMouseLeave={() => iconRef.current?.stopAnimation()}
				onKeyDown={(e) => {
					if (e.key === "Enter") onClick?.();
				}}
				tabIndex={0}
				role="button"
				{...props}
			>
				{content}
			</span>
		);
	}

	return (
		<Button
			type="button"
			variant={variant}
			size={size}
			className={cn(focusClasses, className)}
			onClick={onClick}
			onMouseEnter={() => iconRef.current?.startAnimation()}
			onMouseLeave={() => iconRef.current?.stopAnimation()}
			{...props}
		>
			{content}
		</Button>
	);
};

interface AnimatedIconSpanProps extends React.HTMLAttributes<HTMLSpanElement> {
	icon: ReactElement;
	text: string;
	onClick?: () => void;
	textClassName?: string;
}

export const AnimatedIconSpan = ({
	icon,
	text,
	onClick,
	className,
	textClassName,
	...props
}: AnimatedIconSpanProps) => {
	const iconRef = useRef<IconHandle | null>(null);

	return (
		<button
			type="button"
			className={cn(
				"rounded-md outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
				className,
			)}
			onClick={onClick}
			onMouseEnter={() => iconRef.current?.startAnimation()}
			onMouseLeave={() => iconRef.current?.stopAnimation()}
			onKeyDown={(e) => {
				if (e.key === "Enter") onClick?.();
			}}
			{...props}
		>
			{React.cloneElement(icon, {
				ref: iconRef,
			} as React.RefAttributes<IconHandle>)}
			<span className={textClassName}>{text}</span>
		</button>
	);
};
