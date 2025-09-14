import { Delete, Plus } from "lucide-react";
import { UnifiedFormElementsDropdown } from "@/components/builder/form-elements-dropdown";
import { Button } from "@/components/ui/button";
import { useFormStore } from "@/hooks/use-form-store";
//======================================
export function StepContainer({
	children,
	stepIndex,
}: {
	children: React.ReactNode;
	stepIndex: number;
}) {
	const { actions } = useFormStore();
	return (
		<div className="rounded-lg px-3 md:px-4 md:py-5 py-4 border-dashed border bg-muted">
			<div className="flex items-center justify-between mb-3">
				<UnifiedFormElementsDropdown
					context="multistep"
					stepIndex={stepIndex}
				/>
				<div className="text-muted-foreground center font-medium pr-2">
					Step {stepIndex + 1}
				</div>
			</div>
			<div className="space-y-3">{children}</div>
			<div className="flex items-center justify-end px-2 pt-4">
				<div className="flex items-center justify-end gap-3">
					<Button
						onClick={() => actions.removeFormStep(stepIndex)}
						variant="outline"
						className="rounded-lg"
						type="button"
					>
						<Delete />
						<span>Remove Step</span>
					</Button>
					<Button
						type="button"
						className="rounded-lg"
						onClick={() => actions.addFormStep(stepIndex)}
					>
						<Plus />
						<span>Add Step</span>
					</Button>
				</div>
			</div>
		</div>
	);
}
