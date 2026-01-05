import { useCallback, useMemo } from "react";

import { useHotkeys } from "@/lib/useHotkeys";

import type { Hotkey } from "@/lib/useHotkeys";

interface UseBibleHotkeysOptions {
  readingMode: boolean;
  setReadingMode: (value: boolean | ((prev: boolean) => boolean)) => void;
  handlePreviousChapter: () => void;
  handleNextChapter: () => void;
  scrollUp: () => void;
  scrollDown: () => void;
  toggleMode: () => void;
  setHotkeyHelpOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setBookmarksOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setSettingsOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

/**
 * Hook for Bible reader keyboard shortcuts.
 */
export function useBibleHotkeys({
  readingMode,
  setReadingMode,
  handlePreviousChapter,
  handleNextChapter,
  scrollUp,
  scrollDown,
  toggleMode,
  setHotkeyHelpOpen,
  setBookmarksOpen,
  setSettingsOpen,
}: UseBibleHotkeysOptions): void {
  const toggleReadingMode = useCallback(() => {
    setReadingMode((prev) => !prev);
  }, [setReadingMode]);

  const exitFullscreen = useCallback(() => {
    if (readingMode) {
      setReadingMode(false);
    }
  }, [readingMode, setReadingMode]);

  const hotkeys: Hotkey[] = useMemo(
    () => [
      {
        key: "f",
        description: "Toggle fullscreen reading mode",
        action: toggleReadingMode,
      },
      {
        key: "Escape",
        description: "Exit fullscreen mode",
        action: exitFullscreen,
      },
      {
        key: "ArrowLeft",
        description: "Previous chapter",
        action: handlePreviousChapter,
      },
      {
        key: "ArrowRight",
        description: "Next chapter",
        action: handleNextChapter,
      },
      { key: "ArrowUp", description: "Scroll up", action: scrollUp },
      { key: "ArrowDown", description: "Scroll down", action: scrollDown },
      { key: "w", description: "Scroll up", action: scrollUp },
      { key: "s", description: "Scroll down", action: scrollDown },
      {
        key: "a",
        description: "Previous chapter",
        action: handlePreviousChapter,
      },
      { key: "d", description: "Next chapter", action: handleNextChapter },
      {
        key: "?",
        description: "Show keyboard shortcuts",
        action: () => setHotkeyHelpOpen(true),
        modifiers: { shift: true },
      },
      {
        key: "/",
        description: "Show keyboard shortcuts",
        action: () => setHotkeyHelpOpen(true),
      },
      {
        key: "b",
        description: "Toggle bookmarks",
        action: () => setBookmarksOpen((prev) => !prev),
      },
      {
        key: "o",
        description: "Toggle settings",
        action: () => setSettingsOpen((prev) => !prev),
      },
      {
        key: "t",
        description: "Toggle theme",
        action: toggleMode,
      },
    ],
    [
      toggleReadingMode,
      exitFullscreen,
      handlePreviousChapter,
      handleNextChapter,
      scrollUp,
      scrollDown,
      toggleMode,
      setHotkeyHelpOpen,
      setBookmarksOpen,
      setSettingsOpen,
    ],
  );

  useHotkeys(hotkeys);
}
