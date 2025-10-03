import { Button } from "@/components/ui/button";
import type { ErrorComponentProps } from "@tanstack/react-router";

export function ErrorBoundary({ error, reset }: ErrorComponentProps) {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
			<div className="max-w-md w-full">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-destructive mb-2">
						Oops! Something went wrong.
					</h1>
					<p className="text-muted-foreground">
						An unexpected error occurred. Please try refreshing the page or
						report this issue on GitHub.
					</p>
				</div>
				<div className="bg-card border rounded-lg p-6 shadow-sm">
					<h2 className="text-lg font-semibold mb-3 text-card-foreground">
						Error Details
					</h2>
					<p className="text-sm text-muted-foreground font-mono bg-muted p-3 rounded break-all">
						{error.message}
					</p>
				</div>
				<div className="mt-8 text-center">
					<Button onClick={reset}>Reset and Try Again</Button>
				</div>
			</div>
		</div>
	);
}
