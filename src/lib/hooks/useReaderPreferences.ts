import { useEffect, useMemo, useState } from "react";

import { onCollectionsReady } from "@/lib/db/collections";
import { userPreferencesService } from "@/lib/userPreferences";

interface UseReaderPreferencesOptions {
  versionId: string;
  bookId: number;
  chapter: number;
}

interface UseReaderPreferencesResult {
  holyWordsEnabled: boolean;
  setHolyWordsEnabled: (enabled: boolean) => void;
  holyWordsColor: string;
  setHolyWordsColor: (color: string) => void;
}

/**
 * Hook for managing reader preferences (holy words highlighting).
 */
export function useReaderPreferences({
  versionId,
  bookId,
  chapter,
}: UseReaderPreferencesOptions): UseReaderPreferencesResult {
  const initialPrefs = useMemo(
    () => userPreferencesService.getPreferences(),
    [],
  );
  const [holyWordsEnabled, setHolyWordsEnabled] = useState(
    initialPrefs.holyWordsEnabled,
  );
  const [holyWordsColor, setHolyWordsColor] = useState(
    initialPrefs.holyWordsColor,
  );

  // Reload preferences when collections become ready
  useEffect(() => {
    const loadPreferences = () => {
      const preferences = userPreferencesService.getPreferences();
      setHolyWordsEnabled(preferences.holyWordsEnabled);
      setHolyWordsColor(preferences.holyWordsColor);
    };

    const unsubscribe = onCollectionsReady(() => {
      loadPreferences();
    });
    return unsubscribe;
  }, []);

  // Save preferences when state changes
  useEffect(() => {
    userPreferencesService.savePreferences({
      selectedVersionId: versionId,
      selectedBookId: bookId,
      selectedChapter: chapter,
      holyWordsEnabled,
      holyWordsColor,
    });
  }, [versionId, bookId, chapter, holyWordsEnabled, holyWordsColor]);

  return {
    holyWordsEnabled,
    setHolyWordsEnabled,
    holyWordsColor,
    setHolyWordsColor,
  };
}
