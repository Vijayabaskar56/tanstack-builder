"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCopy } from "@/hooks/use-copy";

const CopyButton = ({ url }: { url: string | null }) => {
	const { copied, copy } = useCopy();

	return (
		<TooltipProvider delayDuration={0}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="text-muted-foreground/80 hover:text-foreground transition-none hover:bg-transparent disabled:opacity-100 lg:opacity-0 lg:group-focus-within/item:opacity-100 lg:group-hover/item:opacity-100"
						onClick={() => copy(url || "")}
						aria-label={copied ? "Copied" : "Copy component source"}
						disabled={copied}
					>
						{copied ? (
							<CheckIcon className="size-4 text-green-500" />
						) : (
							<CopyIcon className="size-4" />
						)}
					</Button>
				</TooltipTrigger>
				<TooltipContent className="text-muted-foreground px-2 py-1 text-xs">
					Copy Registry URL
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default CopyButton;
