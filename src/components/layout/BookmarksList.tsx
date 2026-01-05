import { Bookmark as BookmarkIcon, Edit2, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { bookmarksService } from "@/lib/bookmarks";
import { onCollectionsReady } from "@/lib/db/collections";
import { useBibleBooks } from "@/lib/useBible";

import type { Bookmark } from "@/lib/bookmarks";

interface BookmarksListProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate?: (bookId: number, chapter: number, verse: number) => void;
}

export function BookmarksList({
  open,
  onOpenChange,
  onNavigate,
}: BookmarksListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState("");
  const { data: books } = useBibleBooks();

  const loadBookmarks = useCallback(() => {
    try {
      const data = bookmarksService.getBookmarks();
      setBookmarks(data);
    } catch (error) {
      console.error("Failed to load bookmarks:", error);
    }
  }, []);

  // Load bookmarks on mount and when sheet opens
  useEffect(() => {
    loadBookmarks();

    // Re-load when collections become ready (handles initial page load race)
    const unsubscribe = onCollectionsReady(() => {
      loadBookmarks();
    });
    return unsubscribe;
  }, [loadBookmarks]);

  useEffect(() => {
    if (open) {
      loadBookmarks();
    }
  }, [open, loadBookmarks]);

  const handleDelete = async (id: string) => {
    try {
      await bookmarksService.deleteBookmark(id);
      setBookmarks(bookmarks.filter((b) => b.id !== id));
      toast.success("Bookmark deleted");
    } catch (_error) {
      toast.error("Failed to delete bookmark");
    }
  };

  const handleUpdateNote = async (id: string) => {
    try {
      await bookmarksService.updateBookmark(id, { note: editNote });
      setBookmarks(
        bookmarks.map((b) => (b.id === id ? { ...b, note: editNote } : b)),
      );
      setEditingId(null);
      setEditNote("");
      toast.success("Note updated");
    } catch (_error) {
      toast.error("Failed to update note");
    }
  };

  const handleNavigate = (bookmark: Bookmark) => {
    if (onNavigate) {
      onNavigate(bookmark.book_id, bookmark.chapter, bookmark.verse);
      onOpenChange(false);
    }
  };

  const getBookName = (bookId: number) => {
    const book = books?.find(
      (b) => b.id === bookId || b.book_number === bookId,
    );
    return book?.name || "Unknown";
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative bg-card/80 backdrop-blur-sm"
        >
          <BookmarkIcon className="h-5 w-5" />
          {bookmarks.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
              {bookmarks.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="shrink-0">
          <SheetTitle className="flex items-center gap-2 font-serif">
            <BookmarkIcon className="h-5 w-5" />
            My Bookmarks
          </SheetTitle>
          <SheetDescription>Your saved verses and notes</SheetDescription>
        </SheetHeader>

        <ScrollArea className="mt-4 flex-1 sm:mt-6">
          {bookmarks.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <BookmarkIcon className="mx-auto mb-4 h-12 w-12 opacity-20" />
              <p className="text-sm">No bookmarks yet</p>
              <p className="mt-2 text-xs">
                Tap the bookmark icon on any verse to save it
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleNavigate(bookmark)}
                      className="flex-1 cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2 font-semibold text-primary text-sm">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: bookmark.color }}
                        />
                        {getBookName(bookmark.book_id)} {bookmark.chapter}:
                        {bookmark.verse}
                      </div>
                    </button>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditingId(bookmark.id);
                          setEditNote(bookmark.note || "");
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(bookmark.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {editingId === bookmark.id ? (
                    <div className="mt-2 space-y-2">
                      <Textarea
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        placeholder="Add a note..."
                        className="text-sm"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateNote(bookmark.id)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(null);
                            setEditNote("");
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : bookmark.note ? (
                    <p className="mt-2 text-muted-foreground text-sm italic">
                      {bookmark.note}
                    </p>
                  ) : null}

                  <div className="mt-2 text-muted-foreground text-xs">
                    {new Date(bookmark.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
