import { useLocation, useNavigate } from "@tanstack/react-router";
import {
	BookMarked,
	ChevronDown,
	Code,
	FormInput,
	MoonIcon,
	RotateCcw,
	Save,
	Settings,
	Share,
	SunIcon,
	Upload,
} from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFormBuilder } from "@/hooks/use-form-builder";
import { useFormStore } from "@/hooks/use-form-store";

export default function Header() {
	const _links = [{ to: "/", label: "Home" }];

	const navigate = useNavigate();
	const location = useLocation();

	const [selectedFramework, setSelectedFramework] = useState("React");
	const [selectedValidation, setSelectedValidation] = useState("Zod");

	const frameworks = ["React", "Vue", "Angular", "Solid"];
	const validationLibs = ["Zod", "Valibot", "ArkType"];

	const isFormBuilder = location.pathname.startsWith("/form-builder");
	const currentSubTab = location.pathname.split("/").pop() || "builder";

	const handleSubTabChange = (newSubTab: string) => {
		navigate({
			to: `/form-builder/${newSubTab}`,
			replace: true,
		});
	};
	const id = useId();
	const { actions, isMS } = useFormStore();
	const { resetForm} = useFormBuilder();
	return (
		<header className="w-full h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="mx-3 flex h-14 items-center">
				<div className="mr-4 flex">
					{isFormBuilder && (
						<Tabs
							value={currentSubTab}
							onValueChange={handleSubTabChange}
							className="flex"
						>
							<TabsList className="bg-background h-auto -space-x-px p-0 shadow-xs">
								<TabsTrigger
									value="builder"
									className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s"
								>
									<FormInput className="-ms-0.5 me-1.5 opacity-60" size={16} />
									Builder
								</TabsTrigger>
								<TabsTrigger
									value="template"
									className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5"
								>
									<BookMarked className="-ms-0.5 me-1.5 opacity-60" size={16} />
									Template
								</TabsTrigger>
								<TabsTrigger
									value="settings"
									className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 last:rounded-e"
								>
									<Settings className="-ms-0.5 me-1.5 opacity-60" size={16} />
									Settings
								</TabsTrigger>
							</TabsList>
						</Tabs>
					)}
				</div>
				<div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
					<nav className="flex items-center space-x-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm">
									{selectedFramework}
									<ChevronDown className="w-4 h-4 ml-1" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								{frameworks.map((framework) => (
									<DropdownMenuItem
										key={framework}
										onClick={() => setSelectedFramework(framework)}
									>
										{framework}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm">
									{selectedValidation}
									<ChevronDown className="w-4 h-4 ml-1" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								{validationLibs.map((lib) => (
									<DropdownMenuItem
										key={lib}
										onClick={() => setSelectedValidation(lib)}
									>
										{lib}
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
					<Button variant="ghost" size="sm">
						<Code className="w-4 h-4 mr-1" />
						Code
					</Button>
					<div className="h-4 w-px bg-border" />
				</div>
			</div>
		</header>
	);
}
