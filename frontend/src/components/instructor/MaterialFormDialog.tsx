import { useState } from "react";
import type { FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { getApiErrorMessage } from "../../services/api";
import type { Material, MaterialRequest, MaterialType } from "../../types/Lms";

const TYPES: MaterialType[] = ["Link", "Video", "Document", "File"];
const ACCEPT = ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.png,.jpg,.jpeg,.mp4";
const MAX_MB = 25;

type Props = {
  open: boolean;
  material: Material | null; // null = new
  onClose: () => void;
  onSave: (payload: MaterialRequest) => Promise<void>;
  onUpload: (file: File, title: string, description?: string) => Promise<void>;
};

function MaterialFormDialog({ open, material, onClose, onSave, onUpload }: Props) {
  const isUploadedFile = material?.url.startsWith("/") ?? false;

  // New materials can be a link OR an uploaded file; editing keeps the same kind
  const [mode, setMode] = useState<"link" | "upload">("link");
  const [title, setTitle] = useState(material?.title ?? "");
  const [description, setDescription] = useState(material?.description ?? "");
  const [type, setType] = useState<MaterialType>(material?.type ?? "Link");
  const [url, setUrl] = useState(material?.url ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!material && mode === "upload") {
      if (!file) {
        setError("Choose a file to upload.");
        return;
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        setError(`The file is too big. The maximum is ${MAX_MB} MB.`);
        return;
      }
    } else if (!isUploadedFile && !/^https?:\/\//i.test(url.trim())) {
      setError("The link must start with http:// or https://");
      return;
    }

    setError("");
    setSaving(true);
    try {
      if (!material && mode === "upload") {
        await onUpload(file!, title.trim(), description || undefined);
      } else {
        await onSave({ title: title.trim(), description: description || undefined, type, url: url.trim() });
      }
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogTitle>{material ? "Edit material" : "Add material"}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!material && (
            <ToggleButtonGroup
              exclusive
              fullWidth
              size="small"
              value={mode}
              onChange={(_, value) => value && setMode(value)}
              sx={{ mb: 1 }}
            >
              <ToggleButton value="link">Link or video</ToggleButton>
              <ToggleButton value="upload">Upload a file (PDF…)</ToggleButton>
            </ToggleButtonGroup>
          )}

          {!material && mode === "upload" ? (
            <Box sx={{ my: 2 }}>
              <Button component="label" variant="outlined" color="secondary" startIcon={<UploadFileIcon />}>
                Choose file
                <input hidden type="file" accept={ACCEPT} onChange={(e) => chooseFile(e.target.files?.[0] ?? null)} />
              </Button>
              <Typography variant="body2" sx={{ mt: 1, color: file ? "text.primary" : "text.secondary" }}>
                {file
                  ? `${file.name} · ${(file.size / 1024 / 1024).toFixed(1)} MB`
                  : `PDF, Word, PowerPoint, Excel, ZIP, image or MP4 — up to ${MAX_MB} MB`}
              </Typography>
            </Box>
          ) : (
            <>
              <TextField
                select
                fullWidth
                margin="normal"
                label="Type"
                value={type}
                onChange={(e) => setType(e.target.value as MaterialType)}
              >
                {TYPES.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                margin="normal"
                label={isUploadedFile ? "Uploaded file" : "Link (YouTube, Microsoft Learn, Drive, website...)"}
                placeholder="https://"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isUploadedFile}
                helperText={
                  isUploadedFile
                    ? "This file was uploaded. To replace it, delete this material and upload a new one."
                    : "YouTube links play inside the course page."
                }
              />
            </>
          )}

          <TextField
            fullWidth
            margin="normal"
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            multiline
            minRows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="secondary" disabled={saving}>
            {saving ? "Saving..." : !material && mode === "upload" ? "Upload" : "Save"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default MaterialFormDialog;
