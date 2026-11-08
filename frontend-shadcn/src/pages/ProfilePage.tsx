import { useRef, useState, type FormEvent } from "react";
import { Camera, CircleAlert, CloudOff, LoaderCircle } from "lucide-react";
import ChangePasswordCard from "@/components/ChangePasswordCard";
import AccountLayout from "@/components/AccountLayout";
import Avatar from "@/components/Avatar";
import FormField from "@/components/FormField";
import PageSkeleton from "@/components/PageSkeleton";
import StateMessage from "@/components/StateMessage";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useApiData } from "@/hooks/useApiData";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { formatDate } from "@/lib/course";
import { panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/services/api";
import { getProfile, updateProfile, uploadProfilePhoto } from "@/services/authService";
import type { UserProfile } from "@/types/Auth";

function ProfilePage() {
  const { data, loading, failed, error } = useApiData(getProfile);

  return (
    <AccountLayout
      title="My profile"
      description="Keep your personal details up to date."
    >
      {loading && <PageSkeleton variant="list" label="Loading your profile…" />}

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
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const photoInput = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const { updateUser } = useAuth();

  async function handlePhoto(file: File | undefined) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("That photo is too big", "Choose an image up to 2 MB.");
      return;
    }
    setUploading(true);
    try {
      const updated = await uploadProfilePhoto(file);
      setProfile(updated);
      updateUser({ photoUrl: updated.photoUrl });
      toast.success("Profile photo updated.");
    } catch (uploadError) {
      toast.error("Could not upload the photo", getApiErrorMessage(uploadError));
    } finally {
      setUploading(false);
      if (photoInput.current) photoInput.current.value = "";
    }
  }

  function setField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

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
      updateUser({ firstName: updated.firstName, lastName: updated.lastName });
      toast.success("Profile updated.");
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
        {/* Photo with a camera button to change it */}
        <div className="relative mx-auto size-24">
          <Avatar
            name={fullName}
            photoUrl={profile.photoUrl}
            className="size-24 bg-primary text-2xl text-sand ring-4 ring-sand/30"
          />
          <button
            type="button"
            onClick={() => photoInput.current?.click()}
            disabled={uploading}
            aria-label="Change profile photo"
            title="Change photo"
            className="absolute -right-1 -bottom-1 flex size-9 items-center justify-center rounded-full bg-sand text-primary shadow-md ring-4 ring-card transition outline-none hover:scale-105 focus-visible:ring-ring/50 disabled:opacity-70"
          >
            {uploading ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : <Camera aria-hidden className="size-4" />}
          </button>
          <input
            ref={photoInput}
            type="file"
            accept=".png,.jpg,.jpeg,.webp"
            className="sr-only"
            tabIndex={-1}
            aria-label="Choose a profile photo"
            onChange={(e) => void handlePhoto(e.target.files?.[0])}
          />
        </div>
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

      <ChangePasswordCard className="lg:col-start-2" />
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
