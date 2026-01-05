export interface FormattedVerse {
  title?: string;
  text: string;
  footnotes?: string[];
}

/**
 * Remove Strong's concordance numbers from verse text.
 * Strong's numbers appear as <S>1234</S> tags in the raw data.
 */
const removeStrongsNumbers = (text: string): string =>
  text
    .replace(/<S>\d+<\/S>/g, "")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Extract footnotes from verse text.
 * Footnotes appear as <sup>text</sup> tags in the raw data.
 */
const extractFootnotes = (
  text: string,
): { cleanText: string; footnotes: string[] } => {
  const footnotes: string[] = [];
  const cleanText = text.replace(/<sup>([^<]+)<\/sup>/g, (_, footnote) => {
    footnotes.push(footnote.trim());
    return "";
  });
  return { cleanText: cleanText.trim(), footnotes };
};

export const formatVerseText = (verseText: string): FormattedVerse => {
  // First, clean up Strong's numbers and extract footnotes
  const withoutStrongs = removeStrongsNumbers(verseText);
  const { cleanText, footnotes } = extractFootnotes(withoutStrongs);

  // Check for section titles at the start of the verse
  const titlePattern =
    /^([A-Z][A-Za-z]+(?:\s+(?:of|the|and|in|to|a|an|for|with)\s+[A-Z][A-Za-z]+)*)\s+([A-Z][a-z]+\s+[a-z])/;
  const match = cleanText.match(titlePattern);

  if (match) {
    const potentialTitle = match[1].trim();
    const words = potentialTitle.split(/\s+/);

    if (words.length >= 2 && words.length <= 8 && potentialTitle.length < 50) {
      const titleEnd = cleanText.indexOf(match[2]);
      return {
        title: potentialTitle,
        text: cleanText.substring(titleEnd).trim(),
        footnotes: footnotes.length > 0 ? footnotes : undefined,
      };
    }
  }

  return {
    text: cleanText,
    footnotes: footnotes.length > 0 ? footnotes : undefined,
  };
};
