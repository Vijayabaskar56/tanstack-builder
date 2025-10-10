import { CodeIcon } from "lucide-react";
import { useId } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { tableBuilderCollection } from "@/db-collections/table-builder.collections";
import useTableStore from "@/hooks/use-table-store";
import { AnimatedIconButton } from "./ui/animated-icon-button";
import { RotateCWIcon } from "./ui/rotate-cw";
import { SettingsGearIcon } from "./ui/settings-gear";
import { ShareIcon } from "./ui/share";

export default function TableHeader() {
	const id = useId();
	const tableData = useTableStore();
	const settings = tableData?.settings;

	const handleSettingChange = (key: string, value: boolean) => {
		tableBuilderCollection.update(1, (draft) => {
			if (!draft.settings)
				draft.settings = {
					isGlobalSearch: false,
					enableHiding: true,
					enableSorting: true,
					enableResizing: true,
					enablePinning: true,
					enableColumnFilter: true,
					enableGlobalFilter: true,
				} as any;
			(draft.settings as any)[key] = value;
		});
	};

	const resetTable = () => {
		tableBuilderCollection.update(1, (draft) => {
			draft.table = { data: [], columns: [] };
		});
	};

	return (
		<header className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="flex h-auto lg:h-14 border-b items-center mx-3 flex-col lg:flex-row justify-between">
				{/* Actions section */}
				<ScrollArea className="md:w-fit w-full py-2 order-1 lg:order-2">
					<div className="flex items-center gap-2">
						<div className="h-4 w-px bg-border" />
						<nav className="flex items-center space-x-2">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<AnimatedIconButton
										icon={<SettingsGearIcon className="w-4 h-4 mr-1" />}
										text="Table Settings"
										variant="ghost"
										size="sm"
										iconPosition="start"
									/>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56">
									<div className="p-2 space-y-3">
										<div className="flex items-center justify-between">
											<Label
												htmlFor={`${id}-global-search`}
												className="text-sm font-medium"
											>
												Global Search
											</Label>
											<Switch
												id={`${id}-global-search`}
												checked={settings?.isGlobalSearch ?? false}
												onCheckedChange={(value) =>
													handleSettingChange("isGlobalSearch", value)
												}
											/>
										</div>
										<div className="border-t pt-3">
											<Label className="text-sm font-medium mb-2 block">
												Column Settings
											</Label>
											<div className="space-y-2">
												<div className="flex items-center justify-between">
													<Label htmlFor={`${id}-sorting`} className="text-xs">
														Enable Sorting
													</Label>
													<Switch
														id={`${id}-sorting`}
														checked={settings?.enableSorting ?? true}
														onCheckedChange={(value) =>
															handleSettingChange("enableSorting", value)
														}
													/>
												</div>
												<div className="flex items-center justify-between">
													<Label htmlFor={`${id}-hiding`} className="text-xs">
														Enable Hiding
													</Label>
													<Switch
														id={`${id}-hiding`}
														checked={settings?.enableHiding ?? true}
														onCheckedChange={(value) =>
															handleSettingChange("enableHiding", value)
														}
													/>
												</div>
												<div className="flex items-center justify-between">
													<Label htmlFor={`${id}-resizing`} className="text-xs">
														Enable Resizing
													</Label>
													<Switch
														id={`${id}-resizing`}
														checked={settings?.enableResizing ?? true}
														onCheckedChange={(value) =>
															handleSettingChange("enableResizing", value)
														}
													/>
												</div>
												<div className="flex items-center justify-between">
													<Label htmlFor={`${id}-pinning`} className="text-xs">
														Enable Pinning
													</Label>
													<Switch
														id={`${id}-pinning`}
														checked={settings?.enablePinning ?? true}
														onCheckedChange={(value) =>
															handleSettingChange("enablePinning", value)
														}
													/>
												</div>
												<div className="flex items-center justify-between">
													<Label
														htmlFor={`${id}-column-filter`}
														className="text-xs"
													>
														Enable Column Filter
													</Label>
													<Switch
														id={`${id}-column-filter`}
														checked={settings?.enableColumnFilter ?? true}
														onCheckedChange={(value) =>
															handleSettingChange("enableColumnFilter", value)
														}
													/>
												</div>
												<div className="flex items-center justify-between">
													<Label
														htmlFor={`${id}-global-filter`}
														className="text-xs"
													>
														Enable Global Filter
													</Label>
													<Switch
														id={`${id}-global-filter`}
														checked={settings?.enableGlobalFilter ?? true}
														onCheckedChange={(value) =>
															handleSettingChange("enableGlobalFilter", value)
														}
													/>
												</div>
											</div>
										</div>
									</div>
								</DropdownMenuContent>
							</DropdownMenu>
						</nav>

						<div className="h-4 w-px bg-border" />
						<AnimatedIconButton
							icon={<RotateCWIcon className="w-4 h-4 mr-1" />}
							text={<span className="hidden xl:block ml-1">Reset Table</span>}
							variant="ghost"
							onClick={resetTable}
						/>
						<div className="h-4 w-px bg-border" />
						<AnimatedIconButton
							icon={<ShareIcon className="w-4 h-4 mr-1" />}
							text={<span className="hidden xl:block ml-1">Share</span>}
							variant="ghost"
							disabled
						/>
						<div className="h-4 w-px bg-border" />
						<AnimatedIconButton
							icon={<CodeIcon className="w-4 h-4 mr-1" />}
							text={<span className="hidden xl:block ml-1">Code</span>}
							variant="ghost"
							disabled
						/>
					</div>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</div>
		</header>
	);
}
