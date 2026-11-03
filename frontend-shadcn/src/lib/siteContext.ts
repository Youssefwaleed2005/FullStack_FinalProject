import { createContext } from "react";
import type { SiteInfo } from "@/lib/siteSettings";
import type { SiteSettings } from "@/types/SiteSettings";

export type SiteContextValue = SiteInfo & {
  // Swap in the map the API returned after saving, so the whole site updates at once
  replace: (settings: SiteSettings) => void;
};

// Filled in by SiteSettingsProvider, read with the useSite hook
export const SiteContext = createContext<SiteContextValue | undefined>(
  undefined,
);
