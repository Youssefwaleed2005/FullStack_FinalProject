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
} from "@mui/material";
import { getApiErrorMessage } from "../../services/api";
import type { Material, MaterialRequest, MaterialType } from "../../types/Lms";

const TYPES: MaterialType[] = ["Link", "Document", "Video", "File"];

type Props = {
  open: boolean;
  material: Material | null; // null = new
  onClose: () => void;
  onSave: (payload: MaterialRequest) => Promise<void>;
};

function MaterialFormDialog({ open, material, onClose, onSave }: Props) {
  const [title, setTitle] = useState(material?.title ?? "");
  const [description, setDescription] = useState(material?.description ?? "");
  const [type, setType] = useState<MaterialType>(material?.type ?? "Link");
  const [url, setUrl] = useState(material?.url ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !url.trim()) {
      setError("Title and link are required.");
      return;
    }
    if (!/^https?:\/\//i.test(url.trim())) {
      setError("The link must start with http:// or https://");
      return;
    }

    setError("");
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description: description || undefined,
        type,
        url: url.trim(),
      });
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save the material."));
    } finally {
      setSaving(false);
    }
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
          <TextField
            fullWidth
            margin="normal"
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
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
            label="Link (Drive, YouTube, website...)"
            placeholder="https://"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
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
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default MaterialFormDialog;
