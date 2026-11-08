import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type StarRatingProps = {
  value: number; // 0-5, halves shown as a half-filled star
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZES = { sm: "size-3.5", md: "size-4.5", lg: "size-6" };

// Read-only row of 5 stars
export function StarRating({ value, size = "sm", className }: StarRatingProps) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = Math.max(0, Math.min(1, value - (star - 1)));
        return (
          <span key={star} className={cn("relative", SIZES[size])}>
            <Star aria-hidden className={cn("absolute inset-0 text-amber-400/40", SIZES[size])} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star aria-hidden className={cn("fill-amber-400 text-amber-400", SIZES[size])} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

type StarInputProps = {
  value: number;
  onChange: (value: number) => void;
};

const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

// Clickable stars for writing a review (keyboard: arrow keys move between stars)
export function StarInput({ value, onChange }: StarInputProps) {
  return (
    <div className="flex items-center gap-3">
      <div role="radiogroup" aria-label="Your rating" className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            tabIndex={value === star || (value === 0 && star === 1) ? 0 : -1}
            onClick={() => onChange(star)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowUp") onChange(Math.min(5, (value || 0) + 1));
              if (e.key === "ArrowLeft" || e.key === "ArrowDown") onChange(Math.max(1, (value || 2) - 1));
            }}
            className="rounded-md p-0.5 transition outline-none hover:scale-110 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Star aria-hidden className={cn("size-7", star <= value ? "fill-amber-400 text-amber-400" : "text-muted-foreground/50")} />
          </button>
        ))}
      </div>
      <span className="text-sm font-medium text-muted-foreground">{LABELS[value]}</span>
    </div>
  );
}
