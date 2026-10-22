import { useCallback, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Info, Lock } from "lucide-react";
import DetailsHeader from "@/components/DetailsHeader";
import DetailsLoadError from "@/components/DetailsLoadError";
import BadgeShelf from "@/components/fun/BadgeShelf";
import CountUp from "@/components/fun/CountUp";
import LoadingState from "@/components/LoadingState";
import StateMessage from "@/components/StateMessage";
import StatusPill from "@/components/StatusPill";
import LearnerAssignmentsTab from "@/components/learner/LearnerAssignmentsTab";
import LearnerMaterialsTab from "@/components/learner/LearnerMaterialsTab";
import LearnerOverviewTab from "@/components/learner/LearnerOverviewTab";
import LearnerSessionsTab from "@/components/learner/LearnerSessionsTab";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiData } from "@/hooks/useApiData";
import { useCelebrate } from "@/hooks/useCelebrate";
import { getCourseBadges } from "@/lib/badges";
import { STATUS_META, formatDate } from "@/lib/course";
import { pageContainer, panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getApiErrorMessage, hasStatus } from "@/services/api";
import { getLearnerCourse } from "@/services/learnerService";

const BACK = { label: "Back to my learning", to: "/my-enrollments" };

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "sessions", label: "Sessions & attendance" },
  { value: "materials", label: "Materials" },
  { value: "assignments", label: "Assignments" },
];

// Reads the id from the URL and gives each course its own fresh page
function LearnerCoursePage() {
  const { id } = useParams();
  return <LearnerCourseContent key={id} courseId={Number(id)} />;
}

type LearnerCourseContentProps = {
  courseId: number;
};

// The enrolled learner's view of a course: progress, sessions, materials and assignments
function LearnerCourseContent({ courseId }: LearnerCourseContentProps) {
  const loadCourse = useCallback(() => getLearnerCourse(courseId), [courseId]);
  // reload() runs after a submission, so the progress bar updates
  const { data: course, loading, failed, error, reload } =
    useApiData(loadCourse);

  // Big party the moment progress reaches 100% (not when the page opens already at 100%)
  const { celebrate } = useCelebrate();
  const percent = course?.progress.progressPercent;
  const previousPercent = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (percent === undefined) return;
    if (previousPercent.current !== undefined && previousPercent.current < 100 && percent >= 100) {
      celebrate({
        big: true,
        emoji: "🏆",
        title: "Course complete!",
        message: "You reached 100%. Amazing work!",
      });
    }
    previousPercent.current = percent;
  }, [percent, celebrate]);

  if (loading) return <LoadingState label="Loading course…" />;

  if (failed || !course) {
    // 403 means the learner is not enrolled in this course
    if (hasStatus(error, 403)) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <StateMessage
            icon={Lock}
            title="You can't open this course"
            description={getApiErrorMessage(
              error,
              "You are not enrolled in this course.",
            )}
            action={
              <Button asChild size="lg" className="rounded-full px-5">
                <Link to={BACK.to}>{BACK.label}</Link>
              </Button>
            }
          />
        </div>
      );
    }
    return <DetailsLoadError error={error} itemName="course" back={BACK} />;
  }

  const progress = course.progress;
  const facts = [
    course.categoryName,
    `${course.durationHours} hours`,
    course.programTitle && `Part of ${course.programTitle}`,
  ].filter(Boolean);
  const when = [
    course.startDate &&
      `${formatDate(course.startDate)} – ${course.endDate ? formatDate(course.endDate) : "TBA"}`,
    course.schedule,
    course.location,
  ].filter(Boolean);

  return (
    <>
      <DetailsHeader
        parent={{ label: "My learning", to: BACK.to }}
        title={course.title}
        description={course.shortDescription}
        badges={
          <>
            <StatusPill status={STATUS_META[course.status]} />
            {facts.map((fact) => (
              <span
                key={fact}
                className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground"
              >
                {fact}
              </span>
            ))}
          </>
        }
      />

      <div className={cn(pageContainer, "flex flex-col gap-8 py-10")}>
        <Button
          asChild
          variant="link"
          className="-mb-4 h-auto self-start px-0 text-sand-deep"
        >
          <Link to={BACK.to}>
            <ArrowLeft data-icon="inline-start" />
            {BACK.label}
          </Link>
        </Button>

        {/* Progress */}
        <section className={cn(panelStyle, "p-6")}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold">Your progress</h2>
            <span className="font-heading text-3xl font-semibold">
              <CountUp value={progress.progressPercent} suffix="%" />
            </span>
          </div>
          <Progress
            value={progress.progressPercent}
            aria-label="Course progress"
            className="mt-3 h-2 bg-secondary"
          />
          <p className="mt-3 text-sm text-muted-foreground">
            Attended {progress.attendedSessions}/{progress.pastSessions}{" "}
            sessions · Submitted {progress.submittedAssignments}/
            {progress.totalAssignments} assignments · Completed{" "}
            {progress.completedMaterials}/{progress.totalMaterials} materials
            {progress.averageScore !== null
              ? ` · Average score ${progress.averageScore}%`
              : ""}
          </p>
          {when.length > 0 && (
            <p className="mt-1 text-sm text-muted-foreground">
              {when.join(" · ")}
            </p>
          )}

          <div className="mt-6 border-t border-border/70 pt-5">
            <BadgeShelf badges={getCourseBadges(progress)} title="Course achievements" />
          </div>

          {!course.canSubmit && (
            <Alert className="mt-4">
              <Info />
              <AlertDescription>
                This enrollment is {course.enrollmentStatus.toLowerCase()}, so
                the course is read-only.
              </AlertDescription>
            </Alert>
          )}
        </section>

        <Tabs defaultValue="overview" className="gap-6">
          {/* Scrolls sideways on small screens */}
          <div className="-mx-4 overflow-x-auto border-b border-border/70 px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
            <TabsList variant="line" className="h-auto! pb-1">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-none px-3 py-2"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="overview">
            <LearnerOverviewTab course={course} />
          </TabsContent>
          <TabsContent value="sessions">
            <LearnerSessionsTab courseId={courseId} />
          </TabsContent>
          <TabsContent value="materials">
            <LearnerMaterialsTab
              courseId={courseId}
              canComplete={course.canSubmit}
              onProgressChanged={reload}
            />
          </TabsContent>
          <TabsContent value="assignments">
            <LearnerAssignmentsTab
              courseId={courseId}
              canSubmit={course.canSubmit}
              onSubmitted={reload}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default LearnerCoursePage;
