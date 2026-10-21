import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Link as MuiLink,
  Paper,
  Typography,
} from "@mui/material";
import MaterialFormDialog from "./MaterialFormDialog";
import MaterialViewerDialog from "../MaterialViewerDialog";
import { canPreview, resolveMaterialUrl } from "../../utils/materialLinks";
import { getApiErrorMessage } from "../../services/api";
import {
  createMaterial,
  deleteMaterial,
  getCourseMaterials,
  updateMaterial,
  uploadMaterial,
} from "../../services/instructorService";
import type { Material, MaterialRequest } from "../../types/Lms";
import { formatDate } from "../../utils/formatDate";

function MaterialsTab({ courseId }: { courseId: number }) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Material | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [viewing, setViewing] = useState<Material | null>(null);

  const load = useCallback(async () => {
    try {
      setMaterials(await getCourseMaterials(courseId));
      setError("");
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not load materials."));
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    load();
  }, [load]);

  function openForm(material: Material | null) {
    setEditing(material);
    setFormKey((k) => k + 1);
    setFormOpen(true);
  }

  async function handleUpload(file: File, title: string, description?: string) {
    await uploadMaterial(courseId, file, title, description);
    setFormOpen(false);
    await load();
  }

  async function handleSave(payload: MaterialRequest) {
    if (editing) await updateMaterial(editing.id, payload);
    else await createMaterial(courseId, payload);
    setFormOpen(false);
    await load();
  }

  async function handleDelete(material: Material) {
    if (!window.confirm(`Delete "${material.title}"?`)) return;
    try {
      await deleteMaterial(material.id);
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not delete the material."));
    }
  }

  if (loading) return <CircularProgress />;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Materials</Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => openForm(null)}
        >
          Add material
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {materials.length === 0 ? (
        <Typography sx={{ color: "text.secondary" }}>
          No materials yet.
        </Typography>
      ) : (
        <Paper>
          {materials.map((m, i) => (
            <Box key={m.id}>
              {i > 0 && <Divider />}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                  p: 2,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip size="small" label={m.type} variant="outlined" />
                    <MuiLink
                      component="button"
                      type="button"
                      color="secondary"
                      onClick={() =>
                        canPreview(m.url)
                          ? setViewing(m)
                          : window.open(resolveMaterialUrl(m.url), "_blank", "noopener")
                      }
                      sx={{ textAlign: "left" }}
                    >
                      {m.title}
                    </MuiLink>
                  </Box>
                  {m.description && (
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", mt: 0.5 }}
                    >
                      {m.description}
                    </Typography>
                  )}
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Added {formatDate(m.createdAt)}
                  </Typography>
                </Box>
                <Box sx={{ whiteSpace: "nowrap" }}>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => openForm(m)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(m)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Box>
          ))}
        </Paper>
      )}

      <MaterialFormDialog
        key={formKey}
        open={formOpen}
        material={editing}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        onUpload={handleUpload}
      />

      {viewing && <MaterialViewerDialog material={viewing} onClose={() => setViewing(null)} />}
    </>
  );
}

export default MaterialsTab;
