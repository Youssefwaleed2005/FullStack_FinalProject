import { useCallback } from "react";
import { CircleCheck, Gauge, Star, TriangleAlert, Users } from "lucide-react";
import BarChart from "@/components/charts/BarChart";
import Chip from "@/components/manage/Chip";
import PageSkeleton from "@/components/PageSkeleton";
import PersonCell from "@/components/manage/PersonCell";
import StatTile from "@/components/manage/StatTile";
import TableCard from "@/components/manage/TableCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useApiData } from "@/hooks/useApiData";
import { formatDate } from "@/lib/course";
import { panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/services/api";
import { getCourseInsights } from "@/services/instructorService";

const BUCKET_COLORS = ["bg-rose-500", "bg-amber-500", "bg-sky-500", "bg-emerald-500"];

// Charts for one course: average progress, progress spread, submissions per week, attendance, at-risk students
function InsightsTab({ courseId }: { courseId: number }) {
  const load = useCallback(() => getCourseInsights(courseId), [courseId]);
  const { data, loading, failed, error } = useApiData(load);

  if (loading) return <PageSkeleton variant="list" label="Loading insights…" />;
  if (failed || !data)
    return (
      <Alert variant="destructive">
        <AlertDescription>{getApiErrorMessage(error, "Could not load the insights.")}</AlertDescription>
      </Alert>
    );

  const maxBucket = Math.max(1, ...data.progressBuckets.map((b) => b.count));

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Students" value={data.studentCount} icon={Users} />
        <StatTile label="Average progress" value={data.averageProgress} suffix="%" icon={Gauge} />
        <StatTile label="Average score" value={data.averageScore ?? 0} suffix={data.averageScore === null ? "" : "%"} icon={Star} hint={data.averageScore === null ? "Nothing graded yet" : undefined} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={cn(panelStyle, "p-6")}>
          <h3 className="font-semibold">Progress spread</h3>
          <p className="text-sm text-muted-foreground">How many students are at each stage.</p>
          <ul className="mt-5 flex flex-col gap-3">
            {data.progressBuckets.map((bucket, i) => (
              <li key={bucket.label} className="flex items-center gap-3 text-sm">
                <span className="w-16 shrink-0 text-muted-foreground">{bucket.label}</span>
                <span className="h-6 flex-1 overflow-hidden rounded-lg bg-secondary">
                  <span
                    className={cn("flex h-full items-center justify-end rounded-lg pr-2 text-xs font-semibold text-white transition-all duration-700", BUCKET_COLORS[i])}
                    style={{ width: `${bucket.count === 0 ? 0 : Math.max(10, (bucket.count / maxBucket) * 100)}%` }}
                  >
                    {bucket.count > 0 ? bucket.count : ""}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className={cn(panelStyle, "p-6")}>
          <h3 className="font-semibold">Submissions per week</h3>
          <p className="text-sm text-muted-foreground">Last 8 weeks.</p>
          <div className="mt-5">
            <BarChart title="Submissions per week" bars={data.submissionsByWeek.map((w) => ({ label: w.label, value: w.count }))} barClassName="bg-violet-500" />
          </div>
        </section>
      </div>

      <section className={cn(panelStyle, "p-6")}>
        <h3 className="font-semibold">Attendance per session</h3>
        <p className="text-sm text-muted-foreground">Present or late, out of all students (last 8 sessions).</p>
        {data.attendanceBySession.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No sessions have taken place yet.</p>
        ) : (
          <div className="mt-5">
            <BarChart
              title="Attendance per session"
              bars={data.attendanceBySession.map((s) => ({
                label: formatDate(s.startTime).replace(/ \d{4}$/, ""),
                value: s.total ? Math.round((s.attended / s.total) * 100) : 0,
                hint: `${s.title}: ${s.attended}/${s.total} attended`,
              }))}
              formatValue={(v) => `${v}%`}
              barClassName="bg-teal-500"
            />
          </div>
        )}
      </section>

      <TableCard
        title="Students who need attention"
        description="Under 40% progress — a quick message can make a big difference."
      >
        {data.atRisk.length === 0 ? (
          <p className="flex items-center gap-2 p-5 text-sm text-emerald-700 dark:text-emerald-400">
            <CircleCheck aria-hidden className="size-4" /> Everyone is on track. Great work!
          </p>
        ) : (
          <ul className="divide-y divide-border/70">
            {data.atRisk.map((student) => (
              <li key={student.userId} className="flex flex-wrap items-center gap-4 px-5 py-3">
                <div className="min-w-48 flex-1">
                  <PersonCell name={student.fullName} detail={student.email} />
                </div>
                <Chip tone="danger">
                  <TriangleAlert aria-hidden className="size-3" /> {student.progressPercent}% progress
                </Chip>
                {student.missedSessions > 0 && <Chip tone="warning">{student.missedSessions} missed session{student.missedSessions === 1 ? "" : "s"}</Chip>}
                {student.missingAssignments > 0 && <Chip tone="warning">{student.missingAssignments} assignment{student.missingAssignments === 1 ? "" : "s"} not submitted</Chip>}
                <a href={`mailto:${student.email}`} className="rounded-sm text-sm font-medium text-sand-deep underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50">
                  Email
                </a>
              </li>
            ))}
          </ul>
        )}
      </TableCard>
    </div>
  );
}

export default InsightsTab;
