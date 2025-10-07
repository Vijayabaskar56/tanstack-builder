// apps/web/src/routes/form-builder/index.tsx

import { createFileRoute } from "@tanstack/react-router";
import { FieldTab } from "@/components/builder/FieldLibrary";
import { FormEdit } from "@/components/builder/form-edit";
import { SingleStepFormPreview } from "@/components/builder/form-preview";
import { SettingsSidebar } from "@/components/builder/SettingsSidebar";
import { TemplateSidebar } from "@/components/builder/TemplateSidebar";
import { ErrorBoundary } from "@/components/error-boundary";
import { NotFound } from "@/components/not-found";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type AppForm, useFormBuilder } from "@/hooks/use-form-builder";
import { useIsMobile } from "@/hooks/use-mobile";
import useSettings from "@/hooks/use-settings";

interface SectionHeaderProps {
	title: string;
	description: string;
}

// Editor Section Component
interface EditorSectionProps {
	showHeader?: boolean;
	withScrollArea?: boolean;
	scrollHeight?: string;
	maxWidth?: string;
}

// Preview Section Component
interface PreviewSectionProps {
	form: AppForm;
	showHeader?: boolean;
	withScrollArea?: boolean;
	scrollHeight?: string;
}

export const Route = createFileRoute("/form-builder/")({
	component: FormBuilderComponent,
	errorComponent: ErrorBoundary,
	notFoundComponent: NotFound,
	ssr: false,
});

function FormBuilderComponent() {
	const { form } = useFormBuilder();
	const isMobile = useIsMobile();

	function SectionHeader({ title, description }: SectionHeaderProps) {
		return (
			<div className="mb-4 pb-2 border-b">
				<h3 className="text-lg font-semibold text-primary">{title}</h3>
				<p className="text-sm text-muted-foreground">{description}</p>
			</div>
		);
	}

	// Sidebar Content Component
	function SidebarContent() {
		const settings = useSettings();
		const activeTab = settings?.activeTab;

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
	}

	function EditorSection({
		showHeader = true,
		withScrollArea = false,
		scrollHeight = "h-full md:h-[45rem]",
		maxWidth = "",
	}: EditorSectionProps) {
		const content = (
			<div className={maxWidth}>
				{showHeader && (
					<SectionHeader
						title="Editor"
						description="Design your form elements"
					/>
				)}
				<FormEdit />
			</div>
		);

		if (withScrollArea) {
			return <ScrollArea className={scrollHeight}>{content}</ScrollArea>;
		}

		return content;
	}

	function PreviewSection({
		form,
		showHeader = true,
		withScrollArea = false,
		scrollHeight = "h-full md:h-[45rem]",
	}: PreviewSectionProps) {
		const content = (
			<>
				{showHeader && (
					<SectionHeader
						title="Preview"
						description="See how your form looks"
					/>
				)}
				<SingleStepFormPreview form={form as unknown as AppForm} />
			</>
		);

		if (withScrollArea) {
			return <ScrollArea className={scrollHeight}>{content}</ScrollArea>;
		}

		return content;
	}

	return (
		<main className="h-[calc(100vh-8rem)] w-full relative">
			{isMobile ? (
				<div className="h-full flex flex-col relative">
					<ScrollArea className="h-full">
						<div className="flex flex-col">
							<div className="bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
								<SidebarContent />
							</div>

							<div className="p-4 border-t">
								<EditorSection />
							</div>

							<div className="p-4 border-t">
								<PreviewSection form={form as unknown as AppForm} />
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
								<SidebarContent />
							</ScrollArea>
						</div>

						{/* Tablet Form Edit and Preview - Side by side below */}
						<div className="flex flex-1">
							{/* Tablet Form Edit - Takes less space */}
							<div className="flex-[0.5] border-r overflow-hidden">
								<ScrollArea className="h-full">
									<div className="p-4">
										<EditorSection maxWidth="max-w-md" />
									</div>
								</ScrollArea>
							</div>

							{/* Tablet Preview - Takes more space */}
							<div className="flex-[0.5]">
								<ScrollArea className="h-full">
									<div className="p-4">
										<PreviewSection form={form as unknown as AppForm} />
									</div>
								</ScrollArea>
							</div>
						</div>
					</div>

					{/* Desktop Layout - Horizontal Grid */}
					<div
						className="hidden lg:grid lg:h-full"
						style={{
							gridTemplateColumns: "minmax(250px, 1fr) 2fr 2fr",
						}}
					>
						{/* Desktop Left Sidebar */}
						<div className="border-r bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-hidden h-full">
							<div className="p-4">
								<SidebarContent />
							</div>
						</div>

						{/* Desktop Form Edit Section */}
						<div className="relative border-b lg:border-b-0 lg:border-r h-full">
							<div className="p-4">
								<EditorSection withScrollArea={true} maxWidth="w-full" />
							</div>
						</div>

						{/* Desktop Preview Section */}
						<div className="relative h-full">
							<div className="p-4">
								<PreviewSection
									form={form as unknown as AppForm}
									withScrollArea={true}
								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</main>
	);
}
