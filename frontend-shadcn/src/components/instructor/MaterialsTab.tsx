import { useCallback, useState } from "react";
import { ExternalLink, FileText, Link2, Pencil, Plus, Trash, Video } from "lucide-react";
import MaterialViewerDialog from "@/components/learner/MaterialViewerDialog";
import MaterialFormDialog from "@/components/instructor/MaterialFormDialog";
import Chip from "@/components/manage/Chip";
import ConfirmDialog, { type ConfirmRequest } from "@/components/manage/ConfirmDialog";
import EmptyNote from "@/components/manage/EmptyNote";
import TableCard from "@/components/manage/TableCard";
import LoadingState from "@/components/LoadingState";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useApiData } from "@/hooks/useApiData";
import { formatDate } from "@/lib/course";
import { canPreview, resolveMaterialUrl } from "@/lib/materialLinks";
import { getApiErrorMessage } from "@/services/api";
import {
  createMaterial,
  deleteMaterial,
  getCourseMaterials,
  updateMaterial,
  uploadMaterial,
} from "@/services/instructorService";
import type { Material, MaterialRequest, MaterialType } from "@/types/Lms";

const TYPE_ICONS: Record<MaterialType, typeof FileText> = {
  Link: Link2,
  Video: Video,
  Document: FileText,
  File: FileText,
};

// Course materials: links, videos and uploaded files
function MaterialsTab({ courseId }: { courseId: number }) {
  const load = useCallback(() => getCourseMaterials(courseId), [courseId]);
  const { data: materials, loading, failed, error: loadError, reload } = useApiData(load);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Material | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [viewing, setViewing] = useState<Material | null>(null);
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);
  const [error, setError] = useState("");

  function openForm(material: Material | null) {
    setEditing(material);
    setFormKey((key) => key + 1);
    setFormOpen(true);
  }

  async function handleUpload(file: File, title: string, description?: string) {
    await uploadMaterial(courseId, file, title, description);
    setFormOpen(false);
    reload();
  }

  async function handleSave(payload: MaterialRequest) {
    if (editing) await updateMaterial(editing.id, payload);
    else await createMaterial(courseId, payload);
    setFormOpen(false);
    reload();
  }

  function askDelete(material: Material) {
    setConfirm({
      title: "Delete this material?",
      description: `"${material.title}" will be removed for every learner, along with their "done" ticks.`,
      confirmLabel: "Delete material",
      danger: true,
      onConfirm: async () => {
        try {
          await deleteMaterial(material.id);
          setError("");
          reload();
        } catch (err) {
          setError(getApiErrorMessage(err, "Could not delete the material."));
        }
      },
    });
  }

  function open(material: Material) {
    if (canPreview(material.url)) setViewing(material);
    else window.open(resolveMaterialUrl(material.url), "_blank", "noopener");
  }

  if (loading) return <LoadingState label="Loading materials…" />;
  if (failed || !materials)
    return (
      <Alert variant="destructive">
        <AlertDescription>{getApiErrorMessage(loadError, "Could not load materials.")}</AlertDescription>
      </Alert>
    );

  const addButton = (
    <Button className="rounded-full px-4" onClick={() => openForm(null)}>
      <Plus aria-hidden /> Add material
    </Button>
  );

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {materials.length === 0 ? (
        <EmptyNote icon={FileText} title="No materials yet" description="Share slides, PDFs, videos or useful links with your students." action={addButton} />
      ) : (
        <TableCard title="Materials" description={`${materials.length} shared`} action={addButton}>
          <ul className="divide-y divide-border/70">
            {materials.map((material) => {
              const Icon = TYPE_ICONS[material.type];
              return (
                <li key={material.id} className="flex flex-wrap items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/30">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sand/15 text-sand-deep">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => open(material)}
                        className="rounded-sm text-left font-semibold underline-offset-4 outline-none hover:text-sand-deep hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        {material.title}
                      </button>
                      <Chip tone="outline">{material.type}</Chip>
                      {material.url.startsWith("/") && <Chip tone="info">Uploaded</Chip>}
                    </div>
                    {material.description && <p className="mt-1 text-sm text-muted-foreground">{material.description}</p>}
                    <p className="mt-1 text-xs text-muted-foreground">Added {formatDate(material.createdAt)}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon-sm" aria-label={`Open ${material.title}`} onClick={() => open(material)}>
                      <ExternalLink />
                    </Button>
                    <Button variant="ghost" size="icon-sm" aria-label={`Edit ${material.title}`} onClick={() => openForm(material)}>
                      <Pencil />
                    </Button>
                    <Button variant="ghost" size="icon-sm" aria-label={`Delete ${material.title}`} className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => askDelete(material)}>
                      <Trash />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </TableCard>
      )}

      <MaterialFormDialog key={formKey} open={formOpen} material={editing} onClose={() => setFormOpen(false)} onSave={handleSave} onUpload={handleUpload} />

      {viewing && (
        <MaterialViewerDialog
          material={{ ...viewing, isCompleted: false, completedAt: null }}
          onClose={() => setViewing(null)}
          canComplete={false}
          busy={false}
          onToggleComplete={() => {}}
        />
      )}

      <ConfirmDialog request={confirm} onClose={() => setConfirm(null)} />
    </>
  );
}

export default MaterialsTab;
