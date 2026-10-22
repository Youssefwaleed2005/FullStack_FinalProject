import { useRef, useState, type FormEvent } from "react";
import { FileUp, Link2 } from "lucide-react";
import FormField from "@/components/FormField";
import FormDialog from "@/components/manage/FormDialog";
import { SelectField, TextareaField } from "@/components/manage/fields";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/services/api";
import type { Material, MaterialRequest, MaterialType } from "@/types/Lms";

const TYPES: MaterialType[] = ["Link", "Video", "Document", "File"];
const ACCEPT = ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.png,.jpg,.jpeg,.mp4";
const MAX_MB = 25;

type MaterialFormDialogProps = {
  open: boolean;
  material: Material | null; // null = new
  onClose: () => void;
  onSave: (payload: MaterialRequest) => Promise<void>;
  onUpload: (file: File, title: string, description?: string) => Promise<void>;
};

// Add a link / video, upload a file, or edit an existing material
function MaterialFormDialog({ open, material, onClose, onSave, onUpload }: MaterialFormDialogProps) {
  const isUploadedFile = material?.url.startsWith("/") ?? false;
  // New materials can be a link OR an uploaded file; editing keeps the same kind
  const [mode, setMode] = useState<"link" | "upload">("link");
  const [title, setTitle] = useState(material?.title ?? "");
  const [description, setDescription] = useState(material?.description ?? "");
  const [type, setType] = useState<MaterialType>(material?.type ?? "Link");
  const [url, setUrl] = useState(material?.url ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const uploading = !material && mode === "upload";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return setError("Title is required.");
    if (uploading) {
      if (!file) return setError("Choose a file to upload.");
      if (file.size > MAX_MB * 1024 * 1024) return setError(`The file is too big. The maximum is ${MAX_MB} MB.`);
    } else if (!isUploadedFile && !/^https?:\/\//i.test(url.trim())) {
      return setError("The link must start with http:// or https://");
    }

    setError("");
    setSaving(true);
    try {
      if (uploading && file) await onUpload(file, title.trim(), description.trim() || undefined);
      else await onSave({ title: title.trim(), description: description.trim() || undefined, type, url: url.trim() });
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save the material."));
    } finally {
      setSaving(false);
    }
  }

  function chooseFile(selected: File | null) {
    setFile(selected);
    // Use the file name as a starting title
    if (selected && !title.trim()) setTitle(selected.name.replace(/\.[^.]+$/, ""));
  }

  return (
    <FormDialog
      open={open}
      title={material ? "Edit material" : "Add material"}
      description="Learners tick materials off as they go, and it counts towards their progress."
      error={error}
      saving={saving}
      submitLabel={uploading ? "Upload" : material ? "Save changes" : "Add material"}
      savingLabel={uploading ? "Uploading…" : "Saving…"}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      {!material && (
        <div role="radiogroup" aria-label="Kind of material" className="grid grid-cols-2 gap-1 rounded-xl bg-secondary p-1">
          {([
            { value: "link", label: "Link or video", icon: Link2 },
            { value: "upload", label: "Upload a file", icon: FileUp },
          ] as const).map((option) => (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={mode === option.value}
              onClick={() => setMode(option.value)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                mode === option.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <option.icon aria-hidden className="size-4" />
              {option.label}
            </button>
          ))}
        </div>
      )}

      {uploading ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            chooseFile(e.dataTransfer.files?.[0] ?? null);
          }}
          className={cn(
            "flex flex-col items-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors",
            dragging ? "border-sand bg-sand/10" : "border-border bg-secondary/40",
          )}
        >
          <span className="flex size-12 items-center justify-center rounded-2xl bg-card text-sand-deep shadow-xs">
            <FileUp aria-hidden className="size-6" />
          </span>
          <p className="mt-3 text-sm font-medium">{file ? file.name : "Drag a file here, or"}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {file
              ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
              : `PDF, Word, PowerPoint, Excel, ZIP, image or MP4 — up to ${MAX_MB} MB`}
          </p>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="mt-4 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium transition outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {file ? "Choose another file" : "Choose file"}
          </button>
          <input ref={fileInput} type="file" accept={ACCEPT} className="sr-only" tabIndex={-1} onChange={(e) => chooseFile(e.target.files?.[0] ?? null)} />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
          <SelectField label="Type" value={type} onChange={(value) => setType(value as MaterialType)} options={TYPES.map((t) => ({ value: t, label: t }))} />
          <FormField
            label={isUploadedFile ? "Uploaded file" : "Link"}
            placeholder="https://"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isUploadedFile}
            hint={isUploadedFile ? "To replace the file, delete this material and upload a new one." : "YouTube links play inside the course page."}
          />
        </div>
      )}

      <FormField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <TextareaField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
    </FormDialog>
  );
}

export default MaterialFormDialog;
