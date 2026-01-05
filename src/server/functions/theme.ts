import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";

export type Theme =
  | "sage" // Current light theme - warm neutral with sage accent
  | "slate" // Current dark theme - deep slate with sage accent
  | "saguaro" // High desert - warm sand with cactus green
  | "canyon" // High desert - terracotta and sandstone
  | "pinyon" // Nature - forest greens and earth tones
  | "mesa" // High desert sunset - warm oranges and purples
  | "juniper" // Nature - muted blue-greens and stone
  | "chaparral"; // Nature - golden browns and olive

export const themes: { value: Theme; label: string; isDark: boolean }[] = [
  { value: "sage", label: "Sage", isDark: false },
  { value: "slate", label: "Slate", isDark: true },
  { value: "saguaro", label: "Saguaro", isDark: false },
  { value: "canyon", label: "Canyon", isDark: true },
  { value: "pinyon", label: "Pinyon", isDark: false },
  { value: "mesa", label: "Mesa", isDark: true },
  { value: "juniper", label: "Juniper", isDark: false },
  { value: "chaparral", label: "Chaparral", isDark: true },
];

const THEME_COOKIE = "bible-theme";

/**
 * Get the current theme from cookies.
 */
export const getThemeServerFn = createServerFn().handler(
  async () => (getCookie(THEME_COOKIE) || "sage") as Theme,
);

/**
 * Set the theme in cookies.
 */
export const setThemeServerFn = createServerFn({ method: "POST" })
  .inputValidator((data: Theme) => data)
  .handler(async ({ data }) => setCookie(THEME_COOKIE, data));
