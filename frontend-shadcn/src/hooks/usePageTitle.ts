import { useEffect } from "react";

export const SITE_NAME = "Andalusia Academy";

// Sets the browser tab title, e.g. "React from Scratch · Andalusia Academy".
// Pass undefined while the page is still loading to leave the title as it is.
export function usePageTitle(title: string | null | undefined) {
  useEffect(() => {
    if (title === undefined) return;
    document.title = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
  }, [title]);
}
