import { useState, type FormEvent, type ReactNode } from "react";
import { CircleAlert, LoaderCircle, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type FormDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  error?: string;
  saving: boolean;
  submitLabel: string;
  savingLabel?: string;
  size?: "md" | "lg";
  disabled?: boolean;
  // true = something was changed: closing asks "discard changes?". false = nothing changed: Save is disabled.
  // Leave it out for forms that don't track changes.
  dirty?: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
  children: ReactNode;
};

// Dialog with a form inside: title, error message, fields, Cancel / Save buttons
function FormDialog({
  open,
  title,
  description,
  error,
  saving,
  submitLabel,
  savingLabel = "Saving…",
  size = "md",
  disabled,
  dirty,
  onClose,
  onSubmit,
  children,
}: FormDialogProps) {
  const [confirmingClose, setConfirmingClose] = useState(false);

  // Don't lose edits by accident (Esc, clicking outside, Cancel)
  function requestClose() {
    if (dirty && !saving) setConfirmingClose(true);
    else onClose();
  }

  function discard() {
    setConfirmingClose(false);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && requestClose()}>
      <DialogContent
        className={cn(
          "max-h-[calc(100svh-2rem)] gap-0 overflow-y-auto p-0",
          size === "lg" ? "sm:max-w-3xl" : "sm:max-w-lg",
        )}
      >
        <form onSubmit={onSubmit} noValidate className="flex flex-col">
          <DialogHeader className="border-b border-border/70 p-5 pr-12">
            <DialogTitle className="text-xl">{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>

          <div className="flex flex-col gap-4 p-5">
            {error && (
              <Alert variant="destructive" className="border-destructive/30">
                <CircleAlert />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {children}
          </div>

          {confirmingClose ? (
            <div role="alertdialog" aria-label="Unsaved changes" className="flex flex-wrap items-center justify-between gap-3 border-t border-amber-200 bg-amber-50 px-5 py-4 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
              <p className="flex items-center gap-2 text-sm font-medium">
                <TriangleAlert aria-hidden className="size-4" /> You have unsaved changes. Discard them?
              </p>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="rounded-full px-4" onClick={() => setConfirmingClose(false)} autoFocus>
                  Keep editing
                </Button>
                <Button type="button" className="rounded-full bg-destructive px-4 text-white hover:bg-destructive/90" onClick={discard}>
                  Discard
                </Button>
              </div>
            </div>
          ) : (
            <DialogFooter className="mx-0 mb-0 items-center px-5">
              {dirty === false && <p className="mr-auto hidden text-xs text-muted-foreground sm:block">No changes yet</p>}
              <Button type="button" variant="outline" className="rounded-full px-4" onClick={requestClose}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-full px-5" disabled={saving || disabled || dirty === false}>
                {saving && <LoaderCircle aria-hidden className="animate-spin" />}
                {saving ? savingLabel : submitLabel}
              </Button>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default FormDialog;
