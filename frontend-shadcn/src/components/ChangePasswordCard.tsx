import { useState, type FormEvent } from "react";
import { CircleAlert, KeyRound, LoaderCircle } from "lucide-react";
import FormField from "@/components/FormField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getApiErrorMessage, getApiFieldErrors } from "@/services/api";
import { changePassword } from "@/services/authService";

const EMPTY = { currentPassword: "", newPassword: "", confirmPassword: "" };

// Profile page: change your password (you need the current one)
function ChangePasswordCard({ className }: { className?: string }) {
  const [form, setForm] = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const dirty = Object.values(form).some(Boolean);

  function set(name: keyof typeof EMPTY, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const errors: Record<string, string> = {};
    if (!form.currentPassword) errors.currentPassword = "Enter your current password.";
    if (form.newPassword.length < 8) errors.newPassword = "Use at least 8 characters.";
    if (form.confirmPassword !== form.newPassword) errors.confirmPassword = "Passwords do not match.";
    setFieldErrors(errors);
    setError("");
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      await changePassword(form);
      setForm(EMPTY);
      toast.success("Password changed.", "Use your new password next time you log in.");
    } catch (saveError) {
      setFieldErrors(getApiFieldErrors(saveError));
      setError(getApiErrorMessage(saveError, "Could not change your password."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={cn(panelStyle, "p-6 sm:p-8", className)}>
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-sand/15 text-sand-deep">
          <KeyRound aria-hidden className="size-5" />
        </span>
        <div>
          <h2 className="text-2xl font-semibold">Change password</h2>
          <p className="text-sm text-muted-foreground">At least 8 characters.</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-5">
          <CircleAlert />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <FormField
          label="Current password"
          type="password"
          autoComplete="current-password"
          className="sm:col-span-2"
          value={form.currentPassword}
          error={fieldErrors.currentPassword || undefined}
          onChange={(e) => set("currentPassword", e.target.value)}
        />
        <FormField
          label="New password"
          type="password"
          autoComplete="new-password"
          value={form.newPassword}
          error={fieldErrors.newPassword || undefined}
          onChange={(e) => set("newPassword", e.target.value)}
        />
        <FormField
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          value={form.confirmPassword}
          error={fieldErrors.confirmPassword || undefined}
          onChange={(e) => set("confirmPassword", e.target.value)}
        />
      </div>

      <Button type="submit" size="lg" disabled={saving || !dirty} className="mt-7 h-11 rounded-full px-6">
        {saving && <LoaderCircle data-icon="inline-start" className="animate-spin" />}
        {saving ? "Saving…" : "Change password"}
      </Button>
    </form>
  );
}

export default ChangePasswordCard;
