import { useState, type FormEvent } from "react";
import FormField from "@/components/FormField";
import FormDialog from "@/components/manage/FormDialog";
import { SelectField } from "@/components/manage/fields";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { isHttpUrl, orNull } from "@/lib/forms";
import { getApiErrorMessage } from "@/services/api";
import { createPartner, updatePartner } from "@/services/partnerService";
import type { PartnerAdmin, PartnerRequest, PartnerType } from "@/types/Partner";

type PartnerEditorDialogProps = {
  partner: PartnerAdmin | null; // null = new partner
  onClose: () => void;
  onSaved: (name: string) => void;
};

type FormState = {
  name: string;
  type: PartnerType;
  logoUrl: string;
  websiteUrl: string;
  displayOrder: string;
  isActive: boolean;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

function toForm(partner: PartnerAdmin | null): FormState {
  return {
    name: partner?.name ?? "",
    type: partner?.type ?? "Partner",
    logoUrl: partner?.logoUrl ?? "",
    websiteUrl: partner?.websiteUrl ?? "",
    displayOrder: String(partner?.displayOrder ?? 0),
    isActive: partner?.isActive ?? true,
  };
}

// Same rules as the API's PartnerRequestDto
function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  const name = form.name.trim();
  const logo = form.logoUrl.trim();
  const website = form.websiteUrl.trim();
  const order = Number(form.displayOrder);
  if (!name) errors.name = "Name is required.";
  else if (name.length > 150) errors.name = "Name can be at most 150 characters.";
  if (logo && !/^(https?:\/\/\S+|\/(files|uploads)\/\S+)$/.test(logo))
    errors.logoUrl = "Use an http(s) link or a /files/ or /uploads/ path.";
  else if (logo.length > 300) errors.logoUrl = "Logo URL can be at most 300 characters.";
  if (website && !isHttpUrl(website)) errors.websiteUrl = "Enter a full link, e.g. https://example.com";
  else if (website.length > 300) errors.websiteUrl = "Website can be at most 300 characters.";
  if (form.displayOrder.trim() === "" || !Number.isInteger(order) || order < 0)
    errors.displayOrder = "Use a whole number, 0 or more.";
  return errors;
}

// Create or edit a partner / accreditation shown on the homepage
function PartnerEditorDialog({ partner, onClose, onSaved }: PartnerEditorDialogProps) {
  const [form, setForm] = useState<FormState>(() => toForm(partner));
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const errors = validate(form);
    setFieldErrors(errors);
    setError("");
    if (Object.keys(errors).length > 0) return;

    const payload: PartnerRequest = {
      name: form.name.trim(),
      type: form.type,
      logoUrl: orNull(form.logoUrl),
      websiteUrl: orNull(form.websiteUrl),
      displayOrder: Number(form.displayOrder),
      isActive: form.isActive,
    };

    setSaving(true);
    try {
      if (partner) await updatePartner(partner.id, payload);
      else await createPartner(payload);
      onSaved(payload.name);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save the partner."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <FormDialog
      open
      title={partner ? "Edit partner" : "New partner"}
      description="Active partners appear in the logo strip on the homepage."
      error={error}
      saving={saving}
      submitLabel={partner ? "Save changes" : "Create partner"}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <FormField label="Name" value={form.name} error={fieldErrors.name} maxLength={150} onChange={(e) => set("name", e.target.value)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Type"
          value={form.type}
          onChange={(value) => set("type", value as PartnerType)}
          options={[
            { value: "Partner", label: "Partner" },
            { value: "Accreditation", label: "Accreditation" },
          ]}
        />
        <FormField
          label="Display order"
          type="number"
          min={0}
          hint="Lower numbers come first"
          value={form.displayOrder}
          error={fieldErrors.displayOrder}
          onChange={(e) => set("displayOrder", e.target.value)}
        />
      </div>
      <FormField
        label="Logo URL"
        placeholder="https:// or /files/partners/logo.svg"
        hint="Optional. The name is shown instead when there is no logo."
        value={form.logoUrl}
        error={fieldErrors.logoUrl}
        onChange={(e) => set("logoUrl", e.target.value)}
      />
      <FormField
        label="Website"
        placeholder="https://"
        hint="Optional"
        value={form.websiteUrl}
        error={fieldErrors.websiteUrl}
        onChange={(e) => set("websiteUrl", e.target.value)}
      />
      <div className="flex h-10 items-center gap-2.5 rounded-lg border border-input bg-card px-3">
        <Checkbox id="partner-active" checked={form.isActive} onCheckedChange={(checked) => set("isActive", checked === true)} />
        <Label htmlFor="partner-active" className="cursor-pointer">
          Show on the public website
        </Label>
      </div>
    </FormDialog>
  );
}

export default PartnerEditorDialog;
