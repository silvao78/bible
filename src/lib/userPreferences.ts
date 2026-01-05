import {
  areCollectionsInitialized,
  getPreferencesCollection,
} from "@/lib/db/collections";

import type { UserPreferences } from "@/lib/db/collections";

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

  exportPreferences(): string {
    const { id: _, ...prefs } = this.getPreferences();
    return JSON.stringify(prefs, null, 2);
  },

  importPreferences(jsonString: string): void {
    if (typeof window === "undefined" || !areCollectionsInitialized()) return;

    try {
      const preferences = JSON.parse(jsonString) as Partial<UserPreferences>;
      this.savePreferences(preferences);
    } catch {
      throw new Error("Invalid preferences JSON format");
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
