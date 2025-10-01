import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useThemeAnimation } from "@space-man/react-theme-animation";

export function ModeToggle() {
  const { ref, switchTheme, resolvedTheme } = useThemeAnimation();

  const handleToggleTheme = async () => {
    // Toggle between light and dark
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    await switchTheme(newTheme);
  };

  return (
    <Button ref={ref} variant="outline" size="icon" onClick={handleToggleTheme}>
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
