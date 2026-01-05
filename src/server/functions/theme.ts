import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";

export type ColorPalette =
  | "sage"
  | "ocean"
  | "canyon"
  | "violet"
  | "mesa"
  | "juniper"
  | "rose"
  | "custom";

export type Mode = "light" | "dark";

export interface ThemeState {
  palette: ColorPalette;
  mode: Mode;
  customColor?: string;
  footerVerseEnabled: boolean;
}

export const palettes: { value: ColorPalette; label: string }[] = [
  { value: "sage", label: "Sage" },
  { value: "ocean", label: "Ocean" },
  { value: "canyon", label: "Canyon" },
  { value: "violet", label: "Violet" },
  { value: "mesa", label: "Mesa" },
  { value: "juniper", label: "Juniper" },
  { value: "rose", label: "Rose" },
];

const PALETTE_COOKIE = "bible-palette";
const MODE_COOKIE = "bible-mode";
const CUSTOM_COLOR_COOKIE = "bible-custom-color";
const FOOTER_VERSE_COOKIE = "bible-footer-verse";

/**
 * Get the current theme state from cookies.
 */
export const getThemeServerFn = createServerFn().handler(async () => ({
  palette: (getCookie(PALETTE_COOKIE) || "sage") as ColorPalette,
  mode: (getCookie(MODE_COOKIE) || "light") as Mode,
  customColor: getCookie(CUSTOM_COLOR_COOKIE) || undefined,
  footerVerseEnabled: getCookie(FOOTER_VERSE_COOKIE) !== "false",
}));

/**
 * Set the color palette in cookies.
 */
export const setPaletteServerFn = createServerFn({ method: "POST" })
  .inputValidator((data: ColorPalette) => data)
  .handler(async ({ data }) => setCookie(PALETTE_COOKIE, data));

/**
 * Set the mode (light/dark) in cookies.
 */
export const setModeServerFn = createServerFn({ method: "POST" })
  .inputValidator((data: Mode) => data)
  .handler(async ({ data }) => setCookie(MODE_COOKIE, data));

/**
 * Set the custom color in cookies.
 */
export const setCustomColorServerFn = createServerFn({ method: "POST" })
  .inputValidator((data: string) => data)
  .handler(async ({ data }) => setCookie(CUSTOM_COLOR_COOKIE, data));

/**
 * Set the footer verse enabled state in cookies.
 */
export const setFooterVerseEnabledServerFn = createServerFn({ method: "POST" })
  .inputValidator((data: boolean) => data)
  .handler(async ({ data }) => setCookie(FOOTER_VERSE_COOKIE, String(data)));
