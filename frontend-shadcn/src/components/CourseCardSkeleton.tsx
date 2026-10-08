import { Skeleton } from "@/components/ui/skeleton";

// Grey placeholder with the same shape as CourseCard, shown while courses load
function CourseCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card">
      <Skeleton className="aspect-[16/10] rounded-none" />
      <div className="flex flex-1 flex-col p-5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-6 w-4/5" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-2/3" />
        <div className="mt-4 flex gap-4">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-3.5 w-24" />
        </div>
        <div className="mt-auto flex items-center justify-between pt-5">
          <div className="flex items-center gap-2.5">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </div>
  );
}

export default CourseCardSkeleton;
