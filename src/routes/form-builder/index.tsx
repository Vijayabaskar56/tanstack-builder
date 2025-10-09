import { FormEdit } from "@/components/builder/form-edit";
import { SingleStepFormPreview } from "@/components/builder/form-preview";
import { ErrorBoundary } from "@/components/error-boundary";
import { NotFound } from "@/components/not-found";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type AppForm, useFormBuilder } from "@/hooks/use-form-builder";
import { useIsMobile } from "@/hooks/use-mobile";
import useSettings from "@/hooks/use-settings";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FieldTab } from "../../components/builder/FieldLibrary";
import { SettingsSidebar } from "../../components/builder/SettingsSidebar";
import { TemplateSidebar } from "../../components/builder/TemplateSidebar";

export const Route = createFileRoute("/form-builder/")({
	component: FormBuilderComponent,
	errorComponent: ErrorBoundary,
	notFoundComponent: NotFound,
	ssr: false,
});

function FormBuilderComponent() {
	const { form } = useFormBuilder();
	const isMobile = useIsMobile();
	const settings = useSettings();
	const activeTab = settings?.activeTab;
	const isCodeSidebarOpen = settings?.isCodeSidebarOpen ?? false;
	// Custom hook to detect desktop (lg breakpoint - 1024px+)
	const [isDesktop, setIsDesktop] = useState<boolean>(false);

	useEffect(() => {
		const checkIsDesktop = () => {
			setIsDesktop(window.innerWidth >= 1024);
		};

		// Check initial size
		checkIsDesktop();

		// Listen for resize events
		window.addEventListener("resize", checkIsDesktop);
		return () => window.removeEventListener("resize", checkIsDesktop);
	}, []);

	const renderSidebarContent = () => {
		switch (activeTab) {
			case "builder":
				return <FieldTab />;
			case "template":
				return <TemplateSidebar />;
			case "settings":
				return <SettingsSidebar />;
			default:
				return <FieldTab />;
		}
	};

	return (
		<main className="h-[calc(100vh-8rem)] w-full">
			{isMobile ? (
				<div className="h-full flex flex-col relative">
					<ScrollArea className="h-full">
						<div className="flex flex-col">
							<div className="bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
								{renderSidebarContent()}
							</div>

							<div className="p-4 border-t">
								<div className="mb-4 pb-2 border-b">
									<h3 className="text-lg font-semibold text-primary">Editor</h3>
									<p className="text-sm text-muted-foreground">
										Design your form elements
									</p>
								</div>
								<FormEdit />
							</div>

							<div className="p-4 border-t">
								<div className="mb-4 pb-2 border-b">
									<h3 className="text-lg font-semibold text-primary">
										Preview
									</h3>
									<p className="text-sm text-muted-foreground">
										See how your form looks
									</p>
								</div>
								<SingleStepFormPreview form={form as unknown as AppForm} />
							</div>
						</div>
					</ScrollArea>
				</div>
			) : (
				<div className="h-full">
					{/* Tablet Layout - Sidebar at top, FormEdit and FormPreview side by side */}
					<div className="hidden md:flex lg:hidden h-full flex-col">
						{/* Tablet Sidebar - At top */}
						<div className="bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
							<ScrollArea className="p-4 h-[25rem]">
								{renderSidebarContent()}
							</ScrollArea>
						</div>

						{/* Tablet Form Edit and Preview - Side by side below */}
						<div className="flex flex-1">
							{/* Tablet Form Edit - Grows and shrinks */}
							<div className="flex-1  border-r">
								<ScrollArea className="h-full">
									<div className="p-4">
										<div className="mb-4 pb-2 border-b">
											<h3 className="text-lg font-semibold text-primary">
												Editor
											</h3>
											<p className="text-sm text-muted-foreground">
												Design your form elements
											</p>
										</div>
										<FormEdit />
									</div>
								</ScrollArea>
							</div>

							{/* Tablet Preview - Grows and shrinks */}
							<div className="flex-1 ">
								<ScrollArea className="h-full">
									<div className="p-4">
										<div className="mb-4 pb-2 border-b">
											<h3 className="text-lg font-semibold text-primary">
												Preview
											</h3>
											<p className="text-sm text-muted-foreground">
												See how your form looks
											</p>
										</div>
										<SingleStepFormPreview form={form as unknown as AppForm} />
									</div>
								</ScrollArea>
							</div>
						</div>
					</div>

					{/* Desktop Layout - Horizontal Grid */}
					<div
						className="hidden lg:grid lg:h-full"
						style={{
							gridTemplateColumns: isCodeSidebarOpen
								? "1.4fr 3fr 3fr 3fr"
								: "3fr 6fr 6fr",
						}}
					>
						{/* Desktop Left Sidebar */}
						<div className="border-r bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-hidden h-full">
							<div className="p-4">{renderSidebarContent()}</div>
						</div>

						{/* Desktop Form Edit Section */}
						<div className="relative border-b lg:border-b-0 lg:border-r h-full">
							<div className="p-4">
								<div className="mb-4 pb-2 border-b">
									<h3 className="text-lg font-semibold text-primary">Editor</h3>
									<p className="text-sm text-muted-foreground">
										Design your form elements
									</p>
								</div>
								<ScrollArea className="h-full  md:h-[45rem]">
									<FormEdit />
								</ScrollArea>
							</div>
						</div>
						{/* Desktop Preview Section */}
						<div className="relative h-full">
							<div className="p-4">
								<div className="mb-4 pb-2 border-b">
									<h3 className="text-lg font-semibold text-primary">
										Preview
									</h3>
									<p className="text-sm text-muted-foreground">
										See how your form looks
									</p>
								</div>
								<ScrollArea className="h-full  md:h-[45rem]">
									<SingleStepFormPreview form={form as unknown as AppForm} />
								</ScrollArea>
							</div>
						</div>
					</div>
				</div>
			)}
		</main>
	);
}
