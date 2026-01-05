import { createContext, use, useCallback, useEffect, useState } from "react";

import {
  palettes,
  setCustomColorServerFn,
  setFooterVerseEnabledServerFn,
  setModeServerFn,
  setPaletteServerFn,
} from "@/server/functions/theme";

import type { PropsWithChildren } from "react";
import type { ColorPalette, Mode, ThemeState } from "@/server/functions/theme";

interface ThemeContextValue {
  palette: ColorPalette;
  mode: Mode;
  customColor: string | undefined;
  footerVerseEnabled: boolean;
  setPalette: (val: ColorPalette) => void;
  setMode: (val: Mode) => void;
  setCustomColor: (val: string) => void;
  setFooterVerseEnabled: (val: boolean) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const buildThemeClass = (palette: ColorPalette, mode: Mode) =>
  `${palette}${mode === "dark" ? " dark" : ""}`;

const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };

  const r = Number.parseInt(result[1], 16) / 255;
  const g = Number.parseInt(result[2], 16) / 255;
  const b = Number.parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

const applyCustomColor = (hex: string, mode: Mode) => {
  const { h, s, l } = hexToHsl(hex);
  const root = document.documentElement;

  if (mode === "light") {
    root.style.setProperty("--color-background", `hsl(${h} 20% 97%)`);
    root.style.setProperty("--color-foreground", `hsl(${h} 15% 18%)`);
    root.style.setProperty("--color-card", `hsl(${h} 18% 99%)`);
    root.style.setProperty("--color-card-foreground", `hsl(${h} 15% 18%)`);
    root.style.setProperty("--color-popover", `hsl(${h} 18% 99%)`);
    root.style.setProperty("--color-popover-foreground", `hsl(${h} 15% 18%)`);
    root.style.setProperty("--color-primary", `hsl(${h} ${s}% ${l}%)`);
    root.style.setProperty("--color-primary-foreground", `hsl(${h} 20% 98%)`);
    root.style.setProperty("--color-secondary", `hsl(${h} 15% 92%)`);
    root.style.setProperty("--color-secondary-foreground", `hsl(${h} 12% 22%)`);
    root.style.setProperty("--color-muted", `hsl(${h} 12% 90%)`);
    root.style.setProperty("--color-muted-foreground", `hsl(${h} 10% 42%)`);
    root.style.setProperty("--color-accent", `hsl(${h} 40% 90%)`);
    root.style.setProperty(
      "--color-accent-foreground",
      `hsl(${h} ${Math.min(s + 10, 100)}% ${Math.max(l - 10, 30)}%)`,
    );
    root.style.setProperty("--color-border", `hsl(${h} 15% 87%)`);
    root.style.setProperty("--color-input", `hsl(${h} 15% 87%)`);
    root.style.setProperty("--color-ring", `hsl(${h} ${s}% ${l}%)`);
  } else {
    root.style.setProperty("--color-background", `hsl(${h} 22% 10%)`);
    root.style.setProperty("--color-foreground", `hsl(${h} 15% 92%)`);
    root.style.setProperty("--color-card", `hsl(${h} 20% 13%)`);
    root.style.setProperty("--color-card-foreground", `hsl(${h} 15% 92%)`);
    root.style.setProperty("--color-popover", `hsl(${h} 20% 15%)`);
    root.style.setProperty("--color-popover-foreground", `hsl(${h} 15% 92%)`);
    root.style.setProperty(
      "--color-primary",
      `hsl(${h} ${s}% ${Math.min(l + 10, 70)}%)`,
    );
    root.style.setProperty("--color-primary-foreground", `hsl(${h} 22% 10%)`);
    root.style.setProperty("--color-secondary", `hsl(${h} 15% 18%)`);
    root.style.setProperty("--color-secondary-foreground", `hsl(${h} 12% 90%)`);
    root.style.setProperty("--color-muted", `hsl(${h} 12% 16%)`);
    root.style.setProperty("--color-muted-foreground", `hsl(${h} 10% 58%)`);
    root.style.setProperty("--color-accent", `hsl(${h} 40% 22%)`);
    root.style.setProperty(
      "--color-accent-foreground",
      `hsl(${h} ${Math.min(s + 10, 100)}% 72%)`,
    );
    root.style.setProperty("--color-border", `hsl(${h} 15% 20%)`);
    root.style.setProperty("--color-input", `hsl(${h} 15% 20%)`);
    root.style.setProperty(
      "--color-ring",
      `hsl(${h} ${s}% ${Math.min(l + 10, 70)}%)`,
    );
  }
};

const clearCustomStyles = () => {
  const root = document.documentElement;
  const props = [
    "--color-background",
    "--color-foreground",
    "--color-card",
    "--color-card-foreground",
    "--color-popover",
    "--color-popover-foreground",
    "--color-primary",
    "--color-primary-foreground",
    "--color-secondary",
    "--color-secondary-foreground",
    "--color-muted",
    "--color-muted-foreground",
    "--color-accent",
    "--color-accent-foreground",
    "--color-border",
    "--color-input",
    "--color-ring",
  ];
  for (const prop of props) {
    root.style.removeProperty(prop);
  }
};

const ThemeProvider = ({
  children,
  theme: initialTheme,
}: PropsWithChildren<{ theme: ThemeState }>) => {
  const [palette, setPaletteState] = useState<ColorPalette>(
    initialTheme.palette,
  );
  const [mode, setModeState] = useState<Mode>(initialTheme.mode);
  const [customColor, setCustomColorState] = useState<string | undefined>(
    initialTheme.customColor,
  );
  const [footerVerseEnabled, setFooterVerseEnabledState] = useState<boolean>(
    initialTheme.footerVerseEnabled,
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: only run on mount - initialTheme doesn't change after SSR hydration
  useEffect(() => {
    if (initialTheme.palette === "custom" && initialTheme.customColor) {
      applyCustomColor(initialTheme.customColor, initialTheme.mode);
    }
  }, []);

  const setPalette = useCallback(
    (val: ColorPalette) => {
      if (val !== "custom") {
        clearCustomStyles();
      }
      document.documentElement.className = buildThemeClass(val, mode);
      setPaletteState(val);
      setPaletteServerFn({ data: val });
    },
    [mode],
  );

  const setCustomColor = useCallback(
    (val: string) => {
      document.documentElement.className = buildThemeClass("custom", mode);
      applyCustomColor(val, mode);
      setPaletteState("custom");
      setCustomColorState(val);
      setPaletteServerFn({ data: "custom" });
      setCustomColorServerFn({ data: val });
    },
    [mode],
  );

  const setMode = useCallback(
    (val: Mode) => {
      document.documentElement.className = buildThemeClass(palette, val);
      if (palette === "custom" && customColor) {
        applyCustomColor(customColor, val);
      }
      setModeState(val);
      setModeServerFn({ data: val });
    },
    [palette, customColor],
  );

  const toggleMode = useCallback(() => {
    setMode(mode === "light" ? "dark" : "light");
  }, [mode, setMode]);

  const setFooterVerseEnabled = useCallback((val: boolean) => {
    setFooterVerseEnabledState(val);
    setFooterVerseEnabledServerFn({ data: val });
  }, []);

  return (
    <ThemeContext
      value={{
        palette,
        mode,
        customColor,
        footerVerseEnabled,
        setPalette,
        setMode,
        setCustomColor,
        setFooterVerseEnabled,
        toggleMode,
      }}
    >
      {children}
    </ThemeContext>
  );
};

export { palettes };

export const useTheme = () => {
  const val = use(ThemeContext);

  if (!val) throw new Error("`useTheme` called outside of `<ThemeProvider />`");

  return val;
};

export default ThemeProvider;
