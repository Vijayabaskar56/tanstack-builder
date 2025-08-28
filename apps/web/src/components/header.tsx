// header.tsx

import { useLocation, useNavigate } from "@tanstack/react-router";
import {
	BookMarked,
	ChevronDown,
	Code,
	FormInput,
	RotateCcw,
	Save,
	Settings,
	Share,
	Upload,
} from "lucide-react";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFormBuilder } from "@/hooks/use-form-builder";
import { useFormStore } from "@/hooks/use-form-store";
import { useSidebarStore } from "@/hooks/use-sidebar-store";
import type { Framework, ValidationSchema } from "./builder/types";
import { GeneratedFormCodeViewer } from "./generated-code/code-viewer";
export default function FormHeader() {
	const _links = [{ to: "/", label: "Home" }];

	const navigate = useNavigate();
	const location = useLocation();
	const { activeTab, actions: sidebarActions } = useSidebarStore();

	const frameworks = ["react", "vue", "angular", "solid"];
	const validationLibs = ["zod", "valibot", "arktype"];

	const isFormBuilder = location.pathname.startsWith("/form-builder");

	const handleSubTabChange = (newSubTab: string) => {
		sidebarActions.setActiveTab(
			newSubTab as "builder" | "template" | "settings",
		);
	};
	const id = useId();
	const { actions, isMS, framework, validationSchema } = useFormStore();
	const { resetForm } = useFormBuilder();
	return (
		<header className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			{/* Unified header for desktop - tabs and actions in one row */}
			<div className="hidden lg:flex h-14  border-b items-center mx-3">
				{/* Tabs section - left side on desktop */}
				{isFormBuilder && (
					<div className="flex-shrink-0 mr-4">
						<Tabs
							value={activeTab}
							onValueChange={handleSubTabChange}
							className="flex"
						>
							<TabsList className="bg-background h-auto -space-x-px p-0 shadow-xs">
         <TabsList>
        <TabsTrigger value="builder" >
        <FormInput className="-ms-0.5 me-1.5 opacity-60" size={16} />
									Builder
        </TabsTrigger>
        <TabsTrigger value="template">
         <BookMarked className="-ms-0.5 me-1.5 opacity-60" size={16} />
									Template
        </TabsTrigger>
        <TabsTrigger value="settings">
         <Settings className="-ms-0.5 me-1.5 opacity-60" size={16} />
									Settings
        </TabsTrigger>
      </TabsList>
							</TabsList>
						</Tabs>
					</div>
				)}

				{/* Spacer to push settings to the right */}
				<div className="flex-1" />

				{/* Settings and actions - right side on desktop */}
				<div className="flex items-center gap-2">
					<nav className="flex items-center space-x-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm">
									{framework.charAt(0).toUpperCase() + framework.slice(1)}
									<ChevronDown className="w-4 h-4 ml-1" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								{frameworks.map((framework) => (
									<DropdownMenuItem
										key={framework}
          disabled={framework !== 'react'}
										onClick={() => actions.setFramework(framework as Framework)}
									>
										{framework.charAt(0).toUpperCase() + framework.slice(1)}
          {framework !== 'react' && <p className="text-primary">soon!</p>}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm">
									{validationSchema.charAt(0).toUpperCase() +
										validationSchema.slice(1)}
									<ChevronDown className="w-4 h-4 ml-1" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								{validationLibs.map((lib) => (
									<DropdownMenuItem
										key={lib}
										onClick={() =>
											actions.setValidationSchema(lib as ValidationSchema)
										}
									>
										{lib.charAt(0).toUpperCase() + lib.slice(1)}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</nav>

					<div className="h-4 w-px bg-border" />
     	{/* <div className="flex justify-center items-center gap-2">
						<Switch
							id={id}
							onClick={() => actions.setIsMS(!isMS)}
							className="data-[state=unchecked]:border-input data-[state=unchecked]:[&_span]:bg-input data-[state=unchecked]:bg-transparent [&_span]:transition-all data-[state=unchecked]:[&_span]:size-4 data-[state=unchecked]:[&_span]:translate-x-0.5 data-[state=unchecked]:[&_span]:shadow-none data-[state=unchecked]:[&_span]:rtl:-translate-x-0.5"
						/>
						<Label htmlFor={id} className="sr-only">
							Field Array
						</Label>
						<p>Field Array</p>
					</div>
					<div className="h-4 w-px bg-border" /> */}
					<div className="flex justify-center items-center gap-2">
						<Switch
							id={id}
							onClick={() => actions.setIsMS(!isMS)}
							className="data-[state=unchecked]:border-input data-[state=unchecked]:[&_span]:bg-input data-[state=unchecked]:bg-transparent [&_span]:transition-all data-[state=unchecked]:[&_span]:size-4 data-[state=unchecked]:[&_span]:translate-x-0.5 data-[state=unchecked]:[&_span]:shadow-none data-[state=unchecked]:[&_span]:rtl:-translate-x-0.5"
						/>
						<Label htmlFor={id} className="sr-only">
							Multi Step Form
						</Label>
						<p>Multi Step Form</p>
					</div>
					<div className="h-4 w-px bg-border" />
					<Button variant="ghost" size="sm" onClick={resetForm}>
						<RotateCcw className="w-4 h-4 mr-1" />
						Reset
					</Button>
					<div className="h-4 w-px bg-border" />
					<Button variant="ghost" size="sm">
						<Upload className="w-4 h-4 mr-1" />
						Import
					</Button>
					<div className="h-4 w-px bg-border" />
					<Button variant="ghost" size="sm">
						<Share className="w-4 h-4 mr-1" />
						Share
					</Button>
					<div className="h-4 w-px bg-border" />
					<Button variant="ghost" size="sm">
						<Save className="w-4 h-4 mr-1" />
						Save
					</Button>
					<div className="h-4 w-px bg-border" />
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="ghost" size="sm">
								<Code className="w-4 h-4 mr-1" />
								Code
							</Button>
						</DialogTrigger>
						<DialogContent className="w-full h-10/12 overflow-y-scroll flex flex-col justify-start">
							<DialogHeader>
								<DialogTitle>Code</DialogTitle>
								<DialogDescription>
									This is the code for the form.
								</DialogDescription>
							</DialogHeader>
							<GeneratedFormCodeViewer />
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{/* Mobile and tablet layout - separate sections */}
			<div className="lg:hidden">
				{/* Main header section - settings/actions */}
				<ScrollArea className="w-full">
					<div className="h-14 border-b flex items-center mx-3 ">
						<div className="flex flex-1 items-center justify-between space-x-2">
							<nav className="flex items-center space-x-2 flex-shrink-0">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="sm">
											{framework.charAt(0).toUpperCase() + framework.slice(1)}
											<ChevronDown className="w-4 h-4 ml-1" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										{frameworks.map((framework) => (
											<DropdownMenuItem
												key={framework}
												onClick={() =>
													actions.setFramework(framework as Framework)
												}
											>
												{framework.charAt(0).toUpperCase() + framework.slice(1)}
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="sm">
											{validationSchema.charAt(0).toUpperCase() +
												validationSchema.slice(1)}
											<ChevronDown className="w-4 h-4 ml-1" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										{validationLibs.map((lib) => (
											<DropdownMenuItem
												key={lib}
												onClick={() =>
													actions.setValidationSchema(lib as ValidationSchema)
												}
											>
												{lib.charAt(0).toUpperCase() + lib.slice(1)}
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
							</nav>
						</div>
						<div className="flex items-center gap-2">
							<div className="h-4 w-px bg-border" />
							<div className="flex justify-center items-center gap-2">
								<Switch
									id={id}
									onClick={() => actions.setIsMS(!isMS)}
									className="data-[state=unchecked]:border-input data-[state=unchecked]:[&_span]:bg-input data-[state=unchecked]:bg-transparent [&_span]:transition-all data-[state=unchecked]:[&_span]:size-4 data-[state=unchecked]:[&_span]:translate-x-0.5 data-[state=unchecked]:[&_span]:shadow-none data-[state=unchecked]:[&_span]:rtl:-translate-x-0.5"
								/>
								<Label htmlFor={id} className="sr-only">
									Multi Step
								</Label>
								<p className="hidden sm:block">Multi Step</p>
								<p className="sm:hidden">MS Form</p>
							</div>
							<div className="h-4 w-px bg-border" />
							<Button variant="ghost" size="sm" onClick={resetForm}>
								<RotateCcw className="w-4 h-4" />
								<span className="hidden sm:inline ml-1">Reset</span>
							</Button>
							<div className="h-4 w-px bg-border" />
							<Button variant="ghost" size="sm">
								<Upload className="w-4 h-4" />
								<span className="hidden sm:inline ml-1">Import</span>
							</Button>
							<div className="h-4 w-px bg-border" />
							<Button variant="ghost" size="sm">
								<Share className="w-4 h-4" />
								<span className="hidden sm:inline ml-1">Share</span>
							</Button>
							<div className="h-4 w-px bg-border" />
							<Button variant="ghost" size="sm">
								<Save className="w-4 h-4" />
								<span className="hidden sm:inline ml-1">Save</span>
							</Button>
							<div className="h-4 w-px bg-border" />
							<Dialog>
								<DialogTrigger asChild>
									<Button variant="ghost" size="sm">
										<Code className="w-4 h-4" />
										<span className="hidden sm:inline ml-1">Code</span>
									</Button>
								</DialogTrigger>
								<DialogContent className="w-full h-10/12 overflow-y-scroll flex flex-col justify-start">
									<DialogHeader>
										<DialogTitle>Code</DialogTitle>
										<DialogDescription>
											This is the code for the form.
										</DialogDescription>
									</DialogHeader>
									<GeneratedFormCodeViewer />
								</DialogContent>
							</Dialog>
							<div className="h-4 w-px bg-border" />
						</div>
					</div>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>

				{/* Tabs section - below on mobile */}
				{isFormBuilder && (
					<div className="border-b mx-3 py-2">
						<Tabs
							value={activeTab}
							onValueChange={handleSubTabChange}
							className="flex"
						>
							<TabsList className="bg-background h-auto -space-x-px p-0 shadow-xs w-full justify-start">
								<TabsTrigger
									value="builder"
									className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s flex-1"
								>
									<FormInput className="-ms-0.5 me-1.5 opacity-60" size={16} />
									Builder
								</TabsTrigger>
								<TabsTrigger
									value="template"
									className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 flex-1"
								>
									<BookMarked className="-ms-0.5 me-1.5 opacity-60" size={16} />
									Template
								</TabsTrigger>
								<TabsTrigger
									value="settings"
									className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 last:rounded-e flex-1"
								>
									<Settings className="-ms-0.5 me-1.5 opacity-60" size={16} />
									Settings
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
				)}
			</div>
		</header>
	);
}
