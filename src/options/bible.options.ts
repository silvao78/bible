import { queryOptions } from "@tanstack/react-query";

import { bibleApi } from "@/lib/bibleApi";

/**
 * Query options for fetching Bible versions.
 */
export const versionsOptions = () =>
  queryOptions({
    queryKey: ["bible", "versions"],
    queryFn: () => bibleApi.getVersions(),
  });

/**
 * Query options for fetching Bible books.
 */
export const booksOptions = () =>
  queryOptions({
    queryKey: ["bible", "books"],
    queryFn: () => bibleApi.getBooks(),
  });

/**
 * Query options for fetching a Bible chapter.
 */
export const chapterOptions = (
  versionId: string | null,
  bookId: number | null,
  chapter: number | null,
) =>
  queryOptions({
    queryKey: ["bible", "chapter", versionId, bookId, chapter],
    queryFn: () => {
      if (!versionId || !bookId || chapter === null) {
        return Promise.resolve([]);
      }
      return bibleApi.getChapter(versionId, bookId, chapter);
    },
    enabled: !!versionId && !!bookId && chapter !== null,
  });
