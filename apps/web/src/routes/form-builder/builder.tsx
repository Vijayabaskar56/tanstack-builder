import { createFileRoute } from "@tanstack/react-router";
import { FormEdit } from "@/components/builder/form-edit";
import { SingleStepFormPreview } from "@/components/builder/form-preview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type AppForm, useFormBuilder } from "@/hooks/use-form-builder";
import { FieldTab } from "../../components/builder/FieldLibrary";

export const Route = createFileRoute("/form-builder/builder")({
	component: BuilderComponent,
});

function BuilderComponent() {
	const { form } = useFormBuilder();

	return (
		<main className="lg:h-[calc(100vh-8rem)] h-[calc(100vh-12rem)] flex flex-col md:flex-row overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
			{/* Field Library - Top on mobile, Left on desktop */}
			<div className="border-b md:border-b-0 md:border-r bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:max-w-xs lg:max-w-sm">
				<FieldTab />
			</div>

			{/* Form Edit and Preview - Bottom on mobile, Right on desktop */}
				<div className="flex-1 bg-gradient-to-br from-background via-background to-muted/10 min-h-0">
			<ScrollArea className="h-full w-full">
					<div className="pt-4 pb-20 flex flex-col lg:flex-row">
						{/* Form Edit Section */}
						<div className="w-full lg:flex-1 py-6 px-4 border-b lg:border-b-0 lg:border-r border-dashed">
							<FormEdit />
						</div>

						{/* Form Preview Section */}
						<div className="w-full lg:w-80 xl:w-96 px-2 pb-6">
							<SingleStepFormPreview form={form as unknown as AppForm} />
						</div>
					</div>
			</ScrollArea>
				</div>
		</main>
	);
}
