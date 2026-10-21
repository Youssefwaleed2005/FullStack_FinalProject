import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import LinkIcon from "@mui/icons-material/Link";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import MaterialViewerDialog from "../MaterialViewerDialog";
import { getApiErrorMessage } from "../../services/api";
import { getLearnerMaterials, setMaterialCompletion } from "../../services/learnerService";
import type { LearnerMaterial, LearnerProgress } from "../../types/Learner";
import type { MaterialType } from "../../types/Lms";
import { formatDate } from "../../utils/formatDate";
import { canPreview, MATERIAL_TYPE_LABELS, resolveMaterialUrl } from "../../utils/materialLinks";

const TYPE_ICONS: Record<MaterialType, React.ReactNode> = {
  Document: <PictureAsPdfIcon color="error" />,
  Video: <PlayCircleIcon color="secondary" />,
  Link: <LinkIcon color="action" />,
  File: <InsertDriveFileIcon color="action" />,
};

type Props = {
  courseId: number;
  canComplete: boolean; // false when the enrollment is read-only
  onProgressChange: (progress: LearnerProgress) => void;
};

function LearnerMaterialsTab({ courseId, canComplete, onProgressChange }: Props) {
  const [materials, setMaterials] = useState<LearnerMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [viewing, setViewing] = useState<LearnerMaterial | null>(null);

  useEffect(() => {
    let active = true;
    getLearnerMaterials(courseId)
      .then((data) => {
        if (active) setMaterials(data);
      })
      .catch((err) => {
        if (active) setError(getApiErrorMessage(err, "Could not load materials."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [courseId]);

  async function toggle(material: LearnerMaterial) {
    setBusyId(material.id);
    setError("");
    try {
      const result = await setMaterialCompletion(material.id, !material.isCompleted);
      const update = (m: LearnerMaterial) =>
        m.id === material.id
          ? { ...m, isCompleted: result.isCompleted, completedAt: result.isCompleted ? new Date().toISOString() : null }
          : m;
      setMaterials((prev) => prev.map(update));
      setViewing((prev) => (prev ? update(prev) : prev));
      onProgressChange(result.progress); // moves the progress bar in the header
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not update this material."));
    } finally {
      setBusyId(null);
    }
  }

  function open(material: LearnerMaterial) {
    if (canPreview(material.url)) setViewing(material);
    else window.open(resolveMaterialUrl(material.url), "_blank", "noopener");
  }

  if (loading) return <CircularProgress />;
  if (materials.length === 0) {
    return (
      <Typography sx={{ color: "text.secondary" }}>
        No materials yet. Your instructor will add them here.
      </Typography>
    );
  }

  const done = materials.filter((m) => m.isCompleted).length;
  const percent = Math.round((done * 100) / materials.length);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 1 }}>
        <Typography variant="h6">Materials</Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {done} / {materials.length} done
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percent}
        color="success"
        sx={{ height: 6, borderRadius: 3, mb: 2 }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper>
        {materials.map((m, i) => (
          <Box key={m.id}>
            {i > 0 && <Divider />}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 2,
                opacity: m.isCompleted ? 0.75 : 1,
              }}
            >
              <Tooltip title={canComplete ? (m.isCompleted ? "Mark as not done" : "Mark as done") : ""}>
                <span>
                  <Checkbox
                    checked={m.isCompleted}
                    onChange={() => toggle(m)}
                    disabled={!canComplete || busyId === m.id}
                    color="success"
                    slotProps={{ input: { "aria-label": `Mark ${m.title} as done` } }}
                  />
                </span>
              </Tooltip>

              <Box sx={{ display: { xs: "none", sm: "flex" } }}>{TYPE_ICONS[m.type]}</Box>

              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    wordBreak: "break-word",
                    textDecoration: m.isCompleted ? "line-through" : "none",
                  }}
                >
                  {m.title}
                </Typography>
                {m.description && (
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {m.description}
                  </Typography>
                )}
                <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 0.5, flexWrap: "wrap" }}>
                  <Chip size="small" variant="outlined" label={MATERIAL_TYPE_LABELS[m.type]} />
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Added {formatDate(m.createdAt)}
                    {m.isCompleted && m.completedAt ? ` · Done ${formatDate(m.completedAt)}` : ""}
                  </Typography>
                </Box>
              </Box>

              <Button variant="outlined" color="secondary" size="small" onClick={() => open(m)}>
                {m.type === "Video" ? "Watch" : "Open"}
              </Button>
            </Box>
          </Box>
        ))}
      </Paper>

      {viewing && (
        <MaterialViewerDialog
          material={viewing}
          onClose={() => setViewing(null)}
          isCompleted={viewing.isCompleted}
          onToggleComplete={canComplete ? () => toggle(viewing) : undefined}
          busy={busyId === viewing.id}
        />
      )}
    </>
  );
}

export default LearnerMaterialsTab;
