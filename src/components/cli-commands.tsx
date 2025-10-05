import CopyButton from "@/components/ui/copy-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsCollection } from "@/db-collections/settings.collections";
import useSettings from "@/hooks/use-settings";
import { updatePreferredPackageManager } from "@/lib/utils";

export default function CliCommands({ name }: { name: string }) {
	const { preferredPackageManager } = useSettings();

	const commands = {
		pnpm: `pnpm dlx shadcn@latest add https://tan-form-builder.baskar.dev/r/${name}.json`,
		npm: `npx shadcn@latest add https://tan-form-builder.baskar.dev/r/${name}.json`,
		yarn: `yarn shadcn@latest add https://tan-form-builder.baskar.dev/r/${name}.json`,
		bun: `bunx --bun shadcn@latest add https://tan-form-builder.baskar.dev/r/${name}.json`,
	};

	return (
		<div className="relative">
			<Tabs
				value={preferredPackageManager}
				onValueChange={(value) =>
					updatePreferredPackageManager(
						value as SettingsCollection["preferredPackageManager"],
					)
				}
				className="rounded-md bg-zinc-950 dark:bg-zinc-900"
			>
				<TabsList className="dark h-auto w-full justify-start rounded-none border-b bg-transparent px-4 py-0">
					<TabsTrigger
						className="data-[state=active]:after:bg-primary relative rounded-none py-3 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
						value="pnpm"
					>
						pnpm
					</TabsTrigger>
					<TabsTrigger
						className="data-[state=active]:after:bg-primary relative rounded-none py-3 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
						value="npm"
					>
						npm
					</TabsTrigger>
					<TabsTrigger
						className="data-[state=active]:after:bg-primary relative rounded-none py-3 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
						value="yarn"
					>
						yarn
					</TabsTrigger>
					<TabsTrigger
						className="data-[state=active]:after:bg-primary relative rounded-none py-3 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
						value="bun"
					>
						bun
					</TabsTrigger>
				</TabsList>
				{Object.entries(commands).map(([pkg, command]) => (
					<TabsContent className="m-0" key={pkg} value={pkg}>
						<div className="relative">
							<pre className="overflow-auto p-4 pr-12 font-mono text-[12.8px] text-zinc-100">
								{command}
							</pre>
							<div className="absolute bg-accent top-2 right-2">
								<CopyButton
									text={
										commands[preferredPackageManager as keyof typeof commands]
									}
								/>
							</div>
						</div>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}
