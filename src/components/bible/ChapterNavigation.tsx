import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ChapterNavigationProps {
  selectedChapter: number;
  totalChapters: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  variant?: "primary" | "secondary";
}

/**
 * Navigation controls for moving between Bible chapters.
 */
const ChapterNavigation = ({
  selectedChapter,
  totalChapters,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  variant = "primary",
}: ChapterNavigationProps) => {
  const textColorClass =
    variant === "primary" ? "text-primary-foreground" : "text-foreground";
  const mutedColorClass =
    variant === "primary"
      ? "text-primary-foreground/70"
      : "text-muted-foreground";

  return (
    <div className="flex items-center justify-between gap-2">
      <Button
        variant="secondary"
        onClick={onPrevious}
        disabled={!hasPrevious}
        className="h-9 w-10 shrink-0 gap-1 p-0 font-serif text-sm sm:h-10 sm:w-28 sm:gap-2 sm:px-3 sm:text-base"
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      {totalChapters > 0 ? (
        <div
          className={`min-w-0 text-center font-serif text-sm sm:text-base ${textColorClass}`}
        >
          <span className="hidden sm:inline">Chapter </span>
          {selectedChapter} <span className={mutedColorClass}>of</span>{" "}
          {totalChapters}
        </div>
      ) : (
        <Skeleton className="h-6 w-20 sm:w-24" />
      )}

      <Button
        variant="secondary"
        onClick={onNext}
        disabled={!hasNext}
        className="h-9 w-10 shrink-0 gap-1 p-0 font-serif text-sm sm:h-10 sm:w-28 sm:gap-2 sm:px-3 sm:text-base"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
    </div>
  );
};

export default ChapterNavigation;
