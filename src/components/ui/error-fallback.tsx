import { AlertTriangle, RefreshCw } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "./alert";
import { Button } from "./button";

interface ErrorFallbackProps {
	error?: Error;
	resetError?: () => void;
	title?: string;
	description?: string;
}

export function ErrorFallback({
	error,
	resetError,
	title = "Something went wrong",
	description = "The application encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.",
}: ErrorFallbackProps) {
	const handleRefresh = () => {
		if (resetError) {
			resetError();
		} else {
			window.location.reload();
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="max-w-md w-full">
				<Alert variant="destructive">
					<AlertTriangle className="h-4 w-4" />
					<AlertTitle>{title}</AlertTitle>
					<AlertDescription className="mt-2">
						<p className="mb-4">{description}</p>
						{process.env.NODE_ENV === "development" && error && (
							<details className="mb-4">
								<summary className="cursor-pointer font-medium">
									Error details (development only)
								</summary>
								<pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-32">
									{error.message}
								</pre>
							</details>
						)}
						<Button
							onClick={handleRefresh}
							variant="outline"
							size="sm"
							className="w-full"
						>
							<RefreshCw className="h-4 w-4 mr-2" />
							Try again
						</Button>
					</AlertDescription>
				</Alert>
			</div>
		</div>
	);
}
