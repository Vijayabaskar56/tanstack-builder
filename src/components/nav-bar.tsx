import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

export default function NavBar() {
	const { data: stars } = useQuery({
		queryKey: ["github-stars"],
		queryFn: async () => {
			const res = await fetch(
				"https://api.github.com/repos/Vijayabaskar56/tanstack-builder",
			);
			const data = await res.json();
			return data.stargazers_count;
		},
		enabled: import.meta.env.PROD,
	});

	return (
		<header className="fixed top-0 left-0 right-0 z-10 bg-background border-b px-4 md:px-6">
			<div className="flex h-16 items-center justify-between gap-4">
				{/* Left side */}
				<div className="flex flex-1 items-center gap-2">
					<div className="mr-4 flex">
						<Link to="/">
							<h1 className="text-lg font-semibold">TanStack Form Builder</h1>
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
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								aria-label="GitHub"
							>
								<title>GitHub</title>
								<path
									d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.300 24 12c0-6.627-5.374-12-12-12z"
									fill="currentColor"
								/>
							</svg>
							{stars && <span className="ml-1 font-bold">{stars}</span>}
						</a>
					</Button>
					<Button
						size="sm"
						variant="ghost"
						className="text-sm max-sm:aspect-square max-sm:p-0"
						asChild
					>
						<a
							href="https://www.linkedin.com/in/vijaya-baskar/"
							target="_blank"
							rel="noopener noreferrer"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								aria-label="LinkedIn"
							>
								<title>LinkedIn</title>
								<path
									d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"
									fill="currentColor"
								/>
							</svg>
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
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								aria-label="Twitter"
							>
								<title>Twitter</title>
								<path
									d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
									fill="currentColor"
								/>
							</svg>
						</a>
					</Button>
					<ModeToggle />
				</div>
			</div>
		</header>
	);
}
