import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import { Toast } from "radix-ui";
import { ToastContext, type ToastTone } from "@/lib/toastContext";
import { cn } from "@/lib/utils";

type ToastItem = {
  id: number;
  tone: ToastTone;
  title: string;
  description?: string;
  open: boolean;
};

const TONES = {
  success: { icon: CircleCheck, iconClass: "text-emerald-600 dark:text-emerald-400" },
  error: { icon: CircleAlert, iconClass: "text-destructive" },
  info: { icon: Info, iconClass: "text-sand-deep" },
};

// Older toasts are dropped when more than this many are on screen
const MAX_TOASTS = 3;

// Small pop-up messages for results ("Profile updated.", "Payment declined"…).
// Shown top-right under the navbar, so they don't cover the chat button.
function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const show = useCallback((tone: ToastTone, title: string, description?: string) => {
    nextId.current += 1;
    const toast = { id: nextId.current, tone, title, description, open: true };
    setToasts((current) => [...current, toast].slice(-MAX_TOASTS));
  }, []);

  // Close first so the exit animation can play, then drop it from the list
  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.map((toast) => (toast.id === id ? { ...toast, open: false } : toast)));
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 300);
  }, []);

  const value = useMemo(
    () => ({
      success: (title: string, description?: string) => show("success", title, description),
      error: (title: string, description?: string) => show("error", title, description),
      info: (title: string, description?: string) => show("info", title, description),
    }),
    [show],
  );

  return (
    <Toast.Provider swipeDirection="right" label="Notifications">
      <ToastContext.Provider value={value}>{children}</ToastContext.Provider>

      {toasts.map((toast) => {
        const { icon: Icon, iconClass } = TONES[toast.tone];
        return (
          <Toast.Root
            key={toast.id}
            open={toast.open}
            onOpenChange={(open) => {
              if (!open) dismiss(toast.id);
            }}
            // Errors stay longer and are announced straight away
            type={toast.tone === "error" ? "foreground" : "background"}
            duration={toast.tone === "error" ? 7000 : 4000}
            className="pointer-events-auto relative flex w-full items-start gap-3 rounded-2xl border border-border bg-popover p-4 pr-10 text-popover-foreground shadow-lg shadow-primary/10 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-right-full data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-right-full data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform data-[swipe=end]:translate-x-(--radix-toast-swipe-end-x) data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[swipe=move]:transition-none motion-reduce:animate-none"
          >
            <Icon aria-hidden className={cn("mt-0.5 size-5 shrink-0", iconClass)} />
            <div className="min-w-0 flex-1">
              <Toast.Title className="text-sm font-semibold">{toast.title}</Toast.Title>
              {toast.description && (
                <Toast.Description className="mt-0.5 text-sm text-muted-foreground">
                  {toast.description}
                </Toast.Description>
              )}
            </div>
            <Toast.Close
              aria-label="Dismiss"
              className="absolute top-3 right-3 rounded-md p-1 text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <X className="size-4" />
            </Toast.Close>
          </Toast.Root>
        );
      })}

      {/* Above dialogs (z-50), so a dialog's own save message is visible too */}
      <Toast.Viewport className="fixed top-20 right-4 z-100 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 outline-none" />
    </Toast.Provider>
  );
}

export default ToastProvider;
