import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { Material } from "../types/Lms";
import { getYouTubeEmbedUrl, isPdf, resolveMaterialUrl } from "../utils/materialLinks";

type Props = {
  material: Material;
  onClose: () => void;
  // Optional "mark as done" button (learner only)
  isCompleted?: boolean;
  onToggleComplete?: () => void;
  busy?: boolean;
};

// Shows a PDF or a YouTube video inside the page
function MaterialViewerDialog({ material, onClose, isCompleted, onToggleComplete, busy }: Props) {
  const url = resolveMaterialUrl(material.url);
  const youTube = getYouTubeEmbedUrl(material.url);

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        {material.title}
        {material.description && (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {material.description}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0, bgcolor: "#f5f5f5" }}>
        {youTube ? (
          <Box sx={{ position: "relative", pt: "56.25%" }}>
            <Box
              component="iframe"
              src={youTube}
              title={material.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
              sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
            />
          </Box>
        ) : isPdf(material.url) ? (
          <Box
            component="iframe"
            src={url}
            title={material.title}
            sx={{ width: "100%", height: { xs: "65vh", md: "75vh" }, border: 0, display: "block" }}
          />
        ) : (
          <Typography sx={{ p: 3 }}>This material opens in a new tab.</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ flexWrap: "wrap", gap: 1 }}>
        <Button href={url} target="_blank" rel="noopener" color="secondary">
          Open in new tab
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        {onToggleComplete && (
          <Button
            variant={isCompleted ? "outlined" : "contained"}
            color={isCompleted ? "success" : "secondary"}
            onClick={onToggleComplete}
            disabled={busy}
          >
            {isCompleted ? "✓ Done — mark as not done" : "Mark as done"}
          </Button>
        )}
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MaterialViewerDialog;
