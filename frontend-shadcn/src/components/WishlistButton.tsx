import { Heart } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useWishlist } from "@/hooks/useWishlist";
import { toggleSaved } from "@/lib/wishlist";
import { cn } from "@/lib/utils";
import type { Course } from "@/types/Course";

type WishlistButtonProps = {
  course: Course;
  // "icon" = round heart on a card, "button" = heart with a label on the details page
  variant?: "icon" | "button";
  className?: string;
};

// Heart that saves / unsaves a course
function WishlistButton({ course, variant = "icon", className }: WishlistButtonProps) {
  const saved = useWishlist().some((c) => c.id === course.id);
  const toast = useToast();

  function handleClick() {
    const nowSaved = toggleSaved(course);
    if (nowSaved) toast.success("Saved for later", `"${course.title}" is in your saved courses.`);
    else toast.info("Removed from saved courses");
  }

  const label = saved ? `Remove ${course.title} from saved courses` : `Save ${course.title} for later`;

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={saved}
        className={cn(
          "inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border text-sm font-medium transition outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          saved
            ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
            : "border-border bg-card hover:bg-muted",
          className,
        )}
      >
        <Heart aria-hidden className={cn("size-4 transition-transform", saved && "scale-110 fill-current")} />
        {saved ? "Saved" : "Save for later"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={label}
      title={saved ? "Saved" : "Save for later"}
      className={cn(
        "relative z-10 flex size-9 items-center justify-center rounded-full bg-card/95 shadow-sm backdrop-blur transition outline-none hover:scale-110 focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:hover:scale-100",
        saved ? "text-rose-600" : "text-muted-foreground hover:text-rose-600",
        className,
      )}
    >
      <Heart aria-hidden className={cn("size-4.5", saved && "fill-current")} />
    </button>
  );
}

export default WishlistButton;
