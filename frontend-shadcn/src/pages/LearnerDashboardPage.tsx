import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  CloudOff,
  ListTodo,
  MapPin,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AccountLayout from "@/components/AccountLayout";
import CoverImage from "@/components/CoverImage";
import LoadingState from "@/components/LoadingState";
import StateMessage from "@/components/StateMessage";
import BadgeShelf from "@/components/fun/BadgeShelf";
import CountUp from "@/components/fun/CountUp";
import Countdown from "@/components/fun/Countdown";
import ProgressRing from "@/components/fun/ProgressRing";
import Reveal from "@/components/fun/Reveal";
import { Button } from "@/components/ui/button";
import { useApiData } from "@/hooks/useApiData";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardBadges } from "@/lib/badges";
import { formatDateTime } from "@/lib/course";
import { cardImageZoom, cardStyle, panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/services/api";
import { getLearnerDashboard } from "@/services/learnerService";
import type { LearnerCourse } from "@/types/Learner";

// "Good morning" / "Good afternoon" / "Good evening"
function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// A friendly line based on how far along the learner is
function encouragement(average: number): string {
  if (average >= 100) return "You finished everything. Legendary! 🏆";
  if (average >= 75) return "Almost at the finish line. Keep going! 🚀";
  if (average >= 40) return "Great momentum, you're well on your way. 💪";
  if (average > 0) return "Nice start! Every small step counts. 🌱";
  return "Ready when you are. Let's start learning! ✨";
}

function StatTile({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div
      className={cn(
        panelStyle,
        "flex items-center gap-4 p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5",
      )}
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-sand-deep">
        <Icon aria-hidden className="size-5" strokeWidth={1.75} />
      </span>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-heading text-3xl font-semibold">
          <CountUp value={value} suffix={suffix} />
        </p>
      </div>
    </div>
  );
}

function CourseTile({ course }: { course: LearnerCourse }) {
  return (
    <div className={cardStyle}>
      <CoverImage
        src={course.imageUrl}
        title={course.title}
        className="h-32"
        imageClassName={cardImageZoom}
      />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg leading-snug font-semibold">{course.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {course.instructorName ?? "Instructor to be announced"}
              {course.programTitle ? ` · ${course.programTitle}` : ""}
            </p>
          </div>
          <ProgressRing value={course.progressPercent} label={`${course.title}: ${course.progressPercent}% complete`} />
        </div>

        <div className="mt-auto pt-4">
          <div className="flex flex-wrap gap-2 text-xs">
            {course.pendingAssignments > 0 ? (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 font-medium text-amber-800">
                {course.pendingAssignments} to submit
              </span>
            ) : (
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-800">
                All caught up ✓
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Next session: {course.nextSessionAt ? formatDateTime(course.nextSessionAt) : "none planned"}
          </p>
          <Button asChild className="mt-4 w-full rounded-full">
            <Link to={`/learning/courses/${course.id}`}>
              {course.progressPercent >= 100 ? "Review" : course.progressPercent > 0 ? "Continue" : "Start"}
              <ArrowRight aria-hidden className="size-4 transition group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Learner home: greeting, next-session countdown, numbers, courses with rings, badges
function LearnerDashboardPage() {
  const { user } = useAuth();
  const { data, loading, failed, error } = useApiData(getLearnerDashboard);
  const nextSession = data?.upcomingSessions[0];

  return (
    <AccountLayout
      title={`${greeting()}, ${user?.firstName ?? ""}!`}
      description={data ? encouragement(data.averageProgress) : "Here is what's happening in your courses."}
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
          {/* Next session spotlight */}
          {nextSession && (
            <Reveal>
              <section className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground shadow-xl shadow-primary/20 sm:p-8">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-sand/30 blur-3xl"
                />
                <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-sand uppercase">
                      <Sparkles aria-hidden className="size-4" /> Next session
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">{nextSession.title}</h2>
                    <p className="mt-1 text-sm opacity-80">
                      {nextSession.courseTitle} · {formatDateTime(nextSession.startTime)}
                    </p>
                    {nextSession.location && (
                      <p className="mt-1 flex items-center gap-1.5 text-sm opacity-80">
                        <MapPin aria-hidden className="size-4" /> {nextSession.location}
                      </p>
                    )}
                  </div>
                  <Countdown target={nextSession.startTime} />
                </div>
              </section>
            </Reveal>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile icon={BookOpen} label="Active courses" value={data.activeCourseCount} />
            <StatTile icon={TrendingUp} label="Average progress" value={data.averageProgress} suffix="%" />
            <StatTile icon={CalendarClock} label="Upcoming sessions" value={data.upcomingSessionCount} />
            <StatTile icon={ListTodo} label="Assignments to do" value={data.pendingAssignmentCount} />
          </div>

          <Reveal>
            <section className={cn(panelStyle, "p-6")}>
              <BadgeShelf badges={getDashboardBadges(data)} />
            </section>
          </Reveal>

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
                  {data.courses.map((course, index) => (
                    <Reveal key={course.id} delay={index * 100}>
                      <CourseTile course={course} />
                    </Reveal>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-xl font-semibold">Upcoming sessions</h2>
              <ul className={cn(panelStyle, "mt-4 divide-y")}>
                {data.upcomingSessions.length === 0 ? (
                  <li className="p-5 text-sm text-muted-foreground">No upcoming sessions. Enjoy the break! ☕</li>
                ) : (
                  data.upcomingSessions.map((s) => (
                    <li key={s.id} className="p-5 transition hover:bg-accent/40">
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
