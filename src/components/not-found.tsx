import { Link } from "@tanstack/react-router";

export function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-background">
			<div className="text-center">
				<h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
				<p className="text-xl text-muted-foreground mb-8">Page not found</p>
				<Link
					to="/"
					className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
				>
					Go home
				</Link>
			</div>
		</div>
	);
}
