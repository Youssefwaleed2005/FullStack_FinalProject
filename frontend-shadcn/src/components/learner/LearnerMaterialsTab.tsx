import { useCallback, useState } from "react";
import {
  CirclePlay,
  CloudOff,
  File,
  FileText,
  FolderOpen,
  Link2,
  type LucideIcon,
} from "lucide-react";
import LoadingState from "@/components/LoadingState";
import StateMessage from "@/components/StateMessage";
import MaterialViewerDialog from "@/components/learner/MaterialViewerDialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useApiData } from "@/hooks/useApiData";
import { useCelebrate } from "@/hooks/useCelebrate";
import { formatDate } from "@/lib/course";
import { canPreview, resolveMaterialUrl } from "@/lib/materialLinks";
import { panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/services/api";
import { getLearnerMaterials, setMaterialCompletion } from "@/services/learnerService";
import type { LearnerMaterial } from "@/types/Learner";
import type { MaterialType } from "@/types/Lms";

const MATERIAL_ICONS: Record<MaterialType, LucideIcon> = {
  Link: Link2,
  File: File,
  Video: CirclePlay,
  Document: FileText,
};

const MATERIAL_LABELS: Record<MaterialType, string> = {
  Link: "Link",
  File: "File",
  Video: "Video",
  Document: "PDF / document",
};

type LearnerMaterialsTabProps = {
  courseId: number;
  canComplete: boolean; // false when the enrollment is read-only
  onProgressChanged: () => void; // reloads the course header progress bar
};

// Links, PDFs and videos the instructor shared — tick them off to move your progress
function LearnerMaterialsTab({
  courseId,
  canComplete,
  onProgressChanged,
}: LearnerMaterialsTabProps) {
  const loadMaterials = useCallback(() => getLearnerMaterials(courseId), [courseId]);
  const { data, loading, failed, error } = useApiData(loadMaterials);

  // Ticks changed on this page (shown instantly, on top of the loaded data)
  const [changes, setChanges] = useState<
    Record<number, Pick<LearnerMaterial, "isCompleted" | "completedAt">>
  >({});
  const [busyId, setBusyId] = useState<number | null>(null);
  const { celebrate } = useCelebrate();
  const [viewingId, setViewingId] = useState<number | null>(null);
  const [saveError, setSaveError] = useState("");

  const materials: LearnerMaterial[] = (data ?? []).map((m) => ({ ...m, ...changes[m.id] }));

  async function toggle(material: LearnerMaterial) {
    setBusyId(material.id);
    setSaveError("");
    try {
      const result = await setMaterialCompletion(material.id, !material.isCompleted);
      setChanges((prev) => ({
        ...prev,
        [material.id]: {
          isCompleted: result.isCompleted,
          completedAt: result.isCompleted ? new Date().toISOString() : null,
        },
      }));
      if (result.isCompleted) {
        celebrate({
          emoji: "✅",
          title: "Nice work!",
          message: `"${material.title}" is done. Your progress is now ${result.progress.progressPercent}%.`,
        });
      }
      onProgressChanged();
    } catch (err) {
      setSaveError(getApiErrorMessage(err, "Could not update this material."));
    } finally {
      setBusyId(null);
    }
  }

  function open(material: LearnerMaterial) {
    if (canPreview(material.url)) setViewingId(material.id);
    else window.open(resolveMaterialUrl(material.url), "_blank", "noopener");
  }

  if (loading) return <LoadingState label="Loading materials…" />;

  if (failed || !data) {
    return (
      <StateMessage
        icon={CloudOff}
        title="Something went wrong"
        description={getApiErrorMessage(error, "Could not load materials.")}
      />
    );
  }

  if (materials.length === 0) {
    return (
      <StateMessage
        icon={FolderOpen}
        title="No materials yet"
        description="Your instructor will add them here."
      />
    );
  }

  const done = materials.filter((m) => m.isCompleted).length;
  const viewing = materials.find((m) => m.id === viewingId) ?? null;

  return (
    <section>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-semibold">Materials</h2>
        <span className="text-sm font-semibold">
          {done} / {materials.length} done
        </span>
      </div>
      <Progress
        value={Math.round((done * 100) / materials.length)}
        aria-label="Materials completed"
        className="mt-3"
      />

      {saveError && <p className="mt-3 text-sm text-destructive">{saveError}</p>}

      <ul className={cn(panelStyle, "mt-5 divide-y")}>
        {materials.map((material) => {
          const Icon = MATERIAL_ICONS[material.type];

          return (
            <li
              key={material.id}
              className={cn("flex items-center gap-4 p-5", material.isCompleted && "opacity-75")}
            >
              <Checkbox
                checked={material.isCompleted}
                onCheckedChange={() => toggle(material)}
                disabled={!canComplete || busyId === material.id}
                aria-label={`Mark ${material.title} as done`}
                className="size-5"
              />
              <span
                aria-hidden
                className="hidden size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-sand-deep sm:flex"
              >
                <Icon className="size-5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn("font-semibold break-words", material.isCompleted && "line-through")}>
                  {material.title}
                </p>
                {material.description && (
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {material.description}
                  </p>
                )}
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {MATERIAL_LABELS[material.type]} · Added {formatDate(material.createdAt)}
                  {material.isCompleted && material.completedAt
                    ? ` · Done ${formatDate(material.completedAt)}`
                    : ""}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => open(material)}>
                {material.type === "Video" ? "Watch" : "Open"}
              </Button>
            </li>
          );
        })}
      </ul>

      {viewing && (
        <MaterialViewerDialog
          material={viewing}
          onClose={() => setViewingId(null)}
          canComplete={canComplete}
          busy={busyId === viewing.id}
          onToggleComplete={() => toggle(viewing)}
        />
      )}
    </section>
  );
}

export default LearnerMaterialsTab;
