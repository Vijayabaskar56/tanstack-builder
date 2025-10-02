import * as React from "react";
import { Button } from "./button";
import { CheckIcon } from "./check";
import { CopyIcon } from "./copy";
//======================================
export function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = React.useState(false);
	const handleCopy = () => {
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 2000);
	};
	return (
		<Button variant="ghost" size="icon" className="size-8" onClick={handleCopy}>
			{copied ? (
				<CheckIcon className="size-4 text-green-500" />
			) : (
				<CopyIcon className="size-4" />
			)}
		</Button>
	);
}
