import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";

// Color palettes (base colors)
export type ColorPalette =
  | "sage" // Warm neutral with sage accent
  | "saguaro" // High desert - warm sand with cactus green
  | "canyon" // High desert - terracotta and sandstone
  | "pinyon" // Nature - forest greens and earth tones
  | "mesa" // High desert sunset - warm oranges and purples
  | "juniper" // Nature - muted blue-greens and stone
  | "chaparral"; // Nature - golden browns and olive

export type Mode = "light" | "dark";

export interface ThemeState {
  palette: ColorPalette;
  mode: Mode;
}

export const palettes: { value: ColorPalette; label: string }[] = [
  { value: "sage", label: "Sage" },
  { value: "saguaro", label: "Saguaro" },
  { value: "canyon", label: "Canyon" },
  { value: "pinyon", label: "Pinyon" },
  { value: "mesa", label: "Mesa" },
  { value: "juniper", label: "Juniper" },
  { value: "chaparral", label: "Chaparral" },
];

const PALETTE_COOKIE = "bible-palette";
const MODE_COOKIE = "bible-mode";

/**
 * Get the current theme state from cookies.
 */
export const getThemeServerFn = createServerFn().handler(async () => ({
  palette: (getCookie(PALETTE_COOKIE) || "sage") as ColorPalette,
  mode: (getCookie(MODE_COOKIE) || "light") as Mode,
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
