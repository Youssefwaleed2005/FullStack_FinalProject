import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CircleAlert, LoaderCircle } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import FormField from "@/components/FormField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { getApiErrorMessage, getApiFieldErrors } from "@/services/api";
import { resetPassword } from "@/services/authService";

const linkStyle =
  "rounded-sm font-medium text-sand-deep underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50";

// Step 2: the link from the email opens this page with ?email=…&token=…
function ResetPasswordPage() {
  const [params] = useSearchParams();
  const email = params.get("email") ?? "";
  const token = params.get("token") ?? "";
  const navigate = useNavigate();
  const toast = useToast();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const errors: Record<string, string> = {};
    if (newPassword.length < 8) errors.newPassword = "Use at least 8 characters.";
    if (confirmPassword !== newPassword) errors.confirmPassword = "Passwords do not match.";
    setFieldErrors(errors);
    setError("");
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      await resetPassword({ email, token, newPassword, confirmPassword });
      toast.success("Password reset.", "You can log in with your new password now.");
      navigate("/login", { replace: true });
    } catch (resetError) {
      setFieldErrors(getApiFieldErrors(resetError));
      setError(getApiErrorMessage(resetError, "Could not reset your password."));
    } finally {
      setSaving(false);
    }
  }

  const invalidLink = !email || !token;

  return (
    <AuthLayout
      title="Choose a new password"
      description={invalidLink ? "This link is incomplete." : `For ${email}`}
      footer={
        <>
          Need a new link?{" "}
          <Link to="/forgot-password" className={linkStyle}>
            Request one
          </Link>
        </>
      }
    >
      {invalidLink ? (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertDescription>Open the full link from the email, or request a new one.</AlertDescription>
        </Alert>
      ) : (
        <>
          {error && (
            <Alert variant="destructive" className="mb-5">
              <CircleAlert />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <FormField
              label="New password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              error={fieldErrors.newPassword || undefined}
              hint="At least 8 characters"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <FormField
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              error={fieldErrors.confirmPassword || undefined}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button type="submit" size="lg" disabled={saving} className="h-11 rounded-full text-base">
              {saving && <LoaderCircle data-icon="inline-start" className="animate-spin" />}
              {saving ? "Saving…" : "Reset password"}
            </Button>
          </form>
        </>
      )}
    </AuthLayout>
  );
}

export default ResetPasswordPage;
