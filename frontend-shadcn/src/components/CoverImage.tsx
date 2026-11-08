import { useState } from "react";
import TopicCover from "@/components/TopicCover";
import { cn } from "@/lib/utils";

type CoverImageProps = {
  src: string | null;
  // Its first letter is shown on the placeholder
  title: string;
  // Helps pick the illustration, e.g. the category name
  hint?: string;
  // "illustration" (default) = drawn scene for the topic; "letter" = first letter (e.g. partner logos)
  fallback?: "illustration" | "letter";
  className?: string;
  // Extra classes for the <img> itself, e.g. a hover zoom
  imageClassName?: string;
  letterClassName?: string;
};

// A cover picture that falls back to a branded placeholder when the image is missing or fails to load
function CoverImage({
  src,
  title,
  hint,
  fallback = "illustration",
  className,
  imageClassName,
  letterClassName,
}: CoverImageProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className={cn("overflow-hidden bg-secondary", className)}>
      {src && !imageFailed ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          onError={() => setImageFailed(true)}
          className={cn("size-full object-cover", imageClassName)}
        />
      ) : fallback === "illustration" ? (
        <TopicCover title={title} hint={hint} className={cn("size-full", imageClassName)} />
      ) : (
        <div
          aria-hidden
          className="flex size-full items-center justify-center bg-linear-to-br from-primary via-[#5a3f26] to-[#7a5632]"
        >
          <span
            className={cn(
              "font-heading text-7xl font-semibold text-sand/40",
              letterClassName,
            )}
          >
            {title.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}

export default CoverImage;
