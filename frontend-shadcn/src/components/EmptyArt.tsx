import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyArtProps = {
  icon: LucideIcon;
  size?: "sm" | "md";
};

// Small illustration for empty and error states: an Andalusian arch with the icon inside,
// a soft glow and a few floating shapes
function EmptyArt({ icon: Icon, size = "md" }: EmptyArtProps) {
  const small = size === "sm";
  return (
    <div aria-hidden className={cn("relative mx-auto", small ? "h-24 w-24" : "h-36 w-36")}>
      <div className="absolute inset-2 rounded-full bg-sand/25 blur-2xl" />
      <span className={cn("absolute animate-float rounded-full bg-sand/70", small ? "top-1 left-0 size-2" : "top-3 left-1 size-3")} />
      <span className={cn("absolute animate-float-slow rounded-md bg-primary/30 rotate-12", small ? "right-0 bottom-4 size-3" : "right-1 bottom-7 size-4")} />
      <span className={cn("absolute animate-float-slow rounded-full border-2 border-sand", small ? "top-3 right-2 size-2.5" : "top-6 right-3 size-3.5")} />
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 overflow-hidden rounded-t-full border-4 border-sand/50 bg-linear-to-b from-primary to-[#7a5632] shadow-xl shadow-primary/20",
          small ? "bottom-1 h-20 w-16" : "bottom-2 h-28 w-24",
        )}
      >
        <div className="bg-andalusia-pattern absolute inset-0 opacity-25" />
        <Icon className={cn("absolute left-1/2 -translate-x-1/2 text-sand", small ? "bottom-4 size-7" : "bottom-6 size-10")} strokeWidth={1.6} />
      </div>
    </div>
  );
}

export default EmptyArt;
