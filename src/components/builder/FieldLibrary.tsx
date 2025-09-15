import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { formElementsList } from "@/constants/form-elements-list";
import type { FormElement } from "@/types/form-types";
import { useSearchStore } from "@/hooks/use-search-store";
import { ScrollArea } from "../ui/scroll-area";

export function FieldTab() {
	const [searchQuery] = useState("");
	const { actions, isMS, formElements } = useSearchStore();
	// Group elements by their group property
	const groupedElements = useMemo(
		() =>
			formElementsList.reduce(
				(acc, element) => {
					const group = element.group || "other";
					if (!acc[group]) {
						acc[group] = [];
					}
					if (searchQuery) {
						if (
							element.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
							element.fieldType
								.toLowerCase()
								.includes(searchQuery.toLowerCase())
						) {
							acc[group].push(element);
						}
					} else {
						acc[group].push(element);
					}
					return acc;
				},
				{} as Record<string, typeof formElementsList>,
			),
		[searchQuery],
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
			<div className="mb-4 pb-2 px-4 border-b">
				<h3 className="text-lg font-semibold text-primary">Fields</h3>
				<p className="text-sm text-muted-foreground">
					Select Field For the Form
				</p>
			</div>
			<ScrollArea className="h-[calc(35vh-8rem)]  md:h-[45rem]">
				<div className="">
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
									<div className="text-sm text-muted-foreground p-3">
										No Field match your query
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
									<div className="text-sm text-muted-foreground p-3">
										No Field match your query
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
