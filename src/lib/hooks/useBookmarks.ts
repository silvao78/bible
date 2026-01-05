import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { bookmarksService } from "@/lib/bookmarks";
import { onCollectionsReady } from "@/lib/db/collections";

import type { BibleVerse } from "@/lib/bibleApi";

interface UseBookmarksOptions {
  versionId: string;
  bookId: number;
  chapter: number;
  verses: BibleVerse[] | undefined;
}

interface UseBookmarksResult {
  bookmarkedVerses: Set<string>;
  handleToggleBookmark: (verse: BibleVerse) => void;
}

/**
 * Hook for managing verse bookmarks.
 */
export function useBookmarks({
  versionId,
  bookId,
  chapter,
  verses,
}: UseBookmarksOptions): UseBookmarksResult {
  const [bookmarkedVerses, setBookmarkedVerses] = useState<Set<string>>(
    new Set(),
  );

  // Load bookmarks for current chapter
  useEffect(() => {
    const loadBookmarks = () => {
      if (versionId && bookId && verses) {
        const bookmarked = new Set<string>();
        for (const verse of verses) {
          const isBookmarked = bookmarksService.isBookmarked(
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

    // Re-load when collections become ready (handles initial page load race)
    const unsubscribe = onCollectionsReady(() => {
      loadBookmarks();
    });
    return unsubscribe;
  }, [versionId, bookId, chapter, verses]);

  const handleToggleBookmark = useCallback(
    (verse: BibleVerse) => {
      if (!versionId || !bookId) return;

      const key = `${bookId}-${chapter}-${verse.verse}`;
      const isCurrentlyBookmarked = bookmarkedVerses.has(key);

      try {
        if (isCurrentlyBookmarked) {
          const bookmark = bookmarksService.getBookmark(
            versionId,
            bookId,
            chapter,
            verse.verse,
          );
          if (bookmark) {
            bookmarksService.deleteBookmark(bookmark.id);
            setBookmarkedVerses((prev) => {
              const next = new Set(prev);
              next.delete(key);
              return next;
            });
            toast.success("Bookmark removed");
          }
        } else {
          bookmarksService.addBookmark(versionId, bookId, chapter, verse.verse);
          setBookmarkedVerses((prev) => new Set(prev).add(key));
          toast.success("Verse bookmarked");
        }
      } catch (error) {
        toast.error("Failed to update bookmark");
        console.error(error);
      }
    },
    [versionId, bookId, chapter, bookmarkedVerses],
  );

  return {
    bookmarkedVerses,
    handleToggleBookmark,
  };
}
