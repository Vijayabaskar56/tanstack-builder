import { Button } from "./button";
import React, { ReactElement, useRef } from "react";

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
}: AnimatedIconButtonProps) => {
	const iconRef = useRef<IconHandle | null>(null);

	const content = (
		<>
			{iconPosition === "start" &&
				React.cloneElement(icon, { ref: iconRef } as any)}
			{text}
			{iconPosition === "end" &&
				React.cloneElement(icon, { ref: iconRef } as any)}
		</>
	);

	if (renderAs === "span") {
		return (
			<span
				className={className}
				onClick={onClick}
				onMouseEnter={() => iconRef.current?.startAnimation()}
				onMouseLeave={() => iconRef.current?.stopAnimation()}
				onKeyDown={(e) => {
					if (e.key === "Enter") onClick?.();
				}}
				tabIndex={0}
			>
				{content}
			</span>
		);
	}

	return (
		<Button
			variant={variant}
			size={size}
			className={className}
			onClick={onClick}
			onMouseEnter={() => iconRef.current?.startAnimation()}
			onMouseLeave={() => iconRef.current?.stopAnimation()}
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
		<span
			className={className}
			onClick={onClick}
			onMouseEnter={() => iconRef.current?.startAnimation()}
			onMouseLeave={() => iconRef.current?.stopAnimation()}
			onKeyDown={(e) => {
				if (e.key === "Enter") onClick?.();
			}}
			tabIndex={0}
			{...props}
		>
			{React.cloneElement(icon, { ref: iconRef } as any)}
			<span className={textClassName}>{text}</span>
		</span>
	);
};
