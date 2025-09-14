import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";

export function GeneratedCodeInfoCard() {
	return (
		<HoverCard openDelay={10}>
			<HoverCardTrigger asChild>
				<Button variant="secondary" size="icon" className="rounded-full">
					<Info />
				</Button>
			</HoverCardTrigger>
			<HoverCardContent
				className=" border-0 dark:border w-sm"
				side="left"
				align="start"
			>
				<div className="space-y-3">
					<div className="space-y-2">
						<div>
							<h2 className="font-bold">Core Libraries</h2>
							<div className="flex flex-wrap gap-1 mt-1">
								{[
									"React 19",
									"Tailwindcss 4",
									"Radix UI",
									"Zod 4",
									"React Hook Form 7",
									"Motion 12",
									"Next safe actions 8",
								].map((lib) => (
									<Badge variant="secondary" key={lib}>
										{lib}
									</Badge>
								))}
							</div>
						</div>
						<div>
							<h2 className="font-bold">Features</h2>
							<ul className="mt-1 space-y-0.5">
								<li>• Type-safe form validation with Zod</li>
								<li>• Accessible UI components</li>
								<li>• Responsive design</li>
								<li>• Form state management</li>
							</ul>
						</div>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}
