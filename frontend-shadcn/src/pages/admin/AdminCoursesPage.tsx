import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, CircleCheck, Pencil, Plus } from "lucide-react";
import { ADMIN_LINKS } from "@/components/admin/adminLinks";
import CourseEditorDialog from "@/components/admin/CourseEditorDialog";
import CoverImage from "@/components/CoverImage";
import LoadingState from "@/components/LoadingState";
import EmptyNote from "@/components/manage/EmptyNote";
import { SelectField } from "@/components/manage/fields";
import ManageHeader from "@/components/manage/ManageHeader";
import TableCard from "@/components/manage/TableCard";
import SearchInput from "@/components/SearchInput";
import StatusPill from "@/components/StatusPill";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApiData } from "@/hooks/useApiData";
import { STATUS_META, formatDate, formatPrice } from "@/lib/course";
import { pageContainer } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/services/api";
import { assignInstructor, getAdminCourses, getAdminUsers } from "@/services/adminService";
import type { Course, CourseStatus } from "@/types/Course";

const ALL = "all";

async function loadCourses() {
  const [courses, instructors] = await Promise.all([
    getAdminCourses(),
    getAdminUsers({ role: "Instructor", isActive: true }),
  ]);
  return { courses, instructors };
}

// Every course (drafts included): create, edit, and assign instructors
function AdminCoursesPage() {
  const { data, loading, failed, error: loadError, reload } = useApiData(loadCourses);
  // Instructor picked in each row's dropdown, before pressing Assign
  const [picked, setPicked] = useState<Record<number, string>>({});
  const [busyId, setBusyId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>(ALL);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  // undefined = closed, null = new course, number = edit that course
  const [editingId, setEditingId] = useState<number | null | undefined>(undefined);

  const handleSearch = useCallback((value: string) => setSearch(value), []);

  async function handleAssign(course: Course) {
    const instructorId = Number(picked[course.id]);
    if (!instructorId || !data) return;
    setBusyId(course.id);
    setError("");
    setMessage("");
    try {
      await assignInstructor(course.id, instructorId);
      const name = data.instructors.find((i) => i.id === instructorId)?.fullName ?? "The instructor";
      setMessage(`${name} now teaches "${course.title}".`);
      setPicked((prev) => {
        const next = { ...prev };
        delete next[course.id];
        return next;
      });
      reload();
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not assign the instructor."));
    } finally {
      setBusyId(null);
    }
  }

  const term = search.toLowerCase();
  const courses = (data?.courses ?? []).filter(
    (course) =>
      (status === ALL || course.status === status) &&
      (!term || course.title.toLowerCase().includes(term) || course.categoryName.toLowerCase().includes(term)),
  );

  return (
    <>
      <ManageHeader
        eyebrow="Admin"
        title="Manage courses"
        description="Create courses, keep them up to date and choose who teaches them."
        links={ADMIN_LINKS}
        actions={
          <Button className="h-10 rounded-full bg-sand px-5 text-primary hover:bg-sand/85" onClick={() => setEditingId(null)}>
            <Plus aria-hidden /> New course
          </Button>
        }
      />

      <div className={cn(pageContainer, "flex flex-col gap-5 py-10")}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SearchInput value={search} onSearch={handleSearch} placeholder="Search title or category" className="w-full sm:w-80" />
          <SelectField
            label="Status"
            hideLabel
            value={status}
            onChange={setStatus}
            className="w-full sm:w-56"
            options={[{ value: ALL, label: "All statuses" }, ...(Object.keys(STATUS_META) as CourseStatus[]).map((s) => ({ value: s, label: STATUS_META[s].label }))]}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {message && (
          <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800">
            <CircleCheck />
            <AlertDescription className="text-emerald-800">{message}</AlertDescription>
          </Alert>
        )}

        {loading && !data ? (
          <LoadingState label="Loading courses…" />
        ) : failed || !data ? (
          <Alert variant="destructive">
            <AlertDescription>{getApiErrorMessage(loadError, "Could not load courses.")}</AlertDescription>
          </Alert>
        ) : courses.length === 0 ? (
          <EmptyNote icon={BookOpen} title="No courses found" description="Try another search or status." />
        ) : (
          <TableCard title="Courses" description={`${courses.length} of ${data.courses.length}`}>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Starts</TableHead>
                  <TableHead className="min-w-64">Instructor</TableHead>
                  <TableHead className="text-right">Edit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => {
                  const value = picked[course.id] ?? (course.instructorId ? String(course.instructorId) : "");
                  const changed = value !== "" && Number(value) !== course.instructorId;
                  return (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div className="flex min-w-60 items-center gap-3">
                          <CoverImage src={course.imageUrl} title={course.title} className="size-12 shrink-0 rounded-lg" letterClassName="text-lg" />
                          <div className="min-w-0">
                            <Link
                              to={`/courses/${course.id}`}
                              className="rounded-sm font-semibold underline-offset-4 outline-none hover:text-sand-deep hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                            >
                              {course.title}
                            </Link>
                            <p className="text-xs text-muted-foreground">
                              {course.categoryName} · {formatPrice(course.price)}
                              {course.isFeatured && " · ★ Featured"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusPill status={STATUS_META[course.status]} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{course.startDate ? formatDate(course.startDate) : "TBA"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <SelectField
                            label={`Instructor for ${course.title}`}
                            hideLabel
                            placeholder="Choose instructor"
                            value={value}
                            onChange={(next) => setPicked((prev) => ({ ...prev, [course.id]: next }))}
                            options={data.instructors.map((i) => ({ value: String(i.id), label: i.fullName }))}
                            className="flex-1"
                          />
                          <Button size="sm" className="h-10 rounded-full px-4" disabled={!changed || busyId === course.id} onClick={() => handleAssign(course)}>
                            Assign
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon-sm" aria-label={`Edit ${course.title}`} onClick={() => setEditingId(course.id)}>
                          <Pencil />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableCard>
        )}
      </div>

      {editingId !== undefined && data && (
        <CourseEditorDialog
          courseId={editingId}
          instructors={data.instructors}
          onClose={() => setEditingId(undefined)}
          onSaved={(title) => {
            setEditingId(undefined);
            setMessage(`"${title}" was saved.`);
            reload();
          }}
        />
      )}
    </>
  );
}

export default AdminCoursesPage;
