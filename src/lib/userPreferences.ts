import { bookmarksService } from "@/lib/bookmarks";
import {
  areCollectionsInitialized,
  getPreferencesCollection,
} from "@/lib/db/collections";

import type { UserPreferences } from "@/lib/db/collections";
import type { ThemeState } from "@/server/functions/theme";

export type { UserPreferences };

const PREFERENCES_ID = "user-preferences";

const defaultPreferences: UserPreferences = {
  id: PREFERENCES_ID,
  selectedVersionId: null,
  selectedBookId: null,
  selectedChapter: 1,
  scrollPosition: 0,
  holyWordsEnabled: true,
  holyWordsColor: "#dc2626",
  footerVerseEnabled: true,
  theme: "system",
  lastUpdated: new Date().toISOString(),
};

export const userPreferencesService = {
  getPreferences(): UserPreferences {
    if (typeof window === "undefined" || !areCollectionsInitialized()) {
      return defaultPreferences;
    }

    const collection = getPreferencesCollection();
    const stored = collection.state.get(PREFERENCES_ID);
    return stored || defaultPreferences;
  },

  savePreferences(preferences: Partial<Omit<UserPreferences, "id">>): void {
    if (typeof window === "undefined" || !areCollectionsInitialized()) return;

    const collection = getPreferencesCollection();
    const current = this.getPreferences();
    const updated: UserPreferences = {
      ...current,
      ...preferences,
      id: PREFERENCES_ID,
      lastUpdated: new Date().toISOString(),
    };

    if (collection.state.has(PREFERENCES_ID)) {
      collection.update([PREFERENCES_ID], (drafts) => {
        const draft = drafts[0];
        if (draft) {
          Object.assign(draft, preferences);
          draft.lastUpdated = updated.lastUpdated;
        }
      });
    } else {
      collection.insert(updated);
    }
  },

  getTheme(): "light" | "dark" | "system" {
    return this.getPreferences().theme;
  },

  setTheme(theme: "light" | "dark" | "system"): void {
    this.savePreferences({ theme });
  },

  exportPreferences(theme?: ThemeState): string {
    const { id: _, ...prefs } = this.getPreferences();
    const bookmarks = bookmarksService.getBookmarks();

    const exportData = {
      preferences: prefs,
      bookmarks,
      theme: theme || null,
      exportedAt: new Date().toISOString(),
      version: 1,
    };

    return JSON.stringify(exportData, null, 2);
  },

  importPreferences(jsonString: string): {
    bookmarksImported: number;
    hasTheme: boolean;
    theme?: ThemeState;
  } {
    if (typeof window === "undefined" || !areCollectionsInitialized()) {
      throw new Error("Cannot import preferences");
    }

    try {
      const data = JSON.parse(jsonString);

      // Handle new format with version
      if (data.version === 1) {
        // Import preferences
        if (data.preferences) {
          this.savePreferences(data.preferences as Partial<UserPreferences>);
        }

        // Import bookmarks
        let bookmarksImported = 0;
        if (data.bookmarks && Array.isArray(data.bookmarks)) {
          bookmarksImported = bookmarksService.importBookmarks(
            JSON.stringify(data.bookmarks),
          );
        }

        return {
          bookmarksImported,
          hasTheme: !!data.theme,
          theme: data.theme as ThemeState | undefined,
        };
      }

      // Handle legacy format (just preferences object)
      this.savePreferences(data as Partial<UserPreferences>);
      return { bookmarksImported: 0, hasTheme: false };
    } catch {
      throw new Error("Invalid settings JSON format");
    }
  },

  resetPreferences(): void {
    if (typeof window === "undefined" || !areCollectionsInitialized()) return;

    const collection = getPreferencesCollection();
    const updated: UserPreferences = {
      ...defaultPreferences,
      lastUpdated: new Date().toISOString(),
    };

    if (collection.state.has(PREFERENCES_ID)) {
      collection.update([PREFERENCES_ID], (drafts) => {
        const draft = drafts[0];
        if (draft) {
          Object.assign(draft, defaultPreferences);
          draft.lastUpdated = updated.lastUpdated;
        }
      });
    } else {
      collection.insert(updated);
    }
  },
};
