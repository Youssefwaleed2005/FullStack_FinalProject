import { useState, type FormEvent } from "react";
import FormField from "@/components/FormField";
import FormDialog from "@/components/manage/FormDialog";
import { SelectField, TextareaField } from "@/components/manage/fields";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { isHttpUrl, orNull } from "@/lib/forms";
import { getApiErrorMessage } from "@/services/api";
import { createTestimonial, updateTestimonial } from "@/services/testimonialService";
import type { TestimonialAdmin, TestimonialRequest } from "@/types/Testimonial";

const MAX_CONTENT = 1000;
// The Select can't use "" as a value, so this stands for "no rating"
const NONE = "none";

type TestimonialEditorDialogProps = {
  testimonial: TestimonialAdmin | null; // null = new testimonial
  onClose: () => void;
  onSaved: (name: string) => void;
};

type FormState = {
  authorName: string;
  authorTitle: string;
  photoUrl: string;
  content: string;
  rating: string;
  isPublished: boolean;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

function toForm(testimonial: TestimonialAdmin | null): FormState {
  return {
    authorName: testimonial?.authorName ?? "",
    authorTitle: testimonial?.authorTitle ?? "",
    photoUrl: testimonial?.photoUrl ?? "",
    content: testimonial?.content ?? "",
    rating: testimonial?.rating ? String(testimonial.rating) : NONE,
    isPublished: testimonial?.isPublished ?? false,
  };
}

// Same rules as the API's TestimonialRequestDto
function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  const name = form.authorName.trim();
  const photo = form.photoUrl.trim();
  const content = form.content.trim();
  if (!name) errors.authorName = "Author name is required.";
  else if (name.length > 100) errors.authorName = "Author name can be at most 100 characters.";
  if (form.authorTitle.trim().length > 150) errors.authorTitle = "Title can be at most 150 characters.";
  if (photo && !isHttpUrl(photo)) errors.photoUrl = "Enter a full link, e.g. https://example.com/photo.jpg";
  else if (photo.length > 300) errors.photoUrl = "Photo URL can be at most 300 characters.";
  if (!content) errors.content = "The testimonial text is required.";
  else if (content.length > MAX_CONTENT) errors.content = `Keep it under ${MAX_CONTENT} characters.`;
  return errors;
}

// Create or edit a student testimonial shown on the homepage
function TestimonialEditorDialog({ testimonial, onClose, onSaved }: TestimonialEditorDialogProps) {
  const [form, setForm] = useState<FormState>(() => toForm(testimonial));
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

    const payload: TestimonialRequest = {
      authorName: form.authorName.trim(),
      authorTitle: orNull(form.authorTitle),
      photoUrl: orNull(form.photoUrl),
      content: form.content.trim(),
      rating: form.rating === NONE ? null : Number(form.rating),
      isPublished: form.isPublished,
    };

    setSaving(true);
    try {
      if (testimonial) await updateTestimonial(testimonial.id, payload);
      else await createTestimonial(payload);
      onSaved(payload.authorName);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save the testimonial."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <FormDialog
      open
      title={testimonial ? "Edit testimonial" : "New testimonial"}
      description="Only published testimonials appear on the homepage."
      error={error}
      saving={saving}
      submitLabel={testimonial ? "Save changes" : "Create testimonial"}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Author name" value={form.authorName} error={fieldErrors.authorName} maxLength={100} onChange={(e) => set("authorName", e.target.value)} />
        <FormField
          label="Author title"
          placeholder="e.g. Front-end graduate"
          value={form.authorTitle}
          error={fieldErrors.authorTitle}
          maxLength={150}
          onChange={(e) => set("authorTitle", e.target.value)}
        />
      </div>
      <FormField
        label="Photo URL"
        placeholder="https://"
        hint="Optional. Their initials are shown when there is no photo."
        value={form.photoUrl}
        error={fieldErrors.photoUrl}
        onChange={(e) => set("photoUrl", e.target.value)}
      />
      <TextareaField
        label="Testimonial"
        rows={5}
        maxLength={MAX_CONTENT}
        hint={`${form.content.length} / ${MAX_CONTENT} characters`}
        error={fieldErrors.content}
        value={form.content}
        onChange={(e) => set("content", e.target.value)}
      />
      <div className="grid items-end gap-4 sm:grid-cols-2">
        <SelectField
          label="Rating"
          value={form.rating}
          onChange={(value) => set("rating", value)}
          options={[{ value: NONE, label: "No rating" }, ...[5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} ★` }))]}
        />
        <div className="flex h-10 items-center gap-2.5 rounded-lg border border-input bg-card px-3">
          <Checkbox id="testimonial-published" checked={form.isPublished} onCheckedChange={(checked) => set("isPublished", checked === true)} />
          <Label htmlFor="testimonial-published" className="cursor-pointer">
            Published on the website
          </Label>
        </div>
      </div>
    </FormDialog>
  );
}

export default TestimonialEditorDialog;
