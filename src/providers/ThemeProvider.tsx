import { useRouter } from "@tanstack/react-router";
import { createContext, use } from "react";

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
 * Global theme provider.
 */
const ThemeProvider = ({
  children,
  theme,
}: PropsWithChildren<{ theme: ThemeState }>) => {
  const router = useRouter();

  const setPalette = (val: ColorPalette) =>
    setPaletteServerFn({ data: val }).then(() => router.invalidate());

  const setMode = (val: Mode) =>
    setModeServerFn({ data: val }).then(() => router.invalidate());

  const toggleMode = () => setMode(theme.mode === "light" ? "dark" : "light");

  return (
    <ThemeContext
      value={{
        palette: theme.palette,
        mode: theme.mode,
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
