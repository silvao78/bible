/**
 * Random Psalm quotes displayed in the footer.
 */
export const PSALM_QUOTES = [
  {
    text: "Thy word is a lamp unto my feet, and a light unto my path",
    ref: "Psalm 119:105",
    chapter: 119,
    verse: 105,
  },
  {
    text: "The Lord is my shepherd; I shall not want",
    ref: "Psalm 23:1",
    chapter: 23,
    verse: 1,
  },
  {
    text: "Create in me a clean heart, O God; and renew a right spirit within me",
    ref: "Psalm 51:10",
    chapter: 51,
    verse: 10,
  },
  {
    text: "The heavens declare the glory of God; and the firmament sheweth his handywork",
    ref: "Psalm 19:1",
    chapter: 19,
    verse: 1,
  },
  {
    text: "Be still, and know that I am God",
    ref: "Psalm 46:10",
    chapter: 46,
    verse: 10,
  },
  {
    text: "I will praise thee; for I am fearfully and wonderfully made",
    ref: "Psalm 139:14",
    chapter: 139,
    verse: 14,
  },
  {
    text: "The Lord is my light and my salvation; whom shall I fear?",
    ref: "Psalm 27:1",
    chapter: 27,
    verse: 1,
  },
  {
    text: "This is the day which the Lord hath made; we will rejoice and be glad in it",
    ref: "Psalm 118:24",
    chapter: 118,
    verse: 24,
  },
  {
    text: "Delight thyself also in the Lord; and he shall give thee the desires of thine heart",
    ref: "Psalm 37:4",
    chapter: 37,
    verse: 4,
  },
  {
    text: "O taste and see that the Lord is good: blessed is the man that trusteth in him",
    ref: "Psalm 34:8",
    chapter: 34,
    verse: 8,
  },
];

export type PsalmQuote = (typeof PSALM_QUOTES)[number];

/**
 * Get a random Psalm quote.
 */
export const getRandomPsalmQuote = (): PsalmQuote => {
  return PSALM_QUOTES[Math.floor(Math.random() * PSALM_QUOTES.length)];
};
