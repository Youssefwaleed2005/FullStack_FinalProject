import type { ReactNode } from "react";
import { Inbox, type LucideIcon } from "lucide-react";

type EmptyNoteProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
};

// Dashed box shown when a list is empty
function EmptyNote({ title, description, icon: Icon = Inbox, action }: EmptyNoteProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-sand-deep">
        <Icon aria-hidden className="size-6" strokeWidth={1.5} />
      </span>
      <p className="mt-4 font-semibold">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export default EmptyNote;
