import { Eye, EyeOff, LoaderCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type ContentRowActionsProps = {
  // Used in the screen-reader labels, e.g. "Edit Microsoft"
  label: string;
  visible: boolean;
  busy: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

// Show / hide, edit and delete buttons for one partner or testimonial row
function ContentRowActions({ label, visible, busy, onToggle, onEdit, onDelete }: ContentRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button variant="outline" size="sm" className="w-20 rounded-full px-3" disabled={busy} onClick={onToggle}>
        {busy ? <LoaderCircle aria-hidden className="animate-spin" /> : visible ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
        {visible ? "Hide" : "Show"}
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label={`Edit ${label}`} onClick={onEdit}>
        <Pencil />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Delete ${label}`}
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={onDelete}
      >
        <Trash2 />
      </Button>
    </div>
  );
}

export default ContentRowActions;
