import { FileStack, Search, SquareStack } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { templates } from "@/constants/templates";
import { useFormStore } from "@/hooks/use-form-store";

const formTemplates = Object.entries(templates).map((template) => ({
	label: template[1].name,
	value: template[0],
	isMS: template[1].template.some((el) => Object.hasOwn(el, "stepFields")),
}));

export function TemplateSidebar() {
	const [searchQuery, setSearchQuery] = useState("");
	const { actions } = useFormStore();

	return (
		<div className="flex flex-col h-full md:h-full max-h-[35vh] md:max-h-none">
			<div className="flex-shrink-0 p-3 sm:p-4 border-b">
				<h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
					Templates
				</h2>
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
					<Input
						placeholder="Search templates..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9 text-sm sm:text-base"
					/>
				</div>
			</div>
   	<ScrollArea className="flex-1 overflow-auto max-h-[calc(35vh-8rem)] md:max-h-none">
				<div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
     		{formTemplates.map(({ label, value, isMS }) => (
      <div key={label} className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-2">
      <Button
							key={label}
							onClick={() => actions.setTemplate(value)}
							className="justify-start text-[12px]"
							variant="ghost"
       >
							{isMS ? (
        <SquareStack className="size-4" />
							) : (
        <FileStack className="size-4" />
							)}
							{label}
						</Button>
      </div>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}
