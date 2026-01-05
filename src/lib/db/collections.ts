import { createCollection } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";

import type { QueryClient } from "@tanstack/react-query";
import type { BibleVerse } from "@/types/bible";
import type { Bookmark } from "@/types/bookmarks";

// Storage keys
const BOOKMARKS_KEY = "bible-bookmarks-db";
const PREFERENCES_KEY = "bible-preferences-db";
const CHAPTER_CACHE_KEY = "bible-chapter-cache-db";
const USER_ID_KEY = "bible-user-id";

/**
 * User preferences stored in the database.
 */
export interface UserPreferences {
  id: string;
  selectedVersionId: string | null;
  selectedBookId: number | null;
  selectedChapter: number;
  scrollPosition: number;
  holyWordsEnabled: boolean;
  holyWordsColor: string;
  theme: "light" | "dark" | "system";
  lastUpdated: string;
}

/**
 * Bible chapter cache entry.
 */
export interface CachedChapter {
  id: string;
  versionId: string;
  bookId: number;
  chapter: number;
  verses: BibleVerse[];
  cachedAt: string;
}

/**
 * Get or create anonymous user ID.
 */
export function getUserId(): string {
  if (typeof window === "undefined") return "anon-server";

  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = `anon-${crypto.randomUUID()}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

/**
 * Load data from localStorage.
 */
function loadFromStorage<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
      return Object.values(parsed);
    }
  } catch {
    // Ignore parse errors
  }
  return [];
}

/**
 * Save data to localStorage.
 */
function saveToStorage<T>(key: string, items: T[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Create bookmarks collection.
 */
export function createBookmarksCollection(queryClient: QueryClient) {
  return createCollection<Bookmark, string>(
    queryCollectionOptions({
      id: "bookmarks",
      queryKey: ["bookmarks"],
      queryClient,
      getKey: (item) => item.id,
      queryFn: async () => loadFromStorage<Bookmark>(BOOKMARKS_KEY),
      onInsert: async ({ collection }) => {
        const items = Array.from(collection.state.values());
        saveToStorage(BOOKMARKS_KEY, items);
        return { refetch: false };
      },
      onUpdate: async ({ collection }) => {
        const items = Array.from(collection.state.values());
        saveToStorage(BOOKMARKS_KEY, items);
        return { refetch: false };
      },
      onDelete: async ({ collection }) => {
        const items = Array.from(collection.state.values());
        saveToStorage(BOOKMARKS_KEY, items);
        return { refetch: false };
      },
    }),
  );
}

/**
 * Create preferences collection.
 */
export function createPreferencesCollection(queryClient: QueryClient) {
  return createCollection<UserPreferences, string>(
    queryCollectionOptions({
      id: "preferences",
      queryKey: ["preferences"],
      queryClient,
      getKey: (item) => item.id,
      queryFn: async () => loadFromStorage<UserPreferences>(PREFERENCES_KEY),
      onInsert: async ({ collection }) => {
        const items = Array.from(collection.state.values());
        saveToStorage(PREFERENCES_KEY, items);
        return { refetch: false };
      },
      onUpdate: async ({ collection }) => {
        const items = Array.from(collection.state.values());
        saveToStorage(PREFERENCES_KEY, items);
        return { refetch: false };
      },
      onDelete: async ({ collection }) => {
        const items = Array.from(collection.state.values());
        saveToStorage(PREFERENCES_KEY, items);
        return { refetch: false };
      },
    }),
  );
}

/**
 * Create chapter cache collection.
 */
export function createChapterCacheCollection(queryClient: QueryClient) {
  return createCollection<CachedChapter, string>(
    queryCollectionOptions({
      id: "chapter-cache",
      queryKey: ["chapter-cache"],
      queryClient,
      getKey: (item) => item.id,
      queryFn: async () => loadFromStorage<CachedChapter>(CHAPTER_CACHE_KEY),
      onInsert: async ({ collection }) => {
        const items = Array.from(collection.state.values());
        saveToStorage(CHAPTER_CACHE_KEY, items);
        return { refetch: false };
      },
      onUpdate: async ({ collection }) => {
        const items = Array.from(collection.state.values());
        saveToStorage(CHAPTER_CACHE_KEY, items);
        return { refetch: false };
      },
      onDelete: async ({ collection }) => {
        const items = Array.from(collection.state.values());
        saveToStorage(CHAPTER_CACHE_KEY, items);
        return { refetch: false };
      },
    }),
  );
}

// Collection types
export type BookmarksCollection = ReturnType<typeof createBookmarksCollection>;
export type PreferencesCollection = ReturnType<
  typeof createPreferencesCollection
>;
export type ChapterCacheCollection = ReturnType<
  typeof createChapterCacheCollection
>;

// Global collection instances
let bookmarksCollection: BookmarksCollection | null = null;
let preferencesCollection: PreferencesCollection | null = null;
let chapterCacheCollection: ChapterCacheCollection | null = null;

/**
 * Initialize all collections with a QueryClient.
 * Must be called once at app startup.
 */
export function initializeCollections(queryClient: QueryClient): void {
  if (typeof window === "undefined") return;

  bookmarksCollection = createBookmarksCollection(queryClient);
  preferencesCollection = createPreferencesCollection(queryClient);
  chapterCacheCollection = createChapterCacheCollection(queryClient);
}

/**
 * Get the bookmarks collection.
 */
export function getBookmarksCollection(): BookmarksCollection {
  if (!bookmarksCollection) {
    throw new Error("Collections not initialized");
  }
  return bookmarksCollection;
}

/**
 * Get the preferences collection.
 */
export function getPreferencesCollection(): PreferencesCollection {
  if (!preferencesCollection) {
    throw new Error("Collections not initialized");
  }
  return preferencesCollection;
}

/**
 * Get the chapter cache collection.
 */
export function getChapterCacheCollection(): ChapterCacheCollection {
  if (!chapterCacheCollection) {
    throw new Error("Collections not initialized");
  }
  return chapterCacheCollection;
}

/**
 * Check if collections are initialized.
 */
export function areCollectionsInitialized(): boolean {
  return bookmarksCollection !== null;
}
