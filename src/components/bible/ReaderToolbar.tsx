import { BookOpen, Maximize2, Search } from "lucide-react";

import { BookmarksList, HotkeyHelp, ThemeToggle } from "@/components/layout";
import { Button } from "@/components/ui/button";
import app from "@/lib/config/app.config";
import SettingsSheet from "./SettingsSheet";

import type { BibleVersion } from "@/lib/bibleApi";

interface ReaderToolbarProps {
  onGoHome: () => void;
  bookmarksOpen: boolean;
  onBookmarksOpenChange: (open: boolean) => void;
  onBookmarkNavigate: (bookId: number, chapter: number) => void;
  hotkeyHelpOpen: boolean;
  onHotkeyHelpOpenChange: (open: boolean) => void;
  onEnterReadingMode: () => void;
  settingsOpen: boolean;
  onSettingsOpenChange: (open: boolean) => void;
  versions: BibleVersion[] | undefined;
  selectedVersionId: string | null;
  onVersionChange: (versionId: string) => void;
  holyWordsEnabled: boolean;
  onHolyWordsEnabledChange: (enabled: boolean) => void;
  holyWordsColor: string;
  onHolyWordsColorChange: (color: string) => void;
}

/**
 * Top toolbar with logo, search, bookmarks, settings, and reading mode controls.
 */
const ReaderToolbar = ({
  onGoHome,
  bookmarksOpen,
  onBookmarksOpenChange,
  onBookmarkNavigate,
  hotkeyHelpOpen,
  onHotkeyHelpOpenChange,
  onEnterReadingMode,
  settingsOpen,
  onSettingsOpenChange,
  versions,
  selectedVersionId,
  onVersionChange,
  holyWordsEnabled,
  onHolyWordsEnabledChange,
  holyWordsColor,
  onHolyWordsColorChange,
}: ReaderToolbarProps) => (
  <div className="mb-2 flex shrink-0 items-center justify-between gap-2 px-2 pt-2 sm:mb-4 sm:py-0">
    <button
      type="button"
      onClick={onGoHome}
      className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80 sm:gap-3"
      title="Go to Genesis 1"
    >
      <BookOpen className="h-8 w-8 text-primary sm:h-10 sm:w-10" />
      <div className="text-left">
        <h1 className="font-bold font-serif text-2xl text-foreground sm:text-4xl">
          {app.name}
        </h1>

        <p className="hidden font-serif text-muted-foreground text-sm italic sm:block">
          The Sacred Scriptures
        </p>
      </div>
    </button>

    <div className="flex shrink-0 gap-1 sm:gap-2">
      <Button
        variant="outline"
        size="icon"
        className="hidden bg-card/80 backdrop-blur-sm sm:inline-flex sm:w-auto sm:gap-2 sm:px-3"
        disabled
        title="Search coming soon"
      >
        <Search className="h-5 w-5" />
        <span className="hidden text-muted-foreground text-xs sm:inline">
          Coming soon
        </span>
      </Button>
      <BookmarksList
        open={bookmarksOpen}
        onOpenChange={onBookmarksOpenChange}
        onNavigate={onBookmarkNavigate}
      />
      <HotkeyHelp open={hotkeyHelpOpen} onOpenChange={onHotkeyHelpOpenChange} />
      <Button
        variant="outline"
        size="icon"
        onClick={onEnterReadingMode}
        className="bg-card/80 backdrop-blur-sm"
        title="Enter reading mode (F)"
      >
        <Maximize2 className="h-5 w-5" />
      </Button>
      <ThemeToggle />
      <SettingsSheet
        open={settingsOpen}
        onOpenChange={onSettingsOpenChange}
        versions={versions}
        selectedVersionId={selectedVersionId}
        onVersionChange={onVersionChange}
        holyWordsEnabled={holyWordsEnabled}
        onHolyWordsEnabledChange={onHolyWordsEnabledChange}
        holyWordsColor={holyWordsColor}
        onHolyWordsColorChange={onHolyWordsColorChange}
      />
    </div>
  </div>
);

export default ReaderToolbar;
