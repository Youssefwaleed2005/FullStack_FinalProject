import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  // Usually a "View all" link, shown on the right
  action?: ReactNode;
  // "light" is for sections with a dark background
  tone?: "dark" | "light";
};

function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  tone = "dark",
}: SectionHeadingProps) {
  return (
    <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p
          className={cn(
            "text-xs font-semibold tracking-[0.2em] uppercase",
            tone === "dark" ? "text-sand-deep" : "text-sand",
          )}
        >
          {eyebrow}
        </p>
        <h2 className="mt-3 text-3xl leading-tight font-semibold text-balance sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "mt-3 text-base leading-relaxed",
              tone === "dark"
                ? "text-muted-foreground"
                : "text-primary-foreground/70",
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export default SectionHeading;
