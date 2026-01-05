import { Keyboard } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HotkeyHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Keyboard key component styled like a physical key.
 */
const Key = ({ children }: { children: React.ReactNode }) => (
  <kbd className="inline-flex min-w-8 items-center justify-center rounded-md border border-border bg-linear-to-b from-muted to-muted/80 px-2 py-1.5 font-medium font-mono text-foreground text-xs shadow-[0_2px_0_0] shadow-border/50">
    {children}
  </kbd>
);

/**
 * Condensed hotkey shortcuts grouped by action.
 */
const HOTKEY_GROUPS = [
  { description: "Scroll up", keys: ["↑", "W"] },
  { description: "Scroll down", keys: ["↓", "S"] },
  { description: "Previous chapter", keys: ["←", "A"] },
  { description: "Next chapter", keys: ["→", "D"] },
  { description: "Toggle fullscreen", keys: ["F"] },
  { description: "Toggle bookmarks", keys: ["B"] },
  { description: "Toggle settings", keys: ["O"] },
  { description: "Show shortcuts", keys: ["?", "/"] },
];

export const HotkeyHelp = ({ open, onOpenChange }: HotkeyHelpProps) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetTrigger asChild>
      <Button
        variant="outline"
        size="icon"
        className="bg-card/80 backdrop-blur-sm"
        title="Keyboard shortcuts (?)"
      >
        <Keyboard className="h-5 w-5" />
      </Button>
    </SheetTrigger>
    <SheetContent side="right" className="w-full sm:max-w-md">
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2 font-serif">
          <Keyboard className="h-5 w-5" />
          Keyboard Shortcuts
        </SheetTitle>
        <SheetDescription>Use these keys to navigate quickly</SheetDescription>
      </SheetHeader>

      <div className="mt-6 space-y-2">
        {HOTKEY_GROUPS.map((group) => (
          <div
            key={group.description}
            className="flex items-center justify-between rounded-lg border border-border p-3"
          >
            <span className="text-foreground text-sm">{group.description}</span>
            <div className="flex items-center gap-1.5">
              {group.keys.map((key, i) => (
                <span key={key} className="flex items-center gap-1.5">
                  {i > 0 && (
                    <span className="text-muted-foreground text-xs">or</span>
                  )}
                  <Key>{key}</Key>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg bg-muted p-4">
        <p className="text-muted-foreground text-sm">
          Press <Key>?</Key> or <Key>/</Key> anytime to show this help
        </p>
      </div>
    </SheetContent>
  </Sheet>
);
