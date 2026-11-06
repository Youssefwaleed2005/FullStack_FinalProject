import { createContext } from "react";

export type ToastTone = "success" | "error" | "info";

// e.g. toast.success("Profile updated.") or toast.error("Could not save", message)
export type ToastContextValue = {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
};

// Filled in by ToastProvider, read with the useToast hook
export const ToastContext = createContext<ToastContextValue | undefined>(
  undefined,
);
