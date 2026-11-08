import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Archive, ArchiveRestore, BookOpen, Pencil, Plus } from "lucide-react";
import Chip from "@/components/manage/Chip";
import ConfirmDialog, { type ConfirmRequest } from "@/components/manage/ConfirmDialog";
import { ADMIN_LINKS } from "@/components/admin/adminLinks";
import CourseEditorDialog from "@/components/admin/CourseEditorDialog";
import CoverImage from "@/components/CoverImage";
import PageSkeleton from "@/components/PageSkeleton";
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
import { useToast } from "@/hooks/useToast";
import { STATUS_META, formatDate, formatPrice } from "@/lib/course";
import { pageContainer } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/services/api";
import { deleteCourse, restoreCourse } from "@/services/courseService";
import { timeAgo } from "@/lib/time";
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
  const toast = useToast();
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);

  // Courses with applications are archived (hidden from the catalog) instead of deleted
  function askArchive(course: Course) {
    setConfirm({
      title: `Remove "${course.title}"?`,
      description:
        "If learners already applied or it belongs to a program, it is archived: hidden from the catalog, but their enrollments and payments stay. You can restore it any time.",
      confirmLabel: "Remove course",
      danger: true,
      onConfirm: async () => {
        try {
          const archived = await deleteCourse(course.id);
          toast.success(archived ? `"${course.title}" was archived.` : `"${course.title}" was deleted.`);
          reload();
        } catch (err) {
          toast.error("Could not remove the course.", getApiErrorMessage(err, "Please try again."));
        }
      },
    });
  }

  async function handleRestore(course: Course) {
    try {
      await restoreCourse(course.id);
      toast.success(`"${course.title}" is back in the catalog.`);
      reload();
    } catch (err) {
      toast.error("Could not restore the course.", getApiErrorMessage(err, "Please try again."));
    }
  }
  // undefined = closed, null = new course, number = edit that course
  const [editingId, setEditingId] = useState<number | null | undefined>(undefined);

  const handleSearch = useCallback((value: string) => setSearch(value), []);

  async function handleAssign(course: Course) {
    const instructorId = Number(picked[course.id]);
    if (!instructorId || !data) return;
    setBusyId(course.id);
    try {
      await assignInstructor(course.id, instructorId);
      const name = data.instructors.find((i) => i.id === instructorId)?.fullName ?? "The instructor";
      toast.success(`${name} now teaches "${course.title}".`);
      setPicked((prev) => {
        const next = { ...prev };
        delete next[course.id];
        return next;
      });
      reload();
    } catch (err) {
      toast.error("Could not assign the instructor.", getApiErrorMessage(err, "Please try again."));
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

        {loading && !data ? (
          <PageSkeleton variant="table" label="Loading courses…" />
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => {
                  const value = picked[course.id] ?? (course.instructorId ? String(course.instructorId) : "");
                  const changed = value !== "" && Number(value) !== course.instructorId;
                  return (
                    <TableRow key={course.id} className={cn(course.isDeleted && "bg-muted/40 opacity-70")}>
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
                            {course.updatedAt && (
                              <p className="text-[0.7rem] text-muted-foreground/80">
                                Edited {timeAgo(course.updatedAt)}
                                {course.updatedBy && ` by ${course.updatedBy}`}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {course.isDeleted ? <Chip tone="neutral"><Archive aria-hidden className="size-3" /> Archived</Chip> : <StatusPill status={STATUS_META[course.status]} />}
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
                      <TableCell className="text-right whitespace-nowrap">
                        {course.isDeleted ? (
                          <Button variant="outline" size="sm" className="rounded-full px-3" onClick={() => void handleRestore(course)}>
                            <ArchiveRestore aria-hidden /> Restore
                          </Button>
                        ) : (
                          <>
                            <Button variant="ghost" size="icon-sm" aria-label={`Edit ${course.title}`} onClick={() => setEditingId(course.id)}>
                              <Pencil />
                            </Button>
                            <Button variant="ghost" size="icon-sm" aria-label={`Remove ${course.title}`} className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => askArchive(course)}>
                              <Archive />
                            </Button>
                          </>
                        )}
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
            toast.success(`"${title}" was saved.`);
            reload();
          }}
        />
      )}

      <ConfirmDialog request={confirm} onClose={() => setConfirm(null)} />
    </>
  );
}

export default AdminCoursesPage;
