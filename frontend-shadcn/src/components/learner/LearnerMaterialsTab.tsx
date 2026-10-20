import { useCallback } from "react";
import {
  CirclePlay,
  CloudOff,
  ExternalLink,
  File,
  FileText,
  FolderOpen,
  Link2,
  type LucideIcon,
} from "lucide-react";
import LoadingState from "@/components/LoadingState";
import StateMessage from "@/components/StateMessage";
import { useApiData } from "@/hooks/useApiData";
import { formatDate } from "@/lib/course";
import { panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/services/api";
import { getLearnerMaterials } from "@/services/learnerService";
import type { MaterialType } from "@/types/Lms";

const MATERIAL_ICONS: Record<MaterialType, LucideIcon> = {
  Link: Link2,
  File: File,
  Video: CirclePlay,
  Document: FileText,
};

type LearnerMaterialsTabProps = {
  courseId: number;
};

// Links, files and videos the instructor shared with the course
function LearnerMaterialsTab({ courseId }: LearnerMaterialsTabProps) {
  const loadMaterials = useCallback(
    () => getLearnerMaterials(courseId),
    [courseId],
  );
  const { data: materials, loading, failed, error } = useApiData(loadMaterials);

  if (loading) return <LoadingState label="Loading materials…" />;

  if (failed || !materials) {
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

  return (
    <section>
      <h2 className="text-xl font-semibold">Materials</h2>

      <ul className={cn(panelStyle, "mt-5 divide-y")}>
        {materials.map((material) => {
          const Icon = MATERIAL_ICONS[material.type];

          return (
            <li key={material.id} className="flex gap-4 p-5">
              <span
                aria-hidden
                className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-sand-deep"
              >
                <Icon className="size-5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <a
                  href={material.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold break-words underline-offset-4 hover:text-sand-deep hover:underline"
                >
                  {material.title}
                  <ExternalLink aria-hidden className="size-3.5 shrink-0" />
                </a>
                {material.description && (
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {material.description}
                  </p>
                )}
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {material.type} · Added {formatDate(material.createdAt)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default LearnerMaterialsTab;
