import { useEffect, useState, type FormEvent } from "react";
import { LoaderCircle, RotateCcw, Save } from "lucide-react";
import FormField from "@/components/FormField";
import ConfirmDialog, { type ConfirmRequest } from "@/components/manage/ConfirmDialog";
import { TextareaField } from "@/components/manage/fields";
import TableCard from "@/components/manage/TableCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { site as defaultSite } from "@/config/site";
import { useSite } from "@/hooks/useSite";
import { useToast } from "@/hooks/useToast";
import { EMAIL_PATTERN, isHttpUrl } from "@/lib/forms";
import { SITE_SETTING_LIMITS, toSiteSettings } from "@/lib/siteSettings";
import { getApiErrorMessage } from "@/services/api";
import { getSiteSettingsLastEdit, updateSiteSettings } from "@/services/siteSettingService";
import { timeAgo } from "@/lib/time";
import type { SiteSettingKey, SiteSettingsUpdate } from "@/types/SiteSettings";

type Field = {
  key: SiteSettingKey;
  label: string;
  placeholder?: string;
  type?: string;
  // Textarea with this many rows instead of a one-line input
  rows?: number;
  // Takes the full width of the section
  wide?: boolean;
};

const SECTIONS: { title: string; description: string; fields: Field[] }[] = [
  {
    title: "Contact",
    description: "Shown in the footer and on the Contact page. The contact form needs the email.",
    fields: [
      { key: "contact.email", label: "Email", type: "email", placeholder: "info@example.com" },
      { key: "contact.phone", label: "Phone", type: "tel", placeholder: "+20 100 000 0000" },
      { key: "contact.address", label: "Address", wide: true },
    ],
  },
  {
    title: "Social links",
    description: "Shown in the footer and on the Contact page. Use the full link, starting with https://",
    fields: [
      { key: "social.facebook", label: "Facebook", type: "url", placeholder: "https://www.facebook.com/…" },
      { key: "social.instagram", label: "Instagram", type: "url", placeholder: "https://www.instagram.com/…" },
      { key: "social.linkedin", label: "LinkedIn", type: "url", placeholder: "https://www.linkedin.com/…" },
      { key: "social.youtube", label: "YouTube", type: "url", placeholder: "https://www.youtube.com/…" },
    ],
  },
  {
    title: "Footer",
    description: "The short text under the logo. It also appears at the top of the About page.",
    fields: [{ key: "site.description", label: "Tagline", rows: 3, wide: true }],
  },
  {
    title: "About page",
    description: "The two cards at the top of the About page. Clear both to hide the section.",
    fields: [
      { key: "about.mission", label: "Our mission", rows: 5, wide: true },
      { key: "about.story", label: "Our story", rows: 7, wide: true },
    ],
  },
];

type Values = Record<SiteSettingKey, string>;
type FieldErrors = Partial<Values>;

// Same rules as the API's SiteSettingService. Empty is always fine: it hides the item.
function validate(values: Values): FieldErrors {
  const errors: FieldErrors = {};
  for (const key of Object.keys(values) as SiteSettingKey[]) {
    const value = values[key].trim();
    const max = SITE_SETTING_LIMITS[key];
    if (!value) continue;
    if (value.length > max) errors[key] = `Can be at most ${max} characters.`;
    else if (key === "contact.email" && !EMAIL_PATTERN.test(value)) errors[key] = "Enter a valid email address.";
    else if (key.startsWith("social.") && !isHttpUrl(value)) errors[key] = "Enter a full link, e.g. https://example.com";
  }
  return errors;
}

// Footer, Contact and About info: edit the values saved over config/site.ts
function SiteInfoForm() {
  const site = useSite();
  const toast = useToast();
  const saved = toSiteSettings(site);
  // Only the fields being edited. The rest show the live values, so they refresh after a save
  // or when the settings arrive after the page opened.
  const [draft, setDraft] = useState<Partial<Values>>({});
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [lastEdit, setLastEdit] = useState<{ updatedAt: string | null; updatedBy: string | null } | null>(null);
  const [saveCount, setSaveCount] = useState(0);

  // "Last edited by …" under the title; refreshed after each save
  useEffect(() => {
    let active = true;
    getSiteSettingsLastEdit()
      .then((result) => {
        if (active) setLastEdit(result);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [saveCount]);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);

  const values: Values = { ...saved, ...draft };
  const changed = (Object.keys(draft) as SiteSettingKey[]).filter((key) => values[key].trim() !== saved[key]);

  function set(key: SiteSettingKey, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  async function save(payload: SiteSettingsUpdate, success: string, failure: string) {
    setError("");
    setSaving(true);
    try {
      site.replace(await updateSiteSettings(payload));
      setSaveCount((count) => count + 1);
      setDraft({});
      setFieldErrors({});
      toast.success(success);
    } catch (err) {
      setError(getApiErrorMessage(err, failure));
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const errors = validate(values);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError("Some fields need fixing before saving.");
      return;
    }
    // Send only what changed
    const payload = Object.fromEntries(changed.map((key) => [key, values[key].trim()]));
    await save(payload, "Site info was saved. The website shows the new values now.", "Could not save the site info.");
  }

  function askReset() {
    setConfirm({
      title: "Reset all site info?",
      description: "Every field goes back to the default text from the website's code. Unsaved edits are lost.",
      confirmLabel: "Reset to defaults",
      danger: true,
      // The API can't delete a key, so "reset" saves the defaults from config/site.ts as values.
      // Those keys then stay saved: a later edit to config/site.ts won't show until they change here.
      onConfirm: () =>
        save(toSiteSettings(defaultSite), "All site info was reset to the defaults.", "Could not reset the site info."),
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <p className="text-sm text-muted-foreground">
          Leave a field empty to hide it on the site.
          {lastEdit?.updatedAt && lastEdit.updatedBy && (
            <span className="ml-1 text-xs">· Last edited {timeAgo(lastEdit.updatedAt)} by {lastEdit.updatedBy}</span>
          )}
        </p>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {SECTIONS.map((section) => (
          <TableCard key={section.title} title={section.title} description={section.description}>
            <div className="grid gap-5 p-5 sm:grid-cols-2">
              {section.fields.map((field) => {
                const value = values[field.key];
                const max = SITE_SETTING_LIMITS[field.key];
                const common = {
                  label: field.label,
                  value,
                  placeholder: field.placeholder,
                  error: fieldErrors[field.key],
                  hint: value.trim() ? `${value.trim().length} / ${max} characters` : "Empty — hidden on the site",
                  className: field.wide ? "sm:col-span-2" : undefined,
                };
                return field.rows ? (
                  <TextareaField
                    key={field.key}
                    rows={field.rows}
                    {...common}
                    onChange={(e) => set(field.key, e.target.value)}
                  />
                ) : (
                  <FormField key={field.key} type={field.type} {...common} onChange={(e) => set(field.key, e.target.value)} />
                );
              })}
            </div>
          </TableCard>
        ))}

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" className="h-10 rounded-full px-5" disabled={saving || changed.length === 0}>
            {saving ? <LoaderCircle aria-hidden className="animate-spin" /> : <Save aria-hidden />}
            Save changes
          </Button>
          <Button type="button" variant="outline" className="h-10 rounded-full px-5" disabled={saving} onClick={askReset}>
            <RotateCcw aria-hidden /> Reset all to defaults
          </Button>
          <p className="text-sm text-muted-foreground">
            {changed.length === 0
              ? "No unsaved changes"
              : `${changed.length} unsaved ${changed.length === 1 ? "change" : "changes"}`}
          </p>
        </div>
      </form>

      <ConfirmDialog request={confirm} onClose={() => setConfirm(null)} />
    </>
  );
}

export default SiteInfoForm;
