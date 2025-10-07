import * as React from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./button";
import { CheckIcon } from "./check";
import { CopyIcon } from "./copy";

//======================================
function CopyButton({ text, type = "button" }: { text: string, type?: "button" | "submit" }) {
	const [copied, setCopied] = React.useState(false);
	const handleCopy = () => {
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 2000);
	};
	return (
		<TooltipProvider delayDuration={0}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="size-8"
						type={type || "button"}
						onClick={handleCopy}
					>
						{copied ? (
							<CheckIcon className="size-4 text-green-500" />
						) : (
							<CopyIcon className="size-4" />
						)}
					</Button>
				</TooltipTrigger>
				<TooltipContent className="text-muted px-2 py-1 text-xs z-[10000]">
					Copy Registry URL
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

export default CopyButton;
