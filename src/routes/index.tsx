import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { userPreferencesService } from "@/lib/userPreferences";

export const Route = createFileRoute("/")({
  component: IndexRedirect,
});

/**
 * Redirects to saved reading position on client side.
 */
function IndexRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const loadAndRedirect = async () => {
      const preferences = await userPreferencesService.getPreferences();

      const version = preferences.selectedVersionId || "kjv";
      const book = preferences.selectedBookId || 1;
      const chapter = preferences.selectedChapter || 1;

      navigate({
        to: "/$version/$book/$chapter",
        params: {
          version: String(version),
          book: String(book),
          chapter: String(chapter),
        },
        replace: true,
      });
    };

    loadAndRedirect();
  }, [navigate]);

  return null;
}
