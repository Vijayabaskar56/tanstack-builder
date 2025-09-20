// app-toggle.tsx
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useId } from "react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function AppToggle() {
	const id = useId();
	const navigate = useNavigate();
	const location = useLocation();

	const isFormBuilder = location.pathname.startsWith("/form-builder");
 // const isTableBuilder = location.pathname.startsWith("/table-builder")
	const selectedValue = isFormBuilder ? "off" : "on";

	const handleValueChange = (value: string) => {
		const newPath =
			value === "off" ? "/form-builder" : "/table-builder";
		navigate({
			to: newPath,
			replace: true,
		});
	};

	return (
		<div className="bg-input/50 inline-flex h-8 rounded-md p-0.5">
			<RadioGroup
				value={selectedValue}
				onValueChange={handleValueChange}
				className="group after:bg-background has-focus-visible:after:border-ring has-focus-visible:after:ring-ring/50 relative inline-grid grid-cols-[1fr_1fr] items-center gap-0 text-sm font-medium after:absolute after:inset-y-0 after:w-1/2 after:rounded-sm after:shadow-xs after:transition-[translate,box-shadow] after:duration-300 after:ease-[cubic-bezier(0.16,1,0.3,1)] has-focus-visible:after:ring-[3px] data-[state=off]:after:translate-x-0 data-[state=on]:after:translate-x-full"
				data-state={selectedValue}
			>
				<label htmlFor={`${id}-1`} className="group-data-[state=on]:text-muted-foreground/70 relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-3 whitespace-nowrap transition-colors select-none">
					Form Builder
					<RadioGroupItem id={`${id}-1`} value="off" className="sr-only" />
				</label>
				<label htmlFor={`${id}-2`} className="group-data-[state=off]:text-muted-foreground/70 relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-3 whitespace-nowrap transition-colors select-none">
					Table Builder
					<RadioGroupItem id={`${id}-2`} value="on" className="sr-only" />
				</label>
			</RadioGroup>
		</div>
	);
}
