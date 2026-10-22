import { useCallback, useState } from "react";
import { ClipboardList, Pencil, Plus, Trash } from "lucide-react";
import AssignmentFormDialog from "@/components/instructor/AssignmentFormDialog";
import SubmissionsDialog from "@/components/instructor/SubmissionsDialog";
import Chip from "@/components/manage/Chip";
import ConfirmDialog, { type ConfirmRequest } from "@/components/manage/ConfirmDialog";
import EmptyNote from "@/components/manage/EmptyNote";
import TableCard from "@/components/manage/TableCard";
import LoadingState from "@/components/LoadingState";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useApiData } from "@/hooks/useApiData";
import { formatDateTime } from "@/lib/course";
import { getApiErrorMessage } from "@/services/api";
import {
  createAssignment,
  deleteAssignment,
  getCourseAssignments,
  updateAssignment,
} from "@/services/instructorService";
import type { Assignment, AssignmentRequest } from "@/types/Lms";

// Course assignments: add / edit / delete, and grade submissions
function AssignmentsTab({ courseId, onChanged }: { courseId: number; onChanged?: () => void }) {
  const load = useCallback(() => getCourseAssignments(courseId), [courseId]);
  const { data: assignments, loading, failed, error: loadError, reload } = useApiData(load);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Assignment | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [viewing, setViewing] = useState<Assignment | null>(null);
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);
  const [error, setError] = useState("");

  function refresh() {
    reload();
    onChanged?.();
  }

  function openForm(assignment: Assignment | null) {
    setEditing(assignment);
    setFormKey((key) => key + 1);
    setFormOpen(true);
  }

  async function handleSave(payload: AssignmentRequest) {
    if (editing) await updateAssignment(editing.id, payload);
    else await createAssignment(courseId, payload);
    setFormOpen(false);
    refresh();
  }

  function askDelete(assignment: Assignment) {
    setConfirm({
      title: "Delete this assignment?",
      description: `"${assignment.title}" and all of its submissions and grades will be removed.`,
      confirmLabel: "Delete assignment",
      danger: true,
      onConfirm: async () => {
        try {
          await deleteAssignment(assignment.id);
          setError("");
          refresh();
        } catch (err) {
          setError(getApiErrorMessage(err, "Could not delete the assignment."));
        }
      },
    });
  }

  if (loading) return <LoadingState label="Loading assignments…" />;
  if (failed || !assignments)
    return (
      <Alert variant="destructive">
        <AlertDescription>{getApiErrorMessage(loadError, "Could not load assignments.")}</AlertDescription>
      </Alert>
    );

  const addButton = (
    <Button className="rounded-full px-4" onClick={() => openForm(null)}>
      <Plus aria-hidden /> Add assignment
    </Button>
  );

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {assignments.length === 0 ? (
        <EmptyNote icon={ClipboardList} title="No assignments yet" description="Create an assignment and grade submissions right here." action={addButton} />
      ) : (
        <TableCard title="Assignments" description={`${assignments.length} in this course`} action={addButton}>
          <ul className="divide-y divide-border/70">
            {assignments.map((assignment) => {
              const toGrade = assignment.submissionCount - assignment.gradedCount;
              const gradedPercent = assignment.submissionCount
                ? Math.round((assignment.gradedCount / assignment.submissionCount) * 100)
                : 0;
              return (
                <li key={assignment.id} className="flex flex-wrap items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/30">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{assignment.title}</p>
                      {assignment.isPastDue ? <Chip>Past due</Chip> : <Chip tone="info">Open</Chip>}
                      {toGrade > 0 && <Chip tone="warning">{toGrade} to grade</Chip>}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Due {formatDateTime(assignment.dueDate)} · {assignment.maxScore} points
                    </p>
                    <div className="mt-2 flex max-w-xs items-center gap-2">
                      <Progress value={gradedPercent} aria-label="Graded" className="h-1.5 flex-1 bg-secondary" />
                      <span className="text-xs whitespace-nowrap text-muted-foreground">
                        {assignment.gradedCount}/{assignment.submissionCount} graded
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant={toGrade > 0 ? "default" : "outline"}
                      size="sm"
                      className="rounded-full px-3"
                      onClick={() => setViewing(assignment)}
                    >
                      Submissions ({assignment.submissionCount})
                    </Button>
                    <Button variant="ghost" size="icon-sm" aria-label={`Edit ${assignment.title}`} onClick={() => openForm(assignment)}>
                      <Pencil />
                    </Button>
                    <Button variant="ghost" size="icon-sm" aria-label={`Delete ${assignment.title}`} className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => askDelete(assignment)}>
                      <Trash />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </TableCard>
      )}

      <AssignmentFormDialog key={formKey} open={formOpen} assignment={editing} onClose={() => setFormOpen(false)} onSave={handleSave} />

      {viewing && <SubmissionsDialog assignment={viewing} onClose={() => setViewing(null)} onGraded={refresh} />}

      <ConfirmDialog request={confirm} onClose={() => setConfirm(null)} />
    </>
  );
}

export default AssignmentsTab;
