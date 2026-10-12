import { LoaderCircle } from "lucide-react";

type LoadingStateProps = {
  label?: string;
};

// Centered spinner shown while a page loads its data
function LoadingState({ label = "Loading…" }: LoadingStateProps) {
  return (
    <div
      role="status"
      className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-sm text-muted-foreground"
    >
      <LoaderCircle aria-hidden className="size-7 animate-spin text-sand-deep" />
      {label}
    </div>
  );
}

export default LoadingState;
