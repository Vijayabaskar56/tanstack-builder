"use client";
import { SquareStackIcon } from "lucide-react";
import { FormEdit } from "@/components/builder/form-edit";
import { SingleStepFormPreview } from "@/components/builder/form-preview";
import { Button } from "@/components/ui/button";
import { type AppForm, useFormBuilder } from "@/hooks/use-form-builder";
import { useFormStore, useIsMultiStep } from "@/hooks/use-form-store";

const tabsList = [
	{ name: "Edit" },
	{ name: "Code" },
	{ name: "JSON" },
	{ name: "Submission" },
];
export function FormBuilder() {
	const { resetForm, form } = useFormBuilder();
	const { formElements, actions } = useFormStore();
	const isMS = useIsMultiStep();
	return (
		<div className="pt-4 pb-20">
			<div className="w-full grid md:grid-cols-12 gap-3 lg:gap-4">
				<div className="w-full md:col-span-6 min-w-full grow py-6 px-4 border-y sm:border-y-0 sm:border-x border-dashed">
					<div className="pb-4 flex items-center justify-between">
						{" "}
						<Button variant="outline" onClick={() => actions.setIsMS(!isMS)}>
							{isMS ? (
								<>Single-step Form</>
							) : (
								<>
									<SquareStackIcon /> Multi-step Form
								</>
							)}
						</Button>
						{formElements.length > 1 && (
							<Button variant="ghost" onClick={resetForm}>
								Reset
							</Button>
						)}
					</div>
					<FormEdit />
				</div>{" "}
				<div className="md:col-span-4 w-full px-2 pb-6">
					{" "}
					<SingleStepFormPreview form={form as unknown as AppForm} />
				</div>{" "}
			</div>{" "}
		</div>
	);
}
