import { useRouter } from "@tanstack/react-router";
import { createContext, use } from "react";

import { setThemeServerFn, themes } from "@/server/functions/theme";

import type { PropsWithChildren } from "react";
import type { Theme } from "@/server/functions/theme";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (val: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Global theme provider.
 */
const ThemeProvider = ({
  children,
  theme,
}: PropsWithChildren<{ theme: Theme }>) => {
  const router = useRouter();

  const setTheme = (val: Theme) =>
    setThemeServerFn({ data: val }).then(() => router.invalidate());

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
};

export { themes };

export const useTheme = () => {
  const val = use(ThemeContext);

  if (!val) throw new Error("`useTheme` called outside of `<ThemeProvider />`");

  return val;
};

export default ThemeProvider;
