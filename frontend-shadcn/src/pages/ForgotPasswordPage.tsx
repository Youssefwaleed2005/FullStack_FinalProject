import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { CircleAlert, CircleCheck, LoaderCircle, MailCheck } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import FormField from "@/components/FormField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/services/api";
import { forgotPassword } from "@/services/authService";

const linkStyle =
  "rounded-sm font-medium text-sand-deep underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50";

// Step 1 of resetting a password: ask for a reset link
function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<{ message: string; link: string | null } | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setEmailError("Enter a valid email.");
      return;
    }
    setEmailError("");
    setSending(true);
    try {
      const result = await forgotPassword(email.trim());
      setSent({ message: result.message, link: result.devResetLink });
    } catch (sendError) {
      setError(getApiErrorMessage(sendError, "Could not send the reset link."));
    } finally {
      setSending(false);
    }
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      description="Enter your email and we'll send you a link to choose a new one."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className={linkStyle}>
            Log in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="flex flex-col gap-4">
          <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
            <MailCheck />
            <AlertDescription className="text-inherit">{sent.message}</AlertDescription>
          </Alert>
          {sent.link && (
            // Development only: no email service, so the backend hands us the link for the demo
            <div className="rounded-xl border border-dashed border-sand bg-sand/10 p-4 text-sm">
              <p className="font-semibold">Demo mode</p>
              <p className="mt-1 text-muted-foreground">There is no email service, so here is the link that would be emailed:</p>
              <a href={sent.link} className={`${linkStyle} mt-2 inline-flex items-center gap-1.5`}>
                <CircleCheck aria-hidden className="size-4" /> Open the reset link
              </a>
            </div>
          )}
        </div>
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
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              error={emailError || undefined}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" size="lg" disabled={sending} className="h-11 rounded-full text-base">
              {sending && <LoaderCircle data-icon="inline-start" className="animate-spin" />}
              {sending ? "Sending…" : "Send reset link"}
            </Button>
          </form>
        </>
      )}
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
