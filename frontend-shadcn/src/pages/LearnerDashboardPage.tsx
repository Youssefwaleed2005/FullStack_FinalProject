import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, CalendarClock, CloudOff, ListTodo, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AccountLayout from "@/components/AccountLayout";
import CoverImage from "@/components/CoverImage";
import LoadingState from "@/components/LoadingState";
import StateMessage from "@/components/StateMessage";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useApiData } from "@/hooks/useApiData";
import { useAuth } from "@/hooks/useAuth";
import { formatDateTime } from "@/lib/course";
import { panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/services/api";
import { getLearnerDashboard } from "@/services/learnerService";
import type { LearnerCourse } from "@/types/Learner";

function StatTile({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | number }) {
  return (
    <div className={cn(panelStyle, "flex items-center gap-4 p-5")}>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-sand-deep">
        <Icon aria-hidden className="size-5" strokeWidth={1.75} />
      </span>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
}

function CourseTile({ course }: { course: LearnerCourse }) {
  return (
    <div className={cn(panelStyle, "flex h-full flex-col overflow-hidden")}>
      <CoverImage src={course.imageUrl} title={course.title} className="h-32" />
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg leading-snug font-semibold">{course.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {course.instructorName ?? "Instructor to be announced"}
          {course.programTitle ? ` · ${course.programTitle}` : ""}
        </p>

        <div className="mt-auto pt-4">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-semibold">{course.progressPercent}%</span>
          </div>
          <Progress value={course.progressPercent} aria-label={`${course.title} progress`} className="mt-1.5" />
          <p className="mt-2 text-xs text-muted-foreground">
            {course.pendingAssignments > 0 ? `${course.pendingAssignments} to submit · ` : ""}
            Next session: {course.nextSessionAt ? formatDateTime(course.nextSessionAt) : "none planned"}
          </p>
          <Button asChild className="mt-4 w-full rounded-full">
            <Link to={`/learning/courses/${course.id}`}>
              {course.progressPercent > 0 ? "Continue" : "Start"}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Learner home: numbers, courses with progress, upcoming sessions
function LearnerDashboardPage() {
  const { user } = useAuth();
  const { data, loading, failed, error } = useApiData(getLearnerDashboard);

  return (
    <AccountLayout
      title={`Welcome back, ${user?.firstName ?? ""}!`}
      description="Here is what's happening in your courses."
    >
      {loading && <LoadingState label="Loading your dashboard…" />}

      {failed && (
        <StateMessage
          icon={CloudOff}
          title="Something went wrong"
          description={getApiErrorMessage(error, "Could not load your dashboard.")}
        />
      )}

      {data && (
        <div className="flex flex-col gap-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile icon={BookOpen} label="Active courses" value={data.activeCourseCount} />
            <StatTile icon={TrendingUp} label="Average progress" value={`${data.averageProgress}%`} />
            <StatTile icon={CalendarClock} label="Upcoming sessions" value={data.upcomingSessionCount} />
            <StatTile icon={ListTodo} label="Assignments to do" value={data.pendingAssignmentCount} />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <section className="lg:col-span-2">
              <h2 className="text-xl font-semibold">Continue learning</h2>
              {data.courses.length === 0 ? (
                <StateMessage
                  icon={BookOpen}
                  title="Nothing here yet"
                  description="Apply to a course and complete the payment to get started."
                  action={
                    <Button asChild size="lg" className="rounded-full px-5">
                      <Link to="/courses">Browse courses</Link>
                    </Button>
                  }
                />
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {data.courses.map((course) => (
                    <CourseTile key={course.id} course={course} />
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-xl font-semibold">Upcoming sessions</h2>
              <ul className={cn(panelStyle, "mt-4 divide-y")}>
                {data.upcomingSessions.length === 0 ? (
                  <li className="p-5 text-sm text-muted-foreground">No upcoming sessions.</li>
                ) : (
                  data.upcomingSessions.map((s) => (
                    <li key={s.id} className="p-5">
                      <p className="font-semibold">{s.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {s.courseTitle} · {formatDateTime(s.startTime)}
                        {s.location ? ` · ${s.location}` : ""}
                      </p>
                    </li>
                  ))
                )}
              </ul>
            </section>
          </div>
        </div>
      )}
    </AccountLayout>
  );
}

export default LearnerDashboardPage;
