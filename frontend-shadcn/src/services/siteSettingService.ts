import api from "./api";
import type { SiteSettings, SiteSettingsUpdate } from "@/types/SiteSettings";

// Public: the footer / About / Contact values an admin has changed
export async function getSiteSettings(): Promise<SiteSettings> {
  return (await api.get<SiteSettings>("/site-settings")).data;
}

// Admin / ContentManager. All or nothing; answers with the full updated map.
export async function updateSiteSettings(values: SiteSettingsUpdate): Promise<SiteSettings> {
  return (await api.put<SiteSettings>("/site-settings", { values })).data;
}
