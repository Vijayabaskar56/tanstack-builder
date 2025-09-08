// code-button.tsx
import { Check, Copy } from "lucide-react";
import * as React from "react";
import { Button } from "./button";
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
				<Check className="size-4 text-green-500" />
			) : (
				<Copy className="size-4" />
			)}
		</Button>
	);
}
