

import { ModeToggle } from "./mode-toggle";

export default function Header() {
  const _links = [
    { to: "/", label: "Home" },
  ];

  return (
   <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className=" mx-3 flex h-14 items-center">
          <div className="mr-4 flex">
            <h1 className="text-lg font-semibold">TanStack Form Builder</h1>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-2">
             {/* TODO: Add export/import buttons here later */}
            </nav>
          </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
        </div>
      </header>
  );
}
