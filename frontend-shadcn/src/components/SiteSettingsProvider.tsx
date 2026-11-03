import { useEffect, useMemo, useState, type ReactNode } from "react";
import { SiteContext } from "@/lib/siteContext";
import { applySiteSettings } from "@/lib/siteSettings";
import { getSiteSettings } from "@/services/siteSettingService";
import type { SiteSettings } from "@/types/SiteSettings";

// Shares the footer / About / Contact info, with the values saved in the CMS on top of config/site.ts
function SiteSettingsProvider({ children }: { children: ReactNode }) {
  // Start with no overrides, so the page renders the defaults straight away (no spinner)
  const [settings, setSettings] = useState<SiteSettings>({});

  useEffect(() => {
    let cancelled = false;

    getSiteSettings()
      .then((saved) => {
        if (!cancelled) setSettings(saved);
      })
      // The defaults are fine to show if the API is down
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ ...applySiteSettings(settings), replace: setSettings }),
    [settings],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export default SiteSettingsProvider;
