import { useState, type FormEvent } from "react";
import FormField from "@/components/FormField";
import FormDialog from "@/components/manage/FormDialog";
import { TextareaField } from "@/components/manage/fields";
import { getApiErrorMessage } from "@/services/api";
import { createInstructor } from "@/services/adminService";

type CreateInstructorDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (name: string) => void;
};

// Admin creates an instructor account with a temporary password
function CreateInstructorDialog({ open, onClose, onCreated }: CreateInstructorDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim())
      return setError("First name, last name and email are required.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");

    setError("");
    setSaving(true);
    try {
      await createInstructor({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        phoneNumber: phoneNumber.trim() || undefined,
        specialization: specialization.trim() || undefined,
        bio: bio.trim() || undefined,
      });
      onCreated(`${firstName.trim()} ${lastName.trim()}`);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not create the instructor."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <FormDialog
      open={open}
      title="Add instructor"
      description="Share the temporary password with them so they can sign in."
      error={error}
      saving={saving}
      submitLabel="Create instructor"
      savingLabel="Creating…"
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="off" />
        <FormField label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="off" />
      </div>
      <FormField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" />
      <FormField label="Temporary password" hint="At least 8 characters" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <FormField label="Specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="e.g. Front-end development" />
      </div>
      <TextareaField label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
    </FormDialog>
  );
}

export default CreateInstructorDialog;
