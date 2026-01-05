/**
 * Script to fetch KJV Bible data from bolls.life API and save as static JSON.
 * Run with: bun scripts/fetch-bible-data.ts
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const BOOKS = [
  { book_number: 1, name: "Genesis", testament: "OT", chapters: 50 },
  { book_number: 2, name: "Exodus", testament: "OT", chapters: 40 },
  { book_number: 3, name: "Leviticus", testament: "OT", chapters: 27 },
  { book_number: 4, name: "Numbers", testament: "OT", chapters: 36 },
  { book_number: 5, name: "Deuteronomy", testament: "OT", chapters: 34 },
  { book_number: 6, name: "Joshua", testament: "OT", chapters: 24 },
  { book_number: 7, name: "Judges", testament: "OT", chapters: 21 },
  { book_number: 8, name: "Ruth", testament: "OT", chapters: 4 },
  { book_number: 9, name: "1 Samuel", testament: "OT", chapters: 31 },
  { book_number: 10, name: "2 Samuel", testament: "OT", chapters: 24 },
  { book_number: 11, name: "1 Kings", testament: "OT", chapters: 22 },
  { book_number: 12, name: "2 Kings", testament: "OT", chapters: 25 },
  { book_number: 13, name: "1 Chronicles", testament: "OT", chapters: 29 },
  { book_number: 14, name: "2 Chronicles", testament: "OT", chapters: 36 },
  { book_number: 15, name: "Ezra", testament: "OT", chapters: 10 },
  { book_number: 16, name: "Nehemiah", testament: "OT", chapters: 13 },
  { book_number: 17, name: "Esther", testament: "OT", chapters: 10 },
  { book_number: 18, name: "Job", testament: "OT", chapters: 42 },
  { book_number: 19, name: "Psalms", testament: "OT", chapters: 150 },
  { book_number: 20, name: "Proverbs", testament: "OT", chapters: 31 },
  { book_number: 21, name: "Ecclesiastes", testament: "OT", chapters: 12 },
  { book_number: 22, name: "Song of Solomon", testament: "OT", chapters: 8 },
  { book_number: 23, name: "Isaiah", testament: "OT", chapters: 66 },
  { book_number: 24, name: "Jeremiah", testament: "OT", chapters: 52 },
  { book_number: 25, name: "Lamentations", testament: "OT", chapters: 5 },
  { book_number: 26, name: "Ezekiel", testament: "OT", chapters: 48 },
  { book_number: 27, name: "Daniel", testament: "OT", chapters: 12 },
  { book_number: 28, name: "Hosea", testament: "OT", chapters: 14 },
  { book_number: 29, name: "Joel", testament: "OT", chapters: 3 },
  { book_number: 30, name: "Amos", testament: "OT", chapters: 9 },
  { book_number: 31, name: "Obadiah", testament: "OT", chapters: 1 },
  { book_number: 32, name: "Jonah", testament: "OT", chapters: 4 },
  { book_number: 33, name: "Micah", testament: "OT", chapters: 7 },
  { book_number: 34, name: "Nahum", testament: "OT", chapters: 3 },
  { book_number: 35, name: "Habakkuk", testament: "OT", chapters: 3 },
  { book_number: 36, name: "Zephaniah", testament: "OT", chapters: 3 },
  { book_number: 37, name: "Haggai", testament: "OT", chapters: 2 },
  { book_number: 38, name: "Zechariah", testament: "OT", chapters: 14 },
  { book_number: 39, name: "Malachi", testament: "OT", chapters: 4 },
  { book_number: 40, name: "Matthew", testament: "NT", chapters: 28 },
  { book_number: 41, name: "Mark", testament: "NT", chapters: 16 },
  { book_number: 42, name: "Luke", testament: "NT", chapters: 24 },
  { book_number: 43, name: "John", testament: "NT", chapters: 21 },
  { book_number: 44, name: "Acts", testament: "NT", chapters: 28 },
  { book_number: 45, name: "Romans", testament: "NT", chapters: 16 },
  { book_number: 46, name: "1 Corinthians", testament: "NT", chapters: 16 },
  { book_number: 47, name: "2 Corinthians", testament: "NT", chapters: 13 },
  { book_number: 48, name: "Galatians", testament: "NT", chapters: 6 },
  { book_number: 49, name: "Ephesians", testament: "NT", chapters: 6 },
  { book_number: 50, name: "Philippians", testament: "NT", chapters: 4 },
  { book_number: 51, name: "Colossians", testament: "NT", chapters: 4 },
  { book_number: 52, name: "1 Thessalonians", testament: "NT", chapters: 5 },
  { book_number: 53, name: "2 Thessalonians", testament: "NT", chapters: 3 },
  { book_number: 54, name: "1 Timothy", testament: "NT", chapters: 6 },
  { book_number: 55, name: "2 Timothy", testament: "NT", chapters: 4 },
  { book_number: 56, name: "Titus", testament: "NT", chapters: 3 },
  { book_number: 57, name: "Philemon", testament: "NT", chapters: 1 },
  { book_number: 58, name: "Hebrews", testament: "NT", chapters: 13 },
  { book_number: 59, name: "James", testament: "NT", chapters: 5 },
  { book_number: 60, name: "1 Peter", testament: "NT", chapters: 5 },
  { book_number: 61, name: "2 Peter", testament: "NT", chapters: 3 },
  { book_number: 62, name: "1 John", testament: "NT", chapters: 5 },
  { book_number: 63, name: "2 John", testament: "NT", chapters: 1 },
  { book_number: 64, name: "3 John", testament: "NT", chapters: 1 },
  { book_number: 65, name: "Jude", testament: "NT", chapters: 1 },
  { book_number: 66, name: "Revelation", testament: "NT", chapters: 22 },
] as const;

interface Verse {
  verse: number;
  text: string;
}

interface ChapterData {
  book: number;
  chapter: number;
  verses: Verse[];
}

const OUTPUT_DIR = join(import.meta.dirname!, "..", "public", "data");
const BOOKS_DIR = join(OUTPUT_DIR, "kjv");

async function fetchChapter(
  bookNumber: number,
  chapter: number,
): Promise<Verse[]> {
  const url = `https://bolls.life/get-chapter/KJV/${bookNumber}/${chapter}/`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch book ${bookNumber} chapter ${chapter}`);
  }

  const data = await response.json();
  return data.map((v: { verse: number; text: string }) => ({
    verse: v.verse,
    text: v.text,
  }));
}

async function main() {
  console.info("Fetching KJV Bible data...");

  // Create output directories
  mkdirSync(BOOKS_DIR, { recursive: true });

  // Save books metadata
  const booksData = BOOKS.map((book) => ({
    id: book.book_number,
    book_number: book.book_number,
    name: book.name,
    testament: book.testament,
    chapters: book.chapters,
  }));

  writeFileSync(join(OUTPUT_DIR, "books.json"), JSON.stringify(booksData));
  console.info("Saved books.json");

  // Save versions metadata
  const versionsData = [
    {
      id: "kjv",
      code: "KJV",
      name: "King James Version",
      language: "en",
      description: "The King James Version (1611)",
      is_default: true,
    },
  ];

  writeFileSync(
    join(OUTPUT_DIR, "versions.json"),
    JSON.stringify(versionsData),
  );
  console.info("Saved versions.json");

  // Fetch all chapters
  let totalVerses = 0;

  for (const book of BOOKS) {
    const bookDir = join(BOOKS_DIR, book.book_number.toString());
    mkdirSync(bookDir, { recursive: true });

    console.info(`Fetching ${book.name}...`);

    for (let chapter = 1; chapter <= book.chapters; chapter++) {
      try {
        const verses = await fetchChapter(book.book_number, chapter);
        totalVerses += verses.length;

        const chapterData: ChapterData = {
          book: book.book_number,
          chapter,
          verses,
        };

        writeFileSync(
          join(bookDir, `${chapter}.json`),
          JSON.stringify(chapterData),
        );

        // Rate limit to avoid overwhelming the API
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error fetching ${book.name} ${chapter}:`, error);
      }
    }

    console.info(`  Completed ${book.name} (${book.chapters} chapters)`);
  }

  console.info(`\nDone! Fetched ${totalVerses} verses total.`);
}

main().catch(console.error);
