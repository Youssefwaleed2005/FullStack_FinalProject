import { useState, type FormEvent } from "react";
import { CircleAlert, CircleCheck, CloudOff, LoaderCircle } from "lucide-react";
import AccountLayout from "@/components/AccountLayout";
import Avatar from "@/components/Avatar";
import FormField from "@/components/FormField";
import LoadingState from "@/components/LoadingState";
import StateMessage from "@/components/StateMessage";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useApiData } from "@/hooks/useApiData";
import { formatDate } from "@/lib/course";
import { panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/services/api";
import { getProfile, updateProfile } from "@/services/authService";
import type { UserProfile } from "@/types/Auth";

function ProfilePage() {
  const { data, loading, failed, error } = useApiData(getProfile);

  return (
    <AccountLayout
      title="My profile"
      description="Keep your personal details up to date."
    >
      {loading && <LoadingState label="Loading your profile…" />}

      {failed && (
        <StateMessage
          icon={CloudOff}
          title="Something went wrong"
          description={getApiErrorMessage(error, "Could not load your profile.")}
        />
      )}

      {data && <ProfileForm profile={data} />}
    </AccountLayout>
  );
}

type ProfileFormProps = {
  profile: UserProfile;
};

// Starts from the loaded profile; after saving, it shows what the API sent back
function ProfileForm({ profile: initialProfile }: ProfileFormProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [form, setForm] = useState(() => toForm(initialProfile));
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  function setField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
    setSaved(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaved(false);

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("First and last name are required.");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber || undefined,
        country: form.country || undefined,
        preferredLanguage: form.preferredLanguage || undefined,
      });
      setProfile(updated);
      setForm(toForm(updated));
      setSaved(true);
    } catch (saveError) {
      setError(getApiErrorMessage(saveError, "Could not save your profile."));
    } finally {
      setSaving(false);
    }
  }

  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
      {/* Summary card */}
      <aside className={cn(panelStyle, "h-fit p-6 text-center")}>
        <Avatar
          name={fullName}
          className="mx-auto size-20 bg-primary text-2xl text-sand"
        />
        <h2 className="mt-4 text-xl font-semibold">{fullName}</h2>
        <p className="mt-1 text-sm break-all text-muted-foreground">
          {profile.email}
        </p>
        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {profile.roles.map((role) => (
            <li
              key={role}
              className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground"
            >
              {role}
            </li>
          ))}
        </ul>
        <p className="mt-5 border-t pt-4 text-xs text-muted-foreground">
          Member since {formatDate(profile.createdAt)}
        </p>
      </aside>

      {/* Edit form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className={cn(panelStyle, "p-6 sm:p-8")}
      >
        <h2 className="text-2xl font-semibold">Personal details</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your email address cannot be changed.
        </p>

        {error && (
          <Alert variant="destructive" className="mt-5">
            <CircleAlert />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {saved && (
          <Alert
            role="status"
            className="mt-5 border-emerald-200 bg-emerald-50 text-emerald-900"
          >
            <CircleCheck />
            <AlertDescription className="text-emerald-900/80">
              Profile updated.
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <FormField
            label="First name"
            autoComplete="given-name"
            value={form.firstName}
            onChange={(event) => setField("firstName", event.target.value)}
          />
          <FormField
            label="Last name"
            autoComplete="family-name"
            value={form.lastName}
            onChange={(event) => setField("lastName", event.target.value)}
          />
          <FormField
            label="Mobile number"
            type="tel"
            autoComplete="tel"
            value={form.phoneNumber}
            onChange={(event) => setField("phoneNumber", event.target.value)}
          />
          <FormField
            label="Country"
            autoComplete="country-name"
            value={form.country}
            onChange={(event) => setField("country", event.target.value)}
          />
          <FormField
            label="Preferred language"
            className="sm:col-span-2"
            value={form.preferredLanguage}
            onChange={(event) =>
              setField("preferredLanguage", event.target.value)
            }
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={saving}
          className="mt-7 h-11 rounded-full px-6"
        >
          {saving && (
            <LoaderCircle data-icon="inline-start" className="animate-spin" />
          )}
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}

function toForm(profile: UserProfile) {
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    phoneNumber: profile.phoneNumber ?? "",
    country: profile.country ?? "",
    preferredLanguage: profile.preferredLanguage ?? "",
  };
}

export default ProfilePage;
