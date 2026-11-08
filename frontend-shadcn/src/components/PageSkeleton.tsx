import { Skeleton } from "@/components/ui/skeleton";
import { pageContainer } from "@/lib/styles";
import { cn } from "@/lib/utils";

type PageSkeletonProps = {
  // details = banner + text + side box, dashboard = banner + tiles + cards,
  // list = rows (inside a page), table = a table panel (inside a page)
  variant: "details" | "dashboard" | "list" | "table";
  label?: string;
};

// Grey placeholder shapes in the layout of the page that is loading
function PageSkeleton({ variant, label = "Loading…" }: PageSkeletonProps) {
  const status = <span className="sr-only">{label}</span>;

  if (variant === "list") {
    return (
      <div role="status" className="flex flex-col gap-3 py-2">
        {status}
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5">
            <Skeleton className="size-14 shrink-0 rounded-xl" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="hidden h-8 w-24 rounded-full sm:block" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div role="status" className="overflow-hidden rounded-2xl border border-border/60 bg-card">
        {status}
        <div className="border-b border-border/60 p-5">
          <Skeleton className="h-5 w-40" />
        </div>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-border/40 px-5 py-4 last:border-0">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="hidden h-4 w-20 sm:block" />
          </div>
        ))}
      </div>
    );
  }

  const banner = (
    <div className="border-b border-border/70 bg-secondary/40">
      <div className={cn(pageContainer, "flex flex-col gap-4 py-14")}>
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-10 w-2/3 max-w-xl" />
        <Skeleton className="h-4 w-1/2 max-w-md" />
      </div>
    </div>
  );

  if (variant === "dashboard") {
    return (
      <div role="status" className="flex flex-1 flex-col">
        {status}
        {banner}
        <div className={cn(pageContainer, "flex flex-col gap-8 py-10")}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // details
  return (
    <div role="status" className="flex flex-1 flex-col">
      {status}
      {banner}
      <div className={cn(pageContainer, "grid gap-10 py-12 lg:grid-cols-[1fr_22rem]")}>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="mt-6 h-7 w-56" />
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-5" />
            ))}
          </div>
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    </div>
  );
}

export default PageSkeleton;
