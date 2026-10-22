import type { ReactNode } from "react";
import { panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";

type TableCardProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

// White panel with an optional title row, used around tables and lists
function TableCard({ title, description, action, children, className }: TableCardProps) {
  return (
    <section className={cn(panelStyle, "overflow-hidden", className)}>
      {(title || action) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-5 py-4">
          <div>
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export default TableCard;
