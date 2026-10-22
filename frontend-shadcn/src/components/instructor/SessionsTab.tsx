import { useCallback, useState } from "react";
import { CalendarDays, ClipboardCheck, MapPin, Pencil, Plus, Trash } from "lucide-react";
import AttendanceDialog from "@/components/instructor/AttendanceDialog";
import SessionFormDialog from "@/components/instructor/SessionFormDialog";
import Chip from "@/components/manage/Chip";
import ConfirmDialog, { type ConfirmRequest } from "@/components/manage/ConfirmDialog";
import EmptyNote from "@/components/manage/EmptyNote";
import TableCard from "@/components/manage/TableCard";
import LoadingState from "@/components/LoadingState";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useApiData } from "@/hooks/useApiData";
import { formatDateTime } from "@/lib/course";
import { getApiErrorMessage } from "@/services/api";
import {
  createSession,
  deleteSession,
  getCourseSessions,
  updateSession,
} from "@/services/instructorService";
import type { Session, SessionRequest } from "@/types/Lms";

const dayFormat = new Intl.DateTimeFormat("en-GB", { day: "2-digit" });
const monthFormat = new Intl.DateTimeFormat("en-GB", { month: "short" });

function toDate(value: string) {
  return new Date(/[zZ]|[+-]\d\d:\d\d$/.test(value) ? value : `${value}Z`);
}

// Course sessions: add / edit / delete, and take attendance for past ones
function SessionsTab({ courseId, onChanged }: { courseId: number; onChanged?: () => void }) {
  const load = useCallback(() => getCourseSessions(courseId), [courseId]);
  const { data: sessions, loading, failed, error: loadError, reload } = useApiData(load);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Session | null>(null);
  const [formKey, setFormKey] = useState(0); // new key = fresh form
  const [attendanceFor, setAttendanceFor] = useState<number | null>(null);
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);
  const [error, setError] = useState("");

  function refresh() {
    reload();
    onChanged?.();
  }

  function openForm(session: Session | null) {
    setEditing(session);
    setFormKey((key) => key + 1);
    setFormOpen(true);
  }

  async function handleSave(payload: SessionRequest) {
    if (editing) await updateSession(editing.id, payload);
    else await createSession(courseId, payload);
    setFormOpen(false);
    refresh();
  }

  function askDelete(session: Session) {
    setConfirm({
      title: "Delete this session?",
      description: `"${session.title}" and its attendance records will be removed.`,
      confirmLabel: "Delete session",
      danger: true,
      onConfirm: async () => {
        try {
          await deleteSession(session.id);
          setError("");
          refresh();
        } catch (err) {
          setError(getApiErrorMessage(err, "Could not delete the session."));
        }
      },
    });
  }

  if (loading) return <LoadingState label="Loading sessions…" />;
  if (failed || !sessions)
    return (
      <Alert variant="destructive">
        <AlertDescription>{getApiErrorMessage(loadError, "Could not load sessions.")}</AlertDescription>
      </Alert>
    );

  const addButton = (
    <Button className="rounded-full px-4" onClick={() => openForm(null)}>
      <Plus aria-hidden /> Add session
    </Button>
  );

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {sessions.length === 0 ? (
        <EmptyNote icon={CalendarDays} title="No sessions yet" description="Plan your first class so learners know when to join." action={addButton} />
      ) : (
        <TableCard title="Sessions" description={`${sessions.length} planned`} action={addButton}>
          <ul className="divide-y divide-border/70">
            {sessions.map((session) => {
              const start = toDate(session.startTime);
              const needsAttendance = session.isPast && session.attendanceMarked === 0;
              return (
                <li key={session.id} className="flex flex-wrap items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/30">
                  <div
                    aria-hidden
                    className={
                      session.isPast
                        ? "flex w-14 shrink-0 flex-col items-center rounded-xl bg-secondary py-2 text-muted-foreground"
                        : "flex w-14 shrink-0 flex-col items-center rounded-xl bg-primary py-2 text-primary-foreground"
                    }
                  >
                    <span className="text-xl leading-none font-semibold">{dayFormat.format(start)}</span>
                    <span className="mt-1 text-[0.65rem] font-semibold tracking-wider uppercase">{monthFormat.format(start)}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{session.title}</p>
                      {!session.isPast ? (
                        <Chip tone="info">Upcoming</Chip>
                      ) : needsAttendance ? (
                        <Chip tone="warning">Needs attendance</Chip>
                      ) : (
                        <Chip tone="success">Attendance taken</Chip>
                      )}
                    </div>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      <span>{formatDateTime(session.startTime)}</span>
                      {session.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin aria-hidden className="size-3.5" />
                          {session.location}
                        </span>
                      )}
                    </p>
                    {session.description && <p className="mt-1 text-sm text-muted-foreground">{session.description}</p>}
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant={needsAttendance ? "default" : "outline"}
                      size="sm"
                      className="rounded-full px-3"
                      disabled={!session.isPast}
                      title={session.isPast ? undefined : "Available after the session starts"}
                      onClick={() => setAttendanceFor(session.id)}
                    >
                      <ClipboardCheck aria-hidden /> Attendance
                    </Button>
                    <Button variant="ghost" size="icon-sm" aria-label={`Edit ${session.title}`} onClick={() => openForm(session)}>
                      <Pencil />
                    </Button>
                    <Button variant="ghost" size="icon-sm" aria-label={`Delete ${session.title}`} className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => askDelete(session)}>
                      <Trash />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </TableCard>
      )}

      <SessionFormDialog key={formKey} open={formOpen} session={editing} onClose={() => setFormOpen(false)} onSave={handleSave} />

      {attendanceFor !== null && (
        <AttendanceDialog sessionId={attendanceFor} onClose={() => setAttendanceFor(null)} onSaved={refresh} />
      )}

      <ConfirmDialog request={confirm} onClose={() => setConfirm(null)} />
    </>
  );
}

export default SessionsTab;
