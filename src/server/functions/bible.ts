import { createServerFn } from "@tanstack/react-start";

import { bibleApi } from "@/lib/bibleApi";

/**
 * Server function to fetch Bible versions.
 */
export const getVersionsServerFn = createServerFn().handler(async () => {
  return bibleApi.getVersions();
});

/**
 * Server function to fetch Bible books.
 */
export const getBooksServerFn = createServerFn().handler(async () => {
  return bibleApi.getBooks();
});

/**
 * Server function to fetch a Bible chapter.
 */
export const getChapterServerFn = createServerFn()
  .inputValidator(
    (data: { versionId: string; bookId: number; chapter: number }) => data,
  )
  .handler(async ({ data }) => {
    return bibleApi.getChapter(data.versionId, data.bookId, data.chapter);
  });
