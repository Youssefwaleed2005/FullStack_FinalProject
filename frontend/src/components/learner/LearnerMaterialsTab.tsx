import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Link as MuiLink,
  Paper,
  Typography,
} from "@mui/material";
import { getApiErrorMessage } from "../../services/api";
import { getLearnerMaterials } from "../../services/learnerService";
import type { Material } from "../../types/Lms";
import { formatDate } from "../../utils/formatDate";

function LearnerMaterialsTab({ courseId }: { courseId: number }) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getLearnerMaterials(courseId)
      .then((data) => {
        if (active) setMaterials(data);
      })
      .catch((err) => {
        if (active)
          setError(getApiErrorMessage(err, "Could not load materials."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [courseId]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (materials.length === 0) {
    return (
      <Typography sx={{ color: "text.secondary" }}>
        No materials yet. Your instructor will add them here.
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Materials
      </Typography>
      <Paper>
        {materials.map((m, i) => (
          <Box key={m.id}>
            {i > 0 && <Divider />}
            <Box sx={{ p: 2, minWidth: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Chip size="small" label={m.type} variant="outlined" />
                <MuiLink
                  href={m.url}
                  target="_blank"
                  rel="noopener"
                  color="secondary"
                  sx={{ wordBreak: "break-word" }}
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
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Added {formatDate(m.createdAt)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Paper>
    </>
  );
}

export default LearnerMaterialsTab;
