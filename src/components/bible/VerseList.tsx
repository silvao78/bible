import { Bookmark } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatVerseText } from "@/lib/verseFormatter";

import type { BibleVerse } from "@/lib/bibleApi";

interface VerseListProps {
  verses: BibleVerse[] | undefined;
  versesLoading: boolean;
  bookmarkedVerses: Set<string>;
  selectedBookId: number;
  selectedChapter: number;
  holyWordsEnabled: boolean;
  holyWordsColor: string;
  onToggleBookmark: (verse: BibleVerse) => void;
}

/**
 * Displays a list of Bible verses with bookmark functionality.
 */
const VerseList = ({
  verses,
  versesLoading,
  bookmarkedVerses,
  selectedBookId,
  selectedChapter,
  holyWordsEnabled,
  holyWordsColor,
  onToggleBookmark,
}: VerseListProps) => {
  if (versesLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
    );
  }

  if (!verses || verses.length === 0) {
    return (
      <p className="py-12 text-center font-serif text-muted-foreground italic">
        No verses found for this chapter.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {verses.map((verse: BibleVerse) => {
        const formatted = formatVerseText(verse.text);
        const isBookmarked = bookmarkedVerses.has(
          `${selectedBookId}-${selectedChapter}-${verse.verse}`,
        );
        return (
          <div key={verse.id} className="group flex items-start gap-4">
            <span className="min-w-10 shrink-0 font-bold font-serif text-base text-primary">
              {verse.verse}
            </span>
            <div className="flex-1">
              {formatted.title && (
                <h3 className="mb-2 font-bold font-serif text-primary text-xl">
                  {formatted.title}
                </h3>
              )}
              <p
                className="text-left font-serif text-lg leading-loose"
                style={{
                  color:
                    holyWordsEnabled && verse.is_holy_words
                      ? holyWordsColor
                      : "inherit",
                }}
              >
                {formatted.text}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => onToggleBookmark(verse)}
            >
              <Bookmark
                className={`h-4 w-4 ${isBookmarked ? "fill-current text-primary" : ""}`}
              />
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default VerseList;
