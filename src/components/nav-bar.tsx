import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Github, Twitter } from "lucide-react";

export default function NavBar() {
	return (
		<header className="border-b px-4 md:px-6">
			<div className="flex h-16 items-center justify-between gap-4">
				{/* Left side */}
				<div className="flex flex-1 items-center gap-2">
					<div className="mr-4 flex">
						<Link to="/">
							<h1 className="text-lg font-semibold">
								TanStack Form Builder{" "}
								<span className="text-sm absolute top-3 text-primary">
									Beta
								</span>
							</h1>
						</Link>
					</div>
				</div>
				{/* Middle area */}
				{/* <AppToggle /> */}
				{/* Right side */}
				<div className="flex flex-1 items-center justify-end gap-2">
					<Button
						size="sm"
						variant="ghost"
						className="text-sm max-sm:aspect-square max-sm:p-0"
						asChild
					>
						<a
							href="https://github.com/Vijayabaskar56/tanstack-builder"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Github
								className="opacity-60 sm:-ms-1"
								size={16}
								aria-hidden="true"
							/>
						</a>
					</Button>
					<Button
						size="sm"
						variant="ghost"
						className="text-sm max-sm:aspect-square max-sm:p-0"
						asChild
					>
						<a
							href="https://x.com/vijayabaskar56"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Twitter
								className="opacity-60 sm:-ms-1"
								size={16}
								aria-hidden="true"
							/>
						</a>
					</Button>
					<ModeToggle />
				</div>
			</div>
		</header>
	);
}
