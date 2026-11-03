import { useContext } from "react";
import { SiteContext } from "@/lib/siteContext";

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error("useSite must be used inside a SiteSettingsProvider.");
  }
  return context;
}
