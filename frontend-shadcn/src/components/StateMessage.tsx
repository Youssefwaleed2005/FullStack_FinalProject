import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type StateMessageProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  // Usually a button, e.g. "Clear filters" or "Try again"
  action?: ReactNode;
};

// Centered message used for empty results, errors and placeholder pages
function StateMessage({
  icon: Icon,
  title,
  description,
  action,
}: StateMessageProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
      <span
        aria-hidden
        className="flex size-16 items-center justify-center rounded-2xl bg-secondary text-sand-deep"
      >
        <Icon className="size-7" strokeWidth={1.5} />
      </span>
      <h2 className="mt-6 text-2xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export default StateMessage;
