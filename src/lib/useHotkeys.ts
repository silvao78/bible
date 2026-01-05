import { useEffect } from "react";

export interface Hotkey {
  key: string;
  description: string;
  action: () => void;
  modifiers?: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
  };
}

export const useHotkeys = (hotkeys: Hotkey[], enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      for (const hotkey of hotkeys) {
        const keyMatch =
          event.key.toLowerCase() === hotkey.key.toLowerCase() ||
          event.code.toLowerCase() === hotkey.key.toLowerCase() ||
          event.code.toLowerCase() === `key${hotkey.key.toLowerCase()}`;

        const ctrlMatch = hotkey.modifiers?.ctrl
          ? event.ctrlKey || event.metaKey
          : !event.ctrlKey && !event.metaKey;
        const altMatch = hotkey.modifiers?.alt ? event.altKey : !event.altKey;
        const shiftMatch = hotkey.modifiers?.shift
          ? event.shiftKey
          : !event.shiftKey;

        if (keyMatch && ctrlMatch && altMatch && shiftMatch) {
          event.preventDefault();
          hotkey.action();
          return;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hotkeys, enabled]);
};
