import type { PsalmQuote } from "@/data/psalmQuotes";

interface PsalmFooterProps {
  quote: PsalmQuote;
  onNavigate: (chapter: number) => void;
}

/**
 * Footer displaying a random Psalm quote that navigates to the passage on click.
 */
const PsalmFooter = ({ quote, onNavigate }: PsalmFooterProps) => (
  <button
    type="button"
    onClick={() => onNavigate(quote.chapter)}
    className="mt-2 shrink-0 cursor-pointer px-3 text-center font-serif text-muted-foreground text-xs italic transition-colors hover:text-foreground sm:mt-3 sm:px-0 sm:text-sm"
    title={`Go to ${quote.ref}`}
  >
    "{quote.text}" — {quote.ref}
  </button>
);

export default PsalmFooter;
