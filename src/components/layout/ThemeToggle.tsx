import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/ThemeProvider";

/**
 * Theme toggle button for switching between light and dark modes.
 */
const ThemeToggle = () => {
  const { mode, toggleMode } = useTheme();

  const isDark = mode === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleMode}
      className="bg-card/80 backdrop-blur-sm"
      title={isDark ? "Switch to light mode (T)" : "Switch to dark mode (T)"}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};

export default ThemeToggle;
