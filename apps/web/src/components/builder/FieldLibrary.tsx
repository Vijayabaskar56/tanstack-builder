import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formElementsList } from "@/constants/form-elements-list";
import type { FormElement } from "@/form-types";
import { useFormStore } from "@/hooks/use-form-store";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";

export function FieldTab() {
	const [searchQuery, setSearchQuery] = useState("");
	const { actions, isMS, formElements } = useFormStore();
	// Group elements by their group property
	const groupedElements = formElementsList.reduce(
		(acc, element) => {
			const group = element.group || "other";
			if (!acc[group]) {
				acc[group] = [];
			}
			if (searchQuery) {
				if (
					element.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					element.fieldType.toLowerCase().includes(searchQuery.toLowerCase())
				) {
					acc[group].push(element);
				}
			} else {
				acc[group].push(element);
			}
			return acc;
		},
		{} as Record<string, typeof formElementsList>,
	);
	const renderElementButton = (o: (typeof formElementsList)[0]) => {
		const Icon = o.icon;
		return (
			<Button
				key={o.name}
				variant="ghost"
				// size="sm"
				onClick={() => {
					actions.appendElement({
						fieldType: o.fieldType as FormElement["fieldType"],
						stepIndex: isMS ? formElements.length - 1 : undefined,
					});
				}}
				className="gap-2 justify-start w-full text-sm sm:text-[13px] py-2 sm:py-1.5 h-auto min-h-[44px]"
			>
				<div className="flex items-center justify-start gap-2 sm:gap-1.5 flex-1">
					<span className="border rounded-full size-8 sm:size-7 grid place-items-center flex-shrink-0">
						<Icon className="size-4 sm:size-4" />
					</span>
					<span className="text-left flex-1 truncate">{o.name}</span>
					{/* {o?.isNew! && (
          <Badge className="text-sm rounded-full ml-1 size-5 center">
            N
          </Badge>
        )} */}
				</div>
			</Button>
		);
	};

	return (
		<div className="flex flex-col h-full md:h-full max-h-[35vh] md:max-h-none">
			<div className="flex-shrink-0 p-3 sm:p-4 border-b">
				<h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Field Library</h2>
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
					<Input
						placeholder="Search fields..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9 text-sm sm:text-base"
					/>
				</div>
			</div>
			<ScrollArea className="flex-1 overflow-auto max-h-[calc(35vh-8rem)] md:max-h-none">
				<div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
					{/* Field Elements Group */}
					{groupedElements.field && (
						<div>
							<h3 className="text-xs font-medium text-muted-foreground mb-2 pl-3 sm:pl-4">
								Field Elements
							</h3>
							<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-2">
								{groupedElements.field.length ? (
									groupedElements.field.map(renderElementButton)
								) : (
									<div className="flex items-center justify-start gap-2 sm:gap-1.5 p-2">
										<span className="size-8 sm:size-7 grid place-items-center flex-shrink-0"></span>
										<span className="text-sm sm:text-base">No Field Matches your Query</span>
										{/* {o?.isNew! && (
          <Badge className="text-sm rounded-full ml-1 size-5 center">
            N
          </Badge>
        )} */}
									</div>
								)}
							</div>
						</div>
					)}

					{/* Display Elements Group */}
					{groupedElements.display && (
						<div className="mb-3">
							<h3 className="text-xs font-medium text-muted-foreground mb-1.5 pl-3 sm:pl-4">
								Display Elements
							</h3>
							<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-2">
								{groupedElements.display.length ? (
									groupedElements.display.map(renderElementButton)
								) : (
									<div className="flex items-center justify-start gap-2 sm:gap-1.5 p-2">
										<span className="size-8 sm:size-7 grid place-items-center flex-shrink-0"></span>
										<span className="text-sm sm:text-base">No Field Matches your Query</span>
										{/* {o?.isNew! && (
          <Badge className="text-sm rounded-full ml-1 size-5 center">
            N
          </Badge>
        )} */}
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</ScrollArea>
		</div>
	);
}
