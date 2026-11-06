import { useContext } from "react";
import { ToastContext } from "@/lib/toastContext";

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside a ToastProvider.");
  }
  return context;
}
