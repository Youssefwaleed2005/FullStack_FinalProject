import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CircleAlert, LoaderCircle } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import FormField from "@/components/FormField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/services/api";

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

const INITIAL = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  country: "",
  preferredLanguage: "",
  password: "",
  confirmPassword: "",
};

type FieldName = keyof typeof INITIAL;

const linkStyle =
  "rounded-sm font-medium text-sand-deep underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50";

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Carried over from the login page, so the user still lands where they were heading
  const from = (location.state as { from?: string } | null)?.from ?? "/profile";

  const [form, setForm] = useState(INITIAL);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function setField(name: FieldName, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  // Props shared by every text field: its value, change handler and error
  function fieldProps(name: FieldName) {
    return {
      value: form[name],
      onChange: (event: ChangeEvent<HTMLInputElement>) =>
        setField(name, event.target.value),
      error: fieldErrors[name],
    };
  }

  function validate() {
    const errors: Record<string, string> = {};
    if (!form.firstName.trim()) errors.firstName = "First name is required.";
    if (!form.lastName.trim()) errors.lastName = "Last name is required.";
    if (!form.email.trim()) errors.email = "Email is required.";
    else if (!EMAIL_PATTERN.test(form.email))
      errors.email = "Enter a valid email.";
    if (form.password.length < 8)
      errors.password = "Password must be at least 8 characters.";
    if (form.confirmPassword !== form.password)
      errors.confirmPassword = "Passwords do not match.";
    if (!acceptedTerms)
      errors.acceptedTerms = "You must accept the terms and conditions.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        phoneNumber: form.phoneNumber || undefined,
        country: form.country || undefined,
        preferredLanguage: form.preferredLanguage || undefined,
        acceptedTerms,
      });
      navigate(from, { replace: true });
    } catch (registerError) {
      setError(
        getApiErrorMessage(registerError, "Could not create your account."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Join Andalusia Academy to apply for courses and programs."
      className="max-w-xl"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" state={location.state} className={linkStyle}>
            Log in
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

      <form
        onSubmit={handleSubmit}
        noValidate
        className="grid gap-5 sm:grid-cols-2"
      >
        <FormField
          label="First name"
          autoComplete="given-name"
          {...fieldProps("firstName")}
        />
        <FormField
          label="Last name"
          autoComplete="family-name"
          {...fieldProps("lastName")}
        />
        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          className="sm:col-span-2"
          {...fieldProps("email")}
        />
        <FormField
          label="Mobile number"
          type="tel"
          autoComplete="tel"
          hint="Optional"
          {...fieldProps("phoneNumber")}
        />
        <FormField
          label="Country"
          autoComplete="country-name"
          hint="Optional"
          {...fieldProps("country")}
        />
        <FormField
          label="Preferred language"
          hint="Optional"
          className="sm:col-span-2"
          {...fieldProps("preferredLanguage")}
        />
        <FormField
          label="Password"
          type="password"
          autoComplete="new-password"
          {...fieldProps("password")}
        />
        <FormField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          {...fieldProps("confirmPassword")}
        />

        <div className="sm:col-span-2">
          <Label className="font-normal text-muted-foreground">
            <Checkbox
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
              aria-invalid={fieldErrors.acceptedTerms ? true : undefined}
            />
            I accept the terms and conditions
          </Label>
          {fieldErrors.acceptedTerms && (
            <p className="mt-2 text-xs text-destructive">
              {fieldErrors.acceptedTerms}
            </p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="h-11 rounded-full text-base sm:col-span-2"
        >
          {submitting && (
            <LoaderCircle data-icon="inline-start" className="animate-spin" />
          )}
          {submitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;
