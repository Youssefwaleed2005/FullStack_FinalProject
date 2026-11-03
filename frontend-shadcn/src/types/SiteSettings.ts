// The site info keys the API accepts (SiteSettingService.AllowedKeys)
export type SiteSettingKey =
  | "contact.email"
  | "contact.phone"
  | "contact.address"
  | "social.facebook"
  | "social.instagram"
  | "social.linkedin"
  | "social.youtube"
  | "site.description"
  | "about.mission"
  | "about.story";

// Only the keys an admin has saved. A missing key = use the default from config/site.ts, "" = hidden.
export type SiteSettings = Partial<Record<SiteSettingKey, string>>;

// Only the keys sent are changed; null or "" hides the item
export type SiteSettingsUpdate = Partial<Record<SiteSettingKey, string | null>>;
