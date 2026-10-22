import { useState } from "react";
import { LoaderCircle, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type ConfirmRequest = {
  title: string;
  description: string;
  confirmLabel: string;
  // Red button for destructive actions (delete, deactivate)
  danger?: boolean;
  onConfirm: () => Promise<void>;
};

type ConfirmDialogProps = {
  request: ConfirmRequest | null;
  onClose: () => void;
};

// "Are you sure?" dialog, a nicer replacement for window.confirm
function ConfirmDialog({ request, onClose }: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false);

  async function handleConfirm() {
    if (!request) return;
    setBusy(true);
    try {
      await request.onConfirm();
    } finally {
      setBusy(false);
      onClose();
    }
  }

  return (
    <Dialog open={request !== null} onOpenChange={(open) => !open && !busy && onClose()}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader className="flex-row items-start gap-4 text-left">
          {request?.danger && (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <TriangleAlert aria-hidden className="size-5" />
            </span>
          )}
          <div className="flex flex-col gap-1.5">
            <DialogTitle className="text-lg">{request?.title}</DialogTitle>
            <DialogDescription>{request?.description}</DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" className="rounded-full px-4" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button
            className={request?.danger ? "rounded-full bg-destructive px-4 text-white hover:bg-destructive/90" : "rounded-full px-4"}
            onClick={handleConfirm}
            disabled={busy}
          >
            {busy && <LoaderCircle aria-hidden className="animate-spin" />}
            {request?.confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmDialog;
