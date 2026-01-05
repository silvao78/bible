import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect } from "react";

import { bibleApi } from "@/lib/bibleApi";

import type { BibleBook } from "@/lib/bibleApi";

interface UseChapterNavigationOptions {
  versionId: string;
  bookId: number;
  chapter: number;
  books: BibleBook[] | undefined;
  currentBook: BibleBook | undefined;
}

interface UseChapterNavigationResult {
  navigateToChapter: (
    newVersion: string,
    newBook: number,
    newChapter: number,
  ) => void;
  handlePreviousChapter: () => void;
  handleNextChapter: () => void;
  goHome: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

/**
 * Hook for chapter navigation logic.
 */
export function useChapterNavigation({
  versionId,
  bookId,
  chapter,
  books,
  currentBook,
}: UseChapterNavigationOptions): UseChapterNavigationResult {
  const navigate = useNavigate();

  // Preload adjacent chapters for faster navigation
  useEffect(() => {
    bibleApi.preloadAdjacentChapters(versionId, bookId, chapter);
  }, [versionId, bookId, chapter]);

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

  const goHome = useCallback(() => {
    navigateToChapter(versionId, 1, 1);
  }, [versionId, navigateToChapter]);

  const hasPrevious =
    chapter > 1 ||
    (books?.findIndex((b: BibleBook) => b.id === bookId) || 0) > 0;

  const hasNext =
    (currentBook && chapter < currentBook.chapters) ||
    (books &&
      books.findIndex((b: BibleBook) => b.id === bookId) < books.length - 1) ||
    false;

  return {
    navigateToChapter,
    handlePreviousChapter,
    handleNextChapter,
    goHome,
    hasPrevious,
    hasNext,
  };
}
