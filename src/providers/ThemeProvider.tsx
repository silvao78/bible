import { createContext, use, useCallback, useState } from "react";

import {
  palettes,
  setModeServerFn,
  setPaletteServerFn,
} from "@/server/functions/theme";

import type { PropsWithChildren } from "react";
import type { ColorPalette, Mode, ThemeState } from "@/server/functions/theme";

interface ThemeContextValue {
  palette: ColorPalette;
  mode: Mode;
  setPalette: (val: ColorPalette) => void;
  setMode: (val: Mode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Build the class string for the html element.
 */
const buildThemeClass = (palette: ColorPalette, mode: Mode) =>
  `${palette}${mode === "dark" ? " dark" : ""}`;

/**
 * Global theme provider.
 */
const ThemeProvider = ({
  children,
  theme: initialTheme,
}: PropsWithChildren<{ theme: ThemeState }>) => {
  const [palette, setPaletteState] = useState<ColorPalette>(
    initialTheme.palette,
  );
  const [mode, setModeState] = useState<Mode>(initialTheme.mode);

  const setPalette = useCallback(
    (val: ColorPalette) => {
      // Update DOM immediately for instant visual feedback
      document.documentElement.className = buildThemeClass(val, mode);

      setPaletteState(val);

      // Persist to server in background (non-blocking)
      setPaletteServerFn({ data: val });
    },
    [mode],
  );

  const setMode = useCallback(
    (val: Mode) => {
      // Update DOM immediately for instant visual feedback
      document.documentElement.className = buildThemeClass(palette, val);

      setModeState(val);

      // Persist to server in background (non-blocking)
      setModeServerFn({ data: val });
    },
    [palette],
  );

  const toggleMode = useCallback(() => {
    setMode(mode === "light" ? "dark" : "light");
  }, [mode, setMode]);

  return (
    <ThemeContext
      value={{
        palette,
        mode,
        setPalette,
        setMode,
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
