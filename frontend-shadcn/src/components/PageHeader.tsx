import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  // Extra content under the text, e.g. a search box
  children?: ReactNode;
  className?: string;
};

// The tinted banner at the top of list pages
function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-linear-to-b from-secondary/70 to-background">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 size-96 rounded-full bg-sand/25 blur-3xl"
      />
      <div
        className={cn(
          "relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8",
          className,
        )}
      >
        <p className="text-xs font-semibold tracking-[0.2em] text-sand-deep uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl leading-tight font-semibold text-balance sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

export default PageHeader;
