import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  ClipboardCheck,
  MapPin,
  Presentation,
  Users,
} from "lucide-react";
import CoverImage from "@/components/CoverImage";
import Countdown from "@/components/fun/Countdown";
import Reveal from "@/components/fun/Reveal";
import LoadingState from "@/components/LoadingState";
import Chip from "@/components/manage/Chip";
import EmptyNote from "@/components/manage/EmptyNote";
import ManageHeader from "@/components/manage/ManageHeader";
import StatTile from "@/components/manage/StatTile";
import StateMessage from "@/components/StateMessage";
import StatusPill from "@/components/StatusPill";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useApiData } from "@/hooks/useApiData";
import { useAuth } from "@/hooks/useAuth";
import { STATUS_META, formatDate, formatDateTime } from "@/lib/course";
import { pageContainer, panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/services/api";
import { getInstructorDashboard, getMyTeachingCourses } from "@/services/instructorService";

async function loadDashboard() {
  const [dashboard, courses] = await Promise.all([getInstructorDashboard(), getMyTeachingCourses()]);
  return { dashboard, courses };
}

function greeting() {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
}

// The instructor's home: numbers, upcoming sessions and the courses they teach
function InstructorDashboardPage() {
  const { user } = useAuth();
  const { data, loading, failed, error, reload } = useApiData(loadDashboard);

  if (loading) return <LoadingState label="Loading your dashboard…" />;
  if (failed || !data)
    return (
      <div className="flex flex-1 items-center justify-center">
        <StateMessage
          icon={Presentation}
          title="Could not load your dashboard"
          description={getApiErrorMessage(error, "Please try again in a moment.")}
          action={<Button className="rounded-full px-5" onClick={reload}>Try again</Button>}
        />
      </div>
    );

  const { dashboard, courses } = data;
  const next = dashboard.upcomingSessions[0];

  return (
    <>
      <ManageHeader
        eyebrow="Instructor dashboard"
        title={`${greeting()}, ${user?.firstName ?? "there"} 👋`}
        description={
          dashboard.pendingSubmissions > 0
            ? `You have ${dashboard.pendingSubmissions} submission${dashboard.pendingSubmissions === 1 ? "" : "s"} waiting for a grade.`
            : "You're all caught up on grading. Nice work!"
        }
      />

      <div className={cn(pageContainer, "flex flex-col gap-8 py-10")}>
        {/* Numbers */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile label="My courses" value={dashboard.courseCount} icon={BookOpen} />
          <StatTile label="Students" value={dashboard.studentCount} icon={Users} />
          <StatTile label="Upcoming sessions" value={dashboard.upcomingSessionCount} icon={CalendarClock} />
          <StatTile label="Waiting for grading" value={dashboard.pendingSubmissions} icon={ClipboardCheck} hint="Submitted assignments" tone="warning" />
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          {/* Upcoming sessions */}
          <Reveal>
            <section className={cn(panelStyle, "overflow-hidden")}>
              {next && (
                <div className="relative overflow-hidden bg-primary p-5 text-primary-foreground">
                  <div aria-hidden className="bg-andalusia-pattern pointer-events-none absolute inset-0 opacity-15" />
                  <p className="relative text-xs font-semibold tracking-[0.2em] text-sand uppercase">Next up</p>
                  <p className="relative mt-2 text-lg font-semibold">{next.title}</p>
                  <p className="relative text-sm text-primary-foreground/70">{next.courseTitle}</p>
                  <div className="relative mt-4 [&_p]:text-sand">
                    <Countdown target={next.startTime} />
                  </div>
                </div>
              )}
              <div className="p-5">
                <h2 className="text-lg font-semibold">Upcoming sessions</h2>
                {dashboard.upcomingSessions.length === 0 ? (
                  <p className="mt-2 text-sm text-muted-foreground">No upcoming sessions. Plan one from a course page.</p>
                ) : (
                  <ul className="mt-3 flex flex-col gap-1">
                    {dashboard.upcomingSessions.map((session) => (
                      <li key={session.id}>
                        <Link
                          to={`/instructor/courses/${session.courseId}`}
                          className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors outline-none hover:bg-secondary/60 focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                          <span className="mt-1.5 size-2 shrink-0 rounded-full bg-sand" aria-hidden />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium">{session.title}</span>
                            <span className="block text-xs text-muted-foreground">
                              {session.courseTitle} · {formatDateTime(session.startTime)}
                            </span>
                            {session.location && (
                              <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin aria-hidden className="size-3" /> {session.location}
                              </span>
                            )}
                          </span>
                          <ArrowRight aria-hidden className="mt-1 size-4 text-muted-foreground opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </Reveal>

          {/* My courses */}
          <section>
            <h2 className="mb-3 text-lg font-semibold">My courses</h2>
            {courses.length === 0 ? (
              <EmptyNote icon={BookOpen} title="No courses yet" description="An admin will assign you to a course. It will show up here." />
            ) : (
              <ul className="grid gap-5 md:grid-cols-2">
                {courses.map((course, index) => {
                  const fill = course.capacity ? Math.round((course.studentCount / course.capacity) * 100) : 0;
                  return (
                    <li
                      key={course.id}
                      className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500"
                      style={{ animationDelay: `${index * 90}ms` }}
                    >
                      <article className={cn(panelStyle, "group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 motion-reduce:hover:translate-y-0")}>
                        <div className="relative">
                          <CoverImage src={course.imageUrl} title={course.title} className="aspect-[16/7]" imageClassName="transition duration-500 group-hover:scale-105" />
                          <StatusPill status={STATUS_META[course.status]} className="absolute top-3 left-3 bg-white/95 shadow-sm ring-0" />
                          {course.pendingSubmissions > 0 && (
                            <Chip tone="warning" className="absolute top-3 right-3 shadow-sm">
                              {course.pendingSubmissions} to grade
                            </Chip>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col p-5">
                          <h3 className="text-lg leading-snug font-semibold">{course.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {course.startDate ? formatDate(course.startDate) : "TBA"} – {course.endDate ? formatDate(course.endDate) : "TBA"}
                            {course.location ? ` · ${course.location}` : ""}
                          </p>

                          <div className="mt-4">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Seats filled</span>
                              <span className="tabular-nums">
                                {course.studentCount}/{course.capacity}
                              </span>
                            </div>
                            <Progress value={fill} aria-label="Seats filled" className="mt-1.5 h-1.5 bg-secondary" />
                          </div>

                          <div className="mt-4 flex flex-wrap gap-1.5">
                            <Chip tone="outline">{course.sessionCount} sessions</Chip>
                            <Chip tone="outline">{course.assignmentCount} assignments</Chip>
                          </div>

                          <p className="mt-4 flex items-center gap-1.5 text-sm">
                            <CalendarClock aria-hidden className="size-4 text-sand-deep" />
                            {course.nextSessionAt ? `Next: ${formatDateTime(course.nextSessionAt)}` : "No session planned"}
                          </p>

                          <Button asChild className="mt-5 rounded-full px-5 sm:self-start">
                            <Link to={`/instructor/courses/${course.id}`}>
                              Manage course <ArrowRight data-icon="inline-end" />
                            </Link>
                          </Button>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default InstructorDashboardPage;
