import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { themes, useTheme } from "@/providers/ThemeProvider";

/**
 * Theme toggle button for switching between light and dark modes.
 */
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  // Find current theme info and determine if it's dark
  const currentTheme = themes.find((t) => t.value === theme);
  const isDark = currentTheme?.isDark ?? false;

  // Toggle between light and dark themes (cycle within same "family" or default)
  const handleToggle = () => {
    if (isDark) {
      // Switch to first light theme
      const lightTheme = themes.find((t) => !t.isDark);
      if (lightTheme) setTheme(lightTheme.value);
    } else {
      // Switch to first dark theme
      const darkTheme = themes.find((t) => t.isDark);
      if (darkTheme) setTheme(darkTheme.value);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className="bg-card/80 backdrop-blur-sm"
      title={isDark ? "Switch to light mode (T)" : "Switch to dark mode (T)"}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};

export default ThemeToggle;
