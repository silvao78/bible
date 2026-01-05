import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import {
  PsalmFooter,
  ReaderContent,
  ReaderToolbar,
  ReadingModeView,
} from "@/components/bible";
import { bibleApi } from "@/lib/bibleApi";
import { bookmarksService } from "@/lib/bookmarks";
import { useHotkeys } from "@/lib/useHotkeys";
import { userPreferencesService } from "@/lib/userPreferences";
import {
  booksOptions,
  chapterOptions,
  versionsOptions,
} from "@/options/bible.options";
import { useTheme } from "@/providers/ThemeProvider";

import type { PsalmQuote } from "@/data/psalmQuotes";
import type { BibleBook, BibleVerse, BibleVersion } from "@/lib/bibleApi";
import type { Hotkey } from "@/lib/useHotkeys";

export interface BibleReaderRouteProps {
  versionId: string;
  bookId: number;
  chapter: number;
  readingMode: boolean;
  setReadingMode: (value: boolean | ((prev: boolean) => boolean)) => void;
  psalmQuote: PsalmQuote;
}

function BibleReaderRoute({
  versionId,
  bookId,
  chapter,
  readingMode,
  setReadingMode,
  psalmQuote,
}: BibleReaderRouteProps) {
  const navigate = useNavigate();
  const { toggleMode } = useTheme();

  // Use suspense queries for reactive data
  const { data: versions } = useSuspenseQuery(versionsOptions());
  const { data: books } = useSuspenseQuery(booksOptions());
  const { data: verses } = useSuspenseQuery(
    chapterOptions(versionId, bookId, chapter),
  );
  const [holyWordsEnabled, setHolyWordsEnabled] = useState(true);
  const [holyWordsColor, setHolyWordsColor] = useState("#dc2626");
  const [bookmarkedVerses, setBookmarkedVerses] = useState<Set<string>>(
    new Set(),
  );
  const [hotkeyHelpOpen, setHotkeyHelpOpen] = useState(false);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInitialLoadRef = useRef(true);

  const currentBook = books?.find((b: BibleBook) => b.id === bookId);
  const currentVersion = versions?.find(
    (v: BibleVersion) => v.id === versionId,
  );

  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      const preferences = await userPreferencesService.getPreferences();
      setHolyWordsEnabled(preferences.holyWordsEnabled);
      setHolyWordsColor(preferences.holyWordsColor);
    };
    loadPreferences();
  }, []);

  // Preload adjacent chapters for faster navigation
  useEffect(() => {
    bibleApi.preloadAdjacentChapters(versionId, bookId, chapter);
  }, [versionId, bookId, chapter]);

  // Scroll handling
  // biome-ignore lint/correctness/useExhaustiveDependencies: verses triggers scroll reset on chapter load
  useEffect(() => {
    const handleScroll = async () => {
      if (!scrollContainerRef.current) return;

      if (isInitialLoadRef.current) {
        const preferences = await userPreferencesService.getPreferences();
        if (
          preferences.scrollPosition &&
          preferences.selectedBookId === bookId &&
          preferences.selectedChapter === chapter
        ) {
          scrollContainerRef.current.scrollTop = preferences.scrollPosition;
        } else {
          scrollContainerRef.current.scrollTop = 0;
        }
        isInitialLoadRef.current = false;
      } else {
        scrollContainerRef.current.scrollTop = 0;
      }
    };
    handleScroll();
  }, [bookId, chapter, verses]);

  // Save scroll position on scroll
  useEffect(() => {
    const saveScroll = () => {
      if (scrollContainerRef.current) {
        userPreferencesService.savePreferences({
          scrollPosition: scrollContainerRef.current.scrollTop,
        });
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", saveScroll);
      return () => container.removeEventListener("scroll", saveScroll);
    }
  }, []);

  // Save preferences when state changes
  useEffect(() => {
    userPreferencesService.savePreferences({
      selectedVersionId: versionId,
      selectedBookId: bookId,
      selectedChapter: chapter,
      holyWordsEnabled,
      holyWordsColor,
    });
  }, [versionId, bookId, chapter, holyWordsEnabled, holyWordsColor]);

  // Load bookmarks for current chapter
  useEffect(() => {
    const loadBookmarks = async () => {
      if (versionId && bookId && verses) {
        const bookmarked = new Set<string>();
        for (const verse of verses) {
          const isBookmarked = await bookmarksService.isBookmarked(
            versionId,
            bookId,
            chapter,
            verse.verse,
          );
          if (isBookmarked) {
            bookmarked.add(`${bookId}-${chapter}-${verse.verse}`);
          }
        }
        setBookmarkedVerses(bookmarked);
      }
    };
    loadBookmarks();
  }, [versionId, bookId, chapter, verses]);

  const handleToggleBookmark = async (verse: BibleVerse) => {
    if (!versionId || !bookId) return;

    const key = `${bookId}-${chapter}-${verse.verse}`;
    const isCurrentlyBookmarked = bookmarkedVerses.has(key);

    try {
      if (isCurrentlyBookmarked) {
        const bookmark = await bookmarksService.getBookmark(
          versionId,
          bookId,
          chapter,
          verse.verse,
        );
        if (bookmark) {
          await bookmarksService.deleteBookmark(bookmark.id);
          setBookmarkedVerses((prev) => {
            const next = new Set(prev);
            next.delete(key);
            return next;
          });
          toast.success("Bookmark removed");
        }
      } else {
        await bookmarksService.addBookmark(
          versionId,
          bookId,
          chapter,
          verse.verse,
        );
        setBookmarkedVerses((prev) => new Set(prev).add(key));
        toast.success("Verse bookmarked");
      }
    } catch (error) {
      toast.error("Failed to update bookmark");
      console.error(error);
    }
  };

  const navigateToChapter = useCallback(
    (newVersion: string, newBook: number, newChapter: number) => {
      navigate({
        to: "/$version/$book/$chapter",
        params: {
          version: newVersion,
          book: String(newBook),
          chapter: String(newChapter),
        },
        search: (prev) => prev,
      });
    },
    [navigate],
  );

  const handlePreviousChapter = useCallback(() => {
    if (chapter > 1) {
      navigateToChapter(versionId, bookId, chapter - 1);
    } else if (currentBook && books) {
      const currentIndex = books.findIndex((b: BibleBook) => b.id === bookId);
      if (currentIndex > 0) {
        const prevBook = books[currentIndex - 1];
        navigateToChapter(versionId, prevBook.id, prevBook.chapters);
      }
    }
  }, [chapter, currentBook, books, bookId, versionId, navigateToChapter]);

  const handleNextChapter = useCallback(() => {
    if (currentBook && chapter < currentBook.chapters) {
      navigateToChapter(versionId, bookId, chapter + 1);
    } else if (books) {
      const currentIndex = books.findIndex((b: BibleBook) => b.id === bookId);
      if (currentIndex < books.length - 1) {
        const nextBook = books[currentIndex + 1];
        navigateToChapter(versionId, nextBook.id, 1);
      }
    }
  }, [currentBook, chapter, books, bookId, versionId, navigateToChapter]);

  const toggleReadingMode = useCallback(() => {
    setReadingMode((prev) => !prev);
  }, [setReadingMode]);

  const goHome = useCallback(() => {
    navigateToChapter(versionId, 1, 1);
  }, [versionId, navigateToChapter]);

  const SCROLL_AMOUNT = 200;

  const scrollUp = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (container.scrollTop <= 0) {
      handlePreviousChapter();
    } else {
      container.scrollTop -= SCROLL_AMOUNT;
    }
  }, [handlePreviousChapter]);

  const scrollDown = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const isAtBottom =
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 1;

    if (isAtBottom) {
      handleNextChapter();
    } else {
      container.scrollTop += SCROLL_AMOUNT;
    }
  }, [handleNextChapter]);

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
    ],
  );

  useHotkeys(hotkeys);

  const hasPrevious =
    chapter > 1 ||
    (books?.findIndex((b: BibleBook) => b.id === bookId) || 0) > 0;
  const hasNext =
    (currentBook && chapter < currentBook.chapters) ||
    (books &&
      books.findIndex((b: BibleBook) => b.id === bookId) < books.length - 1);

  return (
    <>
      <ReadingModeView
        isOpen={readingMode && !!currentBook && !!currentVersion && !!bookId}
        bookName={currentBook?.name ?? ""}
        chapter={chapter}
        versionCode={currentVersion?.code ?? ""}
        verses={verses}
        versesLoading={false}
        bookmarkedVerses={bookmarkedVerses}
        selectedBookId={bookId ?? 0}
        totalChapters={currentBook?.chapters ?? 0}
        hasPrevious={hasPrevious}
        hasNext={hasNext ?? false}
        holyWordsEnabled={holyWordsEnabled}
        holyWordsColor={holyWordsColor}
        scrollContainerRef={scrollContainerRef}
        onExitReadingMode={() => setReadingMode(false)}
        onPreviousChapter={handlePreviousChapter}
        onNextChapter={handleNextChapter}
        onToggleBookmark={handleToggleBookmark}
      />
      <div className="flex h-full flex-col bg-background px-0 py-3 sm:p-4 md:p-6">
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-hidden">
          <ReaderToolbar
            onGoHome={goHome}
            bookmarksOpen={bookmarksOpen}
            onBookmarksOpenChange={setBookmarksOpen}
            onBookmarkNavigate={(navBookId, navChapter) => {
              navigateToChapter(versionId, navBookId, navChapter);
            }}
            hotkeyHelpOpen={hotkeyHelpOpen}
            onHotkeyHelpOpenChange={setHotkeyHelpOpen}
            onEnterReadingMode={() => setReadingMode(true)}
            settingsOpen={settingsOpen}
            onSettingsOpenChange={setSettingsOpen}
            versions={versions}
            selectedVersionId={versionId}
            onVersionChange={(newVersionId) => {
              if (newVersionId) {
                navigateToChapter(newVersionId, bookId, chapter);
              }
            }}
            holyWordsEnabled={holyWordsEnabled}
            onHolyWordsEnabledChange={setHolyWordsEnabled}
            holyWordsColor={holyWordsColor}
            onHolyWordsColorChange={setHolyWordsColor}
          />

          <ReaderContent
            books={books}
            selectedBookId={bookId}
            selectedChapter={chapter}
            onBookChange={(newBookId) => {
              navigateToChapter(versionId, newBookId, 1);
            }}
            onChapterChange={(newChapter) => {
              navigateToChapter(versionId, bookId, newChapter);
            }}
            currentBook={currentBook}
            currentVersionCode={currentVersion?.code}
            verses={verses}
            versesLoading={false}
            bookmarkedVerses={bookmarkedVerses}
            holyWordsEnabled={holyWordsEnabled}
            holyWordsColor={holyWordsColor}
            onToggleBookmark={handleToggleBookmark}
            totalChapters={currentBook?.chapters || 0}
            hasPrevious={hasPrevious}
            hasNext={hasNext ?? false}
            onPrevious={handlePreviousChapter}
            onNext={handleNextChapter}
            scrollContainerRef={scrollContainerRef}
          />

          <PsalmFooter
            quote={psalmQuote}
            onNavigate={(navChapter) => {
              navigateToChapter(versionId, 19, navChapter); // Psalms = book 19
            }}
          />
        </div>
      </div>
    </>
  );
}

export default BibleReaderRoute;
