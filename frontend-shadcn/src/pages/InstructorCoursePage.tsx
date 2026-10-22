import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, ClipboardList, FileText, Lock, Users } from "lucide-react";
import AssignmentsTab from "@/components/instructor/AssignmentsTab";
import MaterialsTab from "@/components/instructor/MaterialsTab";
import SessionsTab from "@/components/instructor/SessionsTab";
import StudentsTab from "@/components/instructor/StudentsTab";
import LoadingState from "@/components/LoadingState";
import Chip from "@/components/manage/Chip";
import ManageHeader from "@/components/manage/ManageHeader";
import StateMessage from "@/components/StateMessage";
import StatusPill from "@/components/StatusPill";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiData } from "@/hooks/useApiData";
import { STATUS_META, formatDate } from "@/lib/course";
import { pageContainer } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/services/api";
import { getMyTeachingCourses } from "@/services/instructorService";

const TABS = [
  { value: "students", label: "Students", icon: Users },
  { value: "sessions", label: "Sessions & attendance", icon: CalendarDays },
  { value: "materials", label: "Materials", icon: FileText },
  { value: "assignments", label: "Assignments & grading", icon: ClipboardList },
];

// Reads the id from the URL and gives each course its own fresh page
function InstructorCoursePage() {
  const { id } = useParams();
  return <InstructorCourseContent key={id} courseId={Number(id)} />;
}

// Manage one course: students, sessions + attendance, materials, assignments + grading
function InstructorCourseContent({ courseId }: { courseId: number }) {
  // Only courses I teach are returned, so "not found" also means "not mine"
  const { data: courses, loading, failed, error, reload } = useApiData(getMyTeachingCourses);
  const course = courses?.find((c) => c.id === courseId);
  const refreshHeader = useCallback(() => reload(), [reload]);

  if (loading && !courses) return <LoadingState label="Loading course…" />;

  if (failed || !course) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <StateMessage
          icon={Lock}
          title="You can't manage this course"
          description={failed ? getApiErrorMessage(error, "Could not load the course.") : "This course was not found, or you don't teach it."}
          action={
            <Button asChild size="lg" className="rounded-full px-5">
              <Link to="/instructor">Back to dashboard</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const when = [
    `${course.startDate ? formatDate(course.startDate) : "TBA"} – ${course.endDate ? formatDate(course.endDate) : "TBA"}`,
    course.schedule,
    course.location,
  ].filter(Boolean);

  return (
    <>
      <ManageHeader eyebrow="Manage course" title={course.title} description={when.join(" · ")}>
        <div className="mt-4 flex flex-wrap gap-2">
          <StatusPill status={STATUS_META[course.status]} className="bg-white/95 ring-0" />
          <Chip className="bg-primary-foreground/10 text-primary-foreground">
            {course.studentCount}/{course.capacity} students
          </Chip>
          <Chip className="bg-primary-foreground/10 text-primary-foreground">{course.sessionCount} sessions</Chip>
          {course.pendingSubmissions > 0 && <Chip tone="warning">{course.pendingSubmissions} to grade</Chip>}
        </div>
      </ManageHeader>

      <div className={cn(pageContainer, "flex flex-col gap-6 py-8")}>
        <Button asChild variant="link" className="-mb-2 h-auto self-start px-0 text-sand-deep">
          <Link to="/instructor">
            <ArrowLeft data-icon="inline-start" /> Back to dashboard
          </Link>
        </Button>

        <Tabs defaultValue="students" className="gap-6">
          <div className="-mx-4 overflow-x-auto border-b border-border/70 px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
            <TabsList variant="line" className="h-auto! pb-1">
              {TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="flex-none gap-2 px-3 py-2">
                  <tab.icon aria-hidden />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="students">
            <StudentsTab courseId={courseId} />
          </TabsContent>
          <TabsContent value="sessions">
            <SessionsTab courseId={courseId} onChanged={refreshHeader} />
          </TabsContent>
          <TabsContent value="materials">
            <MaterialsTab courseId={courseId} />
          </TabsContent>
          <TabsContent value="assignments">
            <AssignmentsTab courseId={courseId} onChanged={refreshHeader} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default InstructorCoursePage;
