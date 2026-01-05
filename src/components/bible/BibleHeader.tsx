interface BibleHeaderProps {
  bookName: string;
  chapter: number;
  versionCode: string;
}

/**
 * Header displaying the current book, chapter, and version.
 */
const BibleHeader = ({ bookName, chapter, versionCode }: BibleHeaderProps) => (
  <div className="flex items-baseline gap-3">
    <h2 className="font-bold font-serif text-3xl text-primary-foreground sm:text-4xl">
      {bookName}
    </h2>
    <span className="font-light font-serif text-2xl text-primary-foreground/80 sm:text-3xl">
      {chapter}
    </span>
    <span className="font-sans text-primary-foreground/70 text-sm uppercase tracking-wider">
      {versionCode}
    </span>
  </div>
);

export default BibleHeader;
