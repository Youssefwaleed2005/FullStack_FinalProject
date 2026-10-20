import { useCallback } from "react";
import { CalendarDays, CloudOff } from "lucide-react";
import LoadingState from "@/components/LoadingState";
import StateMessage from "@/components/StateMessage";
import StatusPill from "@/components/StatusPill";
import { useApiData } from "@/hooks/useApiData";
import { formatDateTime } from "@/lib/course";
import { ATTENDANCE_STATUS_META, type StatusMeta } from "@/lib/status";
import { panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/services/api";
import { getLearnerSessions } from "@/services/learnerService";
import type { LearnerSession } from "@/types/Learner";

const UPCOMING: StatusMeta = { label: "Upcoming", dot: "bg-sky-500" };
const NOT_MARKED: StatusMeta = { label: "Not marked yet", dot: "bg-stone-300" };

function getSessionStatus(session: LearnerSession): StatusMeta {
  if (!session.isPast) return UPCOMING;
  if (!session.myAttendance) return NOT_MARKED;
  return ATTENDANCE_STATUS_META[session.myAttendance];
}

type LearnerSessionsTabProps = {
  courseId: number;
};

// Every session of the course, with the learner's own attendance
function LearnerSessionsTab({ courseId }: LearnerSessionsTabProps) {
  const loadSessions = useCallback(
    () => getLearnerSessions(courseId),
    [courseId],
  );
  const { data: sessions, loading, failed, error } = useApiData(loadSessions);

  if (loading) return <LoadingState label="Loading sessions…" />;

  if (failed || !sessions) {
    return (
      <StateMessage
        icon={CloudOff}
        title="Something went wrong"
        description={getApiErrorMessage(error, "Could not load sessions.")}
      />
    );
  }

  if (sessions.length === 0) {
    return (
      <StateMessage
        icon={CalendarDays}
        title="No sessions yet"
        description="Your instructor hasn't scheduled any sessions yet."
      />
    );
  }

  const past = sessions.filter((session) => session.isPast);
  const attended = past.filter(
    (session) =>
      session.myAttendance === "Present" || session.myAttendance === "Late",
  ).length;

  return (
    <section>
      <h2 className="text-xl font-semibold">Sessions</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        You attended {attended} of {past.length} past sessions.
      </p>

      <ul className={cn(panelStyle, "mt-5 divide-y")}>
        {sessions.map((session) => (
          <li
            key={session.id}
            className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="font-semibold">{session.title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {formatDateTime(session.startTime)}
                {session.location ? ` · ${session.location}` : ""}
              </p>
              {session.description && (
                <p className="mt-1.5 text-sm leading-relaxed">
                  {session.description}
                </p>
              )}
            </div>
            <StatusPill
              status={getSessionStatus(session)}
              className="self-start sm:self-center"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default LearnerSessionsTab;
