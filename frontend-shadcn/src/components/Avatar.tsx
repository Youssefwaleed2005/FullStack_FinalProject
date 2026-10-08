import { useState } from "react";
import { cn } from "@/lib/utils";

type AvatarProps = {
  name: string;
  photoUrl?: string | null;
  className?: string;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

// Round photo of a person; shows their initials when there is no photo or it fails to load
function Avatar({ name, photoUrl, className }: AvatarProps) {
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <span
      aria-hidden
      className={cn(
        "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-xs font-semibold text-secondary-foreground",
        className,
      )}
    >
      {photoUrl && !photoFailed ? (
        <img
          src={photoUrl}
          alt=""
          loading="lazy"
          onError={() => setPhotoFailed(true)}
          className="size-full object-cover"
        />
      ) : (
        getInitials(name)
      )}
    </span>
  );
}

export default Avatar;
