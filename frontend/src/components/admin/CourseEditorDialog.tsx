import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { getApiErrorMessage } from "../../services/api";
import { createCourse, updateCourse } from "../../services/adminService";
import { getCategories } from "../../services/categoryService";
import { getCourseById } from "../../services/courseService";
import type { AdminUser, CourseRequest } from "../../types/Admin";
import type { Category } from "../../types/Category";
import type { Course } from "../../types/Course";
import { STATUS_LABELS } from "../../utils/statusLabels";

const STATUSES = Object.keys(STATUS_LABELS) as Course["status"][];

type Props = {
  courseId: number | null; // null = new course
  instructors: AdminUser[];
  onClose: () => void;
  onSaved: () => void;
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
  type: Course["type"];
  status: Course["status"];
  isFeatured: boolean;
  categoryId: number | "";
  instructorId: number | "";
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
  instructorId: "",
};

// "" → undefined so optional fields are sent as missing, not empty
const opt = (value: string) => (value.trim() ? value.trim() : undefined);

function CourseEditorDialog({ courseId, instructors, onClose, onSaved }: Props) {
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
            startDate: course.startDate ?? "",
            endDate: course.endDate ?? "",
            type: course.type,
            status: course.status,
            isFeatured: course.isFeatured,
            categoryId: course.categoryId,
            instructorId: course.instructorId ?? "",
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
      categoryId: form.categoryId,
      instructorId: form.instructorId === "" ? undefined : form.instructorId,
    };

    setError("");
    setSaving(true);
    try {
      if (courseId) await updateCourse(courseId, payload);
      else await createCourse(payload);
      onSaved();
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save the course."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogTitle>{courseId ? "Edit course" : "New course"}</DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                Basic information
              </Typography>
              <TextField fullWidth margin="dense" label="Title" value={form.title} onChange={(e) => set("title", e.target.value)} />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  select
                  fullWidth
                  margin="dense"
                  label="Category"
                  value={form.categoryId}
                  onChange={(e) => set("categoryId", Number(e.target.value))}
                >
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  fullWidth
                  margin="dense"
                  label="Instructor"
                  value={form.instructorId}
                  onChange={(e) => set("instructorId", e.target.value === "" ? "" : Number(e.target.value))}
                >
                  <MenuItem value="">Not assigned yet</MenuItem>
                  {instructors.map((i) => (
                    <MenuItem key={i.id} value={i.id}>
                      {i.fullName}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <TextField fullWidth margin="dense" label="Short description (card)" value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} />
              <TextField fullWidth margin="dense" multiline minRows={3} label="Full description" value={form.fullDescription} onChange={(e) => set("fullDescription", e.target.value)} />
              <TextField fullWidth margin="dense" multiline minRows={2} label="Objectives (one per line)" value={form.objectives} onChange={(e) => set("objectives", e.target.value)} />
              <TextField fullWidth margin="dense" label="Image URL" value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} />

              <Typography variant="subtitle2" sx={{ color: "text.secondary", mt: 2 }}>
                Schedule & location
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField fullWidth margin="dense" type="date" label="Start date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
                <TextField fullWidth margin="dense" type="date" label="End date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField fullWidth margin="dense" label="Schedule (e.g. Sun & Tue, 6–8 PM)" value={form.schedule} onChange={(e) => set("schedule", e.target.value)} />
                <TextField fullWidth margin="dense" label="Location" value={form.location} onChange={(e) => set("location", e.target.value)} />
              </Stack>

              <Typography variant="subtitle2" sx={{ color: "text.secondary", mt: 2 }}>
                Enrollment
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField fullWidth margin="dense" type="number" label="Price (EGP)" value={form.price} onChange={(e) => set("price", e.target.value)} />
                <TextField fullWidth margin="dense" type="number" label="Duration (hours)" value={form.durationHours} onChange={(e) => set("durationHours", e.target.value)} />
                <TextField fullWidth margin="dense" type="number" label="Capacity" value={form.capacity} onChange={(e) => set("capacity", e.target.value)} />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "center" } }}>
                <TextField
                  select
                  fullWidth
                  margin="dense"
                  label="Status"
                  value={form.status}
                  onChange={(e) => set("status", e.target.value as Course["status"])}
                >
                  {STATUSES.map((s) => (
                    <MenuItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  fullWidth
                  margin="dense"
                  label="Type"
                  value={form.type}
                  onChange={(e) => set("type", e.target.value as Course["type"])}
                >
                  <MenuItem value="Offline">Offline</MenuItem>
                  <MenuItem value="Online">Online</MenuItem>
                </TextField>
                <FormControlLabel
                  sx={{ minWidth: 160 }}
                  control={<Switch checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} color="secondary" />}
                  label="Featured"
                />
              </Stack>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="secondary" disabled={saving || loading}>
            {saving ? "Saving..." : courseId ? "Save changes" : "Create course"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default CourseEditorDialog;
