import { CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getYouTubeEmbedUrl, isPdf, resolveMaterialUrl } from "@/lib/materialLinks";
import type { LearnerMaterial } from "@/types/Learner";

type MaterialViewerDialogProps = {
  material: LearnerMaterial;
  onClose: () => void;
  canComplete: boolean;
  busy: boolean;
  onToggleComplete: () => void;
};

// Shows a PDF or a YouTube video inside the page, with "mark as done"
function MaterialViewerDialog({
  material,
  onClose,
  canComplete,
  busy,
  onToggleComplete,
}: MaterialViewerDialogProps) {
  const url = resolveMaterialUrl(material.url);
  const youTube = getYouTubeEmbedUrl(material.url);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[calc(100%-2rem)] gap-3 sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="pr-8 text-lg">{material.title}</DialogTitle>
          {material.description && (
            <DialogDescription>{material.description}</DialogDescription>
          )}
        </DialogHeader>

        <div className="overflow-hidden rounded-lg bg-muted">
          {youTube ? (
            <div className="relative aspect-video">
              <iframe
                src={youTube}
                title={material.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 size-full border-0"
              />
            </div>
          ) : isPdf(material.url) ? (
            <iframe
              src={url}
              title={material.title}
              className="block h-[65vh] w-full border-0 sm:h-[72vh]"
            />
          ) : (
            <p className="p-6 text-muted-foreground">This material opens in a new tab.</p>
          )}
        </div>

        <DialogFooter className="flex-wrap gap-2 sm:justify-between">
          <Button asChild variant="ghost">
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink aria-hidden className="size-4" />
              Open in new tab
            </a>
          </Button>
          {canComplete && (
            <Button
              onClick={onToggleComplete}
              disabled={busy}
              variant={material.isCompleted ? "outline" : "default"}
            >
              <CheckCircle2 aria-hidden className="size-4" />
              {material.isCompleted ? "Done — mark as not done" : "Mark as done"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MaterialViewerDialog;
