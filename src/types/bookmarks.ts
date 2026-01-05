export interface Bookmark {
  id: string;
  user_id: string;
  version_id: string;
  book_id: number;
  chapter: number;
  verse: number;
  note?: string;
  color: string;
  created_at: string;
  updated_at: string;
}
