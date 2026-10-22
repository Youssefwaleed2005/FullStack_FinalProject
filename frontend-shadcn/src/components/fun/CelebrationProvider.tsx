import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { CelebrationContext, type Celebration } from "@/lib/celebrationContext";
import { fireConfetti } from "@/lib/confetti";

type Toast = Celebration & { id: number };

// Wraps the app: any page can call useCelebrate().celebrate(...)
function CelebrationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const celebrate = useCallback(
    (celebration: Celebration) => {
      fireConfetti(celebration.big ? "big" : "small");
      const id = nextId.current++;
      // Keep at most 3 on screen
      setToasts((prev) => [...prev.slice(-2), { ...celebration, id }]);
      window.setTimeout(() => dismiss(id), celebration.big ? 5500 : 3200);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ celebrate }), [celebrate]);

  return (
    <CelebrationContext.Provider value={value}>
      {children}

      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-60 flex flex-col items-end gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-sand/60 bg-card p-4 shadow-xl shadow-primary/10 duration-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 motion-reduce:animate-none"
          >
            <span aria-hidden className="text-2xl leading-none">
              {toast.emoji ?? (toast.big ? "🎉" : "✨")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{toast.title}</p>
              {toast.message && (
                <p className="mt-0.5 text-sm text-muted-foreground">{toast.message}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss"
              className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </CelebrationContext.Provider>
  );
}

export default CelebrationProvider;
