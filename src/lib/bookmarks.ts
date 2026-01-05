import {
  areCollectionsInitialized,
  getBookmarksCollection,
  getUserId,
} from "@/lib/db/collections";

import type { Bookmark } from "@/types/bookmarks";

export type { Bookmark };

export const bookmarksService = {
  getBookmarks(): Bookmark[] {
    if (typeof window === "undefined" || !areCollectionsInitialized())
      return [];

    const userId = getUserId();
    const collection = getBookmarksCollection();
    const allBookmarks = Array.from(collection.state.values());

    return allBookmarks
      .filter((b) => b.user_id === userId)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
  },

  addBookmark(
    versionId: string,
    bookId: number | string,
    chapter: number,
    verse: number,
    note?: string,
    color?: string,
  ): Bookmark {
    const userId = getUserId();
    const bookNum = typeof bookId === "string" ? parseInt(bookId, 10) : bookId;

    const existing = this.getBookmark(versionId, bookNum, chapter, verse);
    if (existing) {
      throw new Error("Bookmark already exists for this verse");
    }

    const now = new Date().toISOString();
    const bookmark: Bookmark = {
      id: crypto.randomUUID(),
      user_id: userId,
      version_id: versionId,
      book_id: bookNum,
      chapter,
      verse,
      note,
      color: color || "#fbbf24",
      created_at: now,
      updated_at: now,
    };

    const collection = getBookmarksCollection();
    collection.insert(bookmark);
    return bookmark;
  },

  updateBookmark(
    id: string,
    updates: { note?: string; color?: string },
  ): Bookmark | null {
    if (!areCollectionsInitialized()) return null;

    const userId = getUserId();
    const collection = getBookmarksCollection();
    const bookmark = collection.state.get(id);

    if (!bookmark || bookmark.user_id !== userId) {
      return null;
    }

    const updated: Bookmark = {
      ...bookmark,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    collection.update([id], (drafts) => {
      const draft = drafts[0];
      if (draft) {
        if (updates.note !== undefined) draft.note = updates.note;
        if (updates.color !== undefined) draft.color = updates.color;
        draft.updated_at = updated.updated_at;
      }
    });
    return updated;
  },

  deleteBookmark(id: string): void {
    if (!areCollectionsInitialized()) return;

    const userId = getUserId();
    const collection = getBookmarksCollection();
    const bookmark = collection.state.get(id);

    if (bookmark && bookmark.user_id === userId) {
      collection.delete(id);
    }
  },

  getBookmark(
    versionId: string,
    bookId: number | string,
    chapter: number,
    verse: number,
  ): Bookmark | null {
    if (typeof window === "undefined" || !areCollectionsInitialized())
      return null;

    const userId = getUserId();
    const bookNum = typeof bookId === "string" ? parseInt(bookId, 10) : bookId;
    const collection = getBookmarksCollection();

    return (
      Array.from(collection.state.values()).find(
        (b) =>
          b.user_id === userId &&
          b.version_id === versionId &&
          b.book_id === bookNum &&
          b.chapter === chapter &&
          b.verse === verse,
      ) || null
    );
  },

  isBookmarked(
    versionId: string,
    bookId: number | string,
    chapter: number,
    verse: number,
  ): boolean {
    return this.getBookmark(versionId, bookId, chapter, verse) !== null;
  },

  exportBookmarks(): string {
    return JSON.stringify(this.getBookmarks(), null, 2);
  },

  importBookmarks(jsonString: string): number {
    const userId = getUserId();
    const imported: Bookmark[] = JSON.parse(jsonString);
    const collection = getBookmarksCollection();

    const now = new Date().toISOString();
    const existingKeys = new Set(
      this.getBookmarks().map(
        (b) => `${b.version_id}-${b.book_id}-${b.chapter}-${b.verse}`,
      ),
    );

    let addedCount = 0;

    for (const b of imported) {
      const key = `${b.version_id}-${b.book_id}-${b.chapter}-${b.verse}`;
      if (!existingKeys.has(key)) {
        const bookmark: Bookmark = {
          ...b,
          id: crypto.randomUUID(),
          user_id: userId,
          created_at: b.created_at || now,
          updated_at: now,
        };
        collection.insert(bookmark);
        addedCount++;
      }
    }

    return addedCount;
  },
};
