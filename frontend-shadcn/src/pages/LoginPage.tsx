import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CircleAlert, LoaderCircle } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import FormField from "@/components/FormField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { homeForRoles } from "@/lib/navigation";
import { getApiErrorMessage } from "@/services/api";

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

const linkStyle =
  "rounded-sm font-medium text-sand-deep underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Where the user was heading before being sent to log in
  // (no "from" = they opened the login page directly; they go to their own dashboard)
  const from = (location.state as { from?: string } | null)?.from;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const errors: Record<string, string> = {};
    if (!email.trim()) errors.email = "Email is required.";
    else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email.";
    if (!password) errors.password = "Password is required.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const signedIn = await login({ email, password, rememberMe });
      navigate(from ?? homeForRoles(signedIn.roles), { replace: true });
    } catch (loginError) {
      setError(getApiErrorMessage(loginError, "Could not sign you in."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Log in to apply for courses and follow your learning."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/register" state={location.state} className={linkStyle}>
            Create one
          </Link>
        </>
      }
    >
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
          onChange={(event) => setEmail(event.target.value)}
          error={fieldErrors.email}
        />
        <FormField
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={fieldErrors.password}
        />

        <Label className="font-normal text-muted-foreground">
          <Checkbox
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
          />
          Remember me
        </Label>

        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="mt-1 h-11 rounded-full text-base"
        >
          {submitting && (
            <LoaderCircle data-icon="inline-start" className="animate-spin" />
          )}
          {submitting ? "Logging in…" : "Log in"}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
