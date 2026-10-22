import type { FormEvent, ReactNode } from "react";
import { CircleAlert, LoaderCircle } from "lucide-react";
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
  onClose,
  onSubmit,
  children,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
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

          <DialogFooter className="mx-0 mb-0 px-5">
            <Button type="button" variant="outline" className="rounded-full px-4" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="rounded-full px-5" disabled={saving || disabled}>
              {saving && <LoaderCircle aria-hidden className="animate-spin" />}
              {saving ? savingLabel : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default FormDialog;
