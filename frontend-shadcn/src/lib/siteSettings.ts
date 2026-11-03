import { site } from "@/config/site";
import type { SiteSettingKey, SiteSettings } from "@/types/SiteSettings";

export type SiteInfo = typeof site;

// Max length of each key, same as the API's SiteSettingService
export const SITE_SETTING_LIMITS: Record<SiteSettingKey, number> = {
  "contact.email": 150,
  "contact.phone": 40,
  "contact.address": 200,
  "social.facebook": 300,
  "social.instagram": 300,
  "social.linkedin": 300,
  "social.youtube": 300,
  "site.description": 300,
  "about.mission": 1000,
  "about.story": 1500,
};

// The value of every key in a site object, e.g. the defaults from config/site.ts
export function toSiteSettings(info: SiteInfo): Record<SiteSettingKey, string> {
  return {
    "contact.email": info.contact.email,
    "contact.phone": info.contact.phone,
    "contact.address": info.contact.address,
    "social.facebook": info.social.facebook,
    "social.instagram": info.social.instagram,
    "social.linkedin": info.social.linkedin,
    "social.youtube": info.social.youtube,
    "site.description": info.description,
    "about.mission": info.about.mission,
    "about.story": info.about.story,
  };
}

// The static site with the saved values on top. A saved "" stays "" (hidden).
export function applySiteSettings(settings: SiteSettings): SiteInfo {
  const defaults = toSiteSettings(site);
  const pick = (key: SiteSettingKey) => settings[key] ?? defaults[key];

  return {
    ...site,
    description: pick("site.description"),
    about: { mission: pick("about.mission"), story: pick("about.story") },
    contact: {
      email: pick("contact.email"),
      phone: pick("contact.phone"),
      address: pick("contact.address"),
    },
    social: {
      facebook: pick("social.facebook"),
      instagram: pick("social.instagram"),
      linkedin: pick("social.linkedin"),
      youtube: pick("social.youtube"),
    },
  };
}
