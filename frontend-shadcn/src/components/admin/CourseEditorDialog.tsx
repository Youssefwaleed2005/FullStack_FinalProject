import { useEffect, useState, type FormEvent } from "react";
import { LoaderCircle } from "lucide-react";
import FormField from "@/components/FormField";
import FormDialog from "@/components/manage/FormDialog";
import { SelectField, TextareaField } from "@/components/manage/fields";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { STATUS_META } from "@/lib/course";
import { toDateInputValue } from "@/lib/dates";
import { getApiErrorMessage } from "@/services/api";
import { createCourse, updateCourse } from "@/services/adminService";
import { getCategories } from "@/services/categoryService";
import { getCourseById } from "@/services/courseService";
import type { AdminUser, CourseRequest } from "@/types/Admin";
import type { Category } from "@/types/Category";
import type { CourseStatus, CourseType } from "@/types/Course";

const STATUSES = Object.keys(STATUS_META) as CourseStatus[];
// The Select can't use "" as a value, so this stands for "no instructor"
const NONE = "none";

type CourseEditorDialogProps = {
  courseId: number | null; // null = new course
  instructors: AdminUser[];
  onClose: () => void;
  onSaved: (title: string) => void;
};

type FormState = {
  title: string;
  shortDescription: string;
  fullDescription: string;
  objectives: string;
  imageUrl: string;
  durationHours: string;
  price: string;
  capacity: string;
  location: string;
  schedule: string;
  startDate: string;
  endDate: string;
  type: CourseType;
  status: CourseStatus;
  isFeatured: boolean;
  categoryId: string;
  instructorId: string;
};

const EMPTY: FormState = {
  title: "",
  shortDescription: "",
  fullDescription: "",
  objectives: "",
  imageUrl: "",
  durationHours: "20",
  price: "1000",
  capacity: "25",
  location: "",
  schedule: "",
  startDate: "",
  endDate: "",
  type: "Offline",
  status: "Draft",
  isFeatured: false,
  categoryId: "",
  instructorId: NONE,
};

// "" → undefined so optional fields are sent as missing, not empty
const opt = (value: string) => (value.trim() ? value.trim() : undefined);

function SectionTitle({ children }: { children: string }) {
  return <p className="pt-2 text-xs font-semibold tracking-[0.16em] text-sand-deep uppercase first:pt-0">{children}</p>;
}

// Create a course or edit any course (admin only)
function CourseEditorDialog({ courseId, instructors, onClose, onSaved }: CourseEditorDialogProps) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([getCategories(), courseId ? getCourseById(courseId) : Promise.resolve(null)])
      .then(([cats, course]) => {
        if (!active) return;
        setCategories(cats);
        if (course) {
          setForm({
            title: course.title,
            shortDescription: course.shortDescription ?? "",
            fullDescription: course.fullDescription ?? "",
            objectives: course.objectives ?? "",
            imageUrl: course.imageUrl ?? "",
            durationHours: String(course.durationHours),
            price: String(course.price),
            capacity: String(course.capacity),
            location: course.location ?? "",
            schedule: course.schedule ?? "",
            startDate: toDateInputValue(course.startDate),
            endDate: toDateInputValue(course.endDate),
            type: course.type,
            status: course.status,
            isFeatured: course.isFeatured,
            categoryId: String(course.categoryId),
            instructorId: course.instructorId ? String(course.instructorId) : NONE,
          });
        }
      })
      .catch((err) => {
        if (active) setError(getApiErrorMessage(err, "Could not load the course."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [courseId]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const duration = Number(form.durationHours);
    const price = Number(form.price);
    const capacity = Number(form.capacity);
    if (!form.title.trim()) return setError("Title is required.");
    if (!form.categoryId) return setError("Choose a category.");
    if (!Number.isInteger(duration) || duration < 1) return setError("Duration must be at least 1 hour.");
    if (Number.isNaN(price) || price < 0) return setError("Price can't be negative.");
    if (!Number.isInteger(capacity) || capacity < 1) return setError("Capacity must be at least 1.");
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      return setError("End date must be after the start date.");

    const payload: CourseRequest = {
      title: form.title.trim(),
      shortDescription: opt(form.shortDescription),
      fullDescription: opt(form.fullDescription),
      objectives: opt(form.objectives),
      imageUrl: opt(form.imageUrl),
      durationHours: duration,
      price,
      capacity,
      location: opt(form.location),
      schedule: opt(form.schedule),
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
      type: form.type,
      status: form.status,
      isFeatured: form.isFeatured,
      categoryId: Number(form.categoryId),
      instructorId: form.instructorId === NONE ? undefined : Number(form.instructorId),
    };

    setError("");
    setSaving(true);
    try {
      if (courseId) await updateCourse(courseId, payload);
      else await createCourse(payload);
      onSaved(payload.title);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save the course."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <FormDialog
      open
      size="lg"
      title={courseId ? "Edit course" : "New course"}
      description="Draft courses are hidden from the public catalog."
      error={error}
      saving={saving}
      disabled={loading}
      submitLabel={courseId ? "Save changes" : "Create course"}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      {loading ? (
        <p className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
          <LoaderCircle aria-hidden className="size-4 animate-spin" /> Loading…
        </p>
      ) : (
        <>
          <SectionTitle>Basic information</SectionTitle>
          <FormField label="Title" value={form.title} onChange={(e) => set("title", e.target.value)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Category"
              placeholder="Choose a category"
              value={form.categoryId}
              onChange={(value) => set("categoryId", value)}
              options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
            />
            <SelectField
              label="Instructor"
              value={form.instructorId}
              onChange={(value) => set("instructorId", value)}
              options={[{ value: NONE, label: "Not assigned yet" }, ...instructors.map((i) => ({ value: String(i.id), label: i.fullName }))]}
            />
          </div>
          <FormField label="Short description" hint="Shown on the course card" value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} />
          <TextareaField label="Full description" value={form.fullDescription} onChange={(e) => set("fullDescription", e.target.value)} rows={4} />
          <TextareaField label="Objectives" hint="One per line" value={form.objectives} onChange={(e) => set("objectives", e.target.value)} rows={3} />
          <FormField label="Image URL" placeholder="https://" value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} />

          <SectionTitle>Schedule & location</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Start date" type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
            <FormField label="End date" type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} />
            <FormField label="Schedule" placeholder="e.g. Sun & Tue, 6–8 PM" value={form.schedule} onChange={(e) => set("schedule", e.target.value)} />
            <FormField label="Location" value={form.location} onChange={(e) => set("location", e.target.value)} />
          </div>

          <SectionTitle>Enrollment</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Price (EGP)" type="number" min={0} value={form.price} onChange={(e) => set("price", e.target.value)} />
            <FormField label="Duration (hours)" type="number" min={1} value={form.durationHours} onChange={(e) => set("durationHours", e.target.value)} />
            <FormField label="Capacity" type="number" min={1} value={form.capacity} onChange={(e) => set("capacity", e.target.value)} />
          </div>
          <div className="grid items-end gap-4 sm:grid-cols-3">
            <SelectField
              label="Status"
              value={form.status}
              onChange={(value) => set("status", value as CourseStatus)}
              options={STATUSES.map((s) => ({ value: s, label: STATUS_META[s].label }))}
            />
            <SelectField
              label="Format"
              value={form.type}
              onChange={(value) => set("type", value as CourseType)}
              options={[
                { value: "Offline", label: "Offline (on campus)" },
                { value: "Online", label: "Online" },
              ]}
            />
            <div className="flex h-10 items-center gap-2.5 rounded-lg border border-input bg-card px-3">
              <Checkbox id="course-featured" checked={form.isFeatured} onCheckedChange={(checked) => set("isFeatured", checked === true)} />
              <Label htmlFor="course-featured" className="cursor-pointer">
                Featured on the homepage
              </Label>
            </div>
          </div>
        </>
      )}
    </FormDialog>
  );
}

export default CourseEditorDialog;
