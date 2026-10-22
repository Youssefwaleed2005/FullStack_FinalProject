import { useEffect, useState } from "react";
import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import Avatar from "@/components/Avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDateTime } from "@/lib/course";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/services/api";
import { getSessionAttendance, markAttendance } from "@/services/instructorService";
import type { SessionAttendance } from "@/types/Instructor";
import type { AttendanceStatus } from "@/types/Lms";

const STATUSES: { value: AttendanceStatus; active: string }[] = [
  { value: "Present", active: "bg-emerald-600 text-white border-emerald-600" },
  { value: "Late", active: "bg-amber-500 text-white border-amber-500" },
  { value: "Absent", active: "bg-rose-600 text-white border-rose-600" },
  { value: "Excused", active: "bg-stone-500 text-white border-stone-500" },
];

type AttendanceDialogProps = {
  sessionId: number;
  onClose: () => void;
  onSaved: () => void;
};

// Roll call for one session: pick Present / Late / Absent / Excused per student
function AttendanceDialog({ sessionId, onClose, onSaved }: AttendanceDialogProps) {
  const [roster, setRoster] = useState<SessionAttendance | null>(null);
  const [statuses, setStatuses] = useState<Record<number, AttendanceStatus | null>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    getSessionAttendance(sessionId)
      .then((data) => {
        if (!active) return;
        setRoster(data);
        setStatuses(Object.fromEntries(data.students.map((s) => [s.userId, s.status])));
      })
      .catch((err) => {
        if (active) setError(getApiErrorMessage(err, "Could not load attendance."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [sessionId]);

  function setStatus(userId: number, status: AttendanceStatus) {
    setSaved(false);
    setStatuses((prev) => ({ ...prev, [userId]: prev[userId] === status ? null : status }));
  }

  function markAllPresent() {
    if (!roster) return;
    setSaved(false);
    setStatuses(Object.fromEntries(roster.students.map((s) => [s.userId, "Present" as const])));
  }

  async function handleSave() {
    const records = Object.entries(statuses)
      .filter(([, status]) => status !== null)
      .map(([userId, status]) => ({ userId: Number(userId), status: status as AttendanceStatus }));
    if (records.length === 0) return setError("Choose a status for at least one student.");

    setError("");
    setSaving(true);
    try {
      setRoster(await markAttendance(sessionId, { records }));
      setSaved(true);
      onSaved();
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save attendance."));
    } finally {
      setSaving(false);
    }
  }

  const marked = Object.values(statuses).filter(Boolean).length;
  const total = roster?.students.length ?? 0;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[calc(100svh-2rem)] gap-0 overflow-y-auto p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-border/70 p-5 pr-12">
          <DialogTitle className="text-xl">Attendance</DialogTitle>
          <DialogDescription>
            {roster ? `${roster.sessionTitle} · ${formatDateTime(roster.startTime)}` : "Loading…"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 p-5">
          {loading && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <LoaderCircle aria-hidden className="size-4 animate-spin" /> Loading students…
            </p>
          )}
          {error && (
            <Alert variant="destructive">
              <CircleAlert />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {saved && (
            <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800">
              <CircleCheck />
              <AlertDescription className="text-emerald-800">Attendance saved.</AlertDescription>
            </Alert>
          )}
          {roster && total === 0 && <p className="text-sm text-muted-foreground">No students enrolled.</p>}

          {roster && total > 0 && (
            <>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground">
                  {marked} of {total} marked
                </p>
                <Button variant="outline" size="sm" className="rounded-full px-3" onClick={markAllPresent}>
                  <CircleCheck aria-hidden /> Mark all present
                </Button>
              </div>
              <ul className="divide-y divide-border/70 rounded-xl border border-border/70">
                {roster.students.map((student) => (
                  <li key={student.userId} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar name={student.fullName} className="size-9 text-xs" />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{student.fullName}</p>
                        <p className="truncate text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                    <div role="radiogroup" aria-label={`Attendance for ${student.fullName}`} className="flex flex-wrap gap-1">
                      {STATUSES.map((status) => {
                        const selected = statuses[student.userId] === status.value;
                        return (
                          <button
                            key={status.value}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => setStatus(student.userId, status.value)}
                            className={cn(
                              "rounded-full border px-3 py-1 text-xs font-medium transition outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                              selected ? status.active : "border-border bg-card text-muted-foreground hover:text-foreground",
                            )}
                          >
                            {status.value}
                          </button>
                        );
                      })}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <DialogFooter className="mx-0 mb-0 px-5">
          <Button variant="outline" className="rounded-full px-4" onClick={onClose}>
            Close
          </Button>
          <Button className="rounded-full px-5" onClick={handleSave} disabled={saving || loading || total === 0}>
            {saving && <LoaderCircle aria-hidden className="animate-spin" />}
            {saving ? "Saving…" : "Save attendance"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AttendanceDialog;
