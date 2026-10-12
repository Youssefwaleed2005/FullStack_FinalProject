import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import ApplyButton from "@/components/ApplyButton";
import CoverImage from "@/components/CoverImage";
import DetailRow from "@/components/DetailRow";
import DetailsHeader from "@/components/DetailsHeader";
import DetailsLoadError from "@/components/DetailsLoadError";
import LoadingState from "@/components/LoadingState";
import ProgramCard from "@/components/ProgramCard";
import StatusPill from "@/components/StatusPill";
import { useApiData } from "@/hooks/useApiData";
import { STATUS_META, formatDate, formatPrice } from "@/lib/course";
import { pageContainer, panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getProgramById, getRelatedPrograms } from "@/services/programService";

// Reads the id from the URL and gives each program its own fresh page
function ProgramDetailsPage() {
  const { id } = useParams();
  return <ProgramDetailsContent key={id} programId={Number(id)} />;
}

type ProgramDetailsContentProps = {
  programId: number;
};

function ProgramDetailsContent({ programId }: ProgramDetailsContentProps) {
  const loadProgram = useCallback(
    () =>
      Promise.all([
        getProgramById(programId),
        // Related programs are a nice extra, so a failure there doesn't break the page
        getRelatedPrograms(programId).catch(() => []),
      ]),
    [programId],
  );
  const { data, loading, failed, error } = useApiData(loadProgram);

  if (loading) return <LoadingState label="Loading program…" />;

  if (failed || !data) {
    return (
      <DetailsLoadError
        error={error}
        itemName="program"
        back={{ label: "Back to programs", to: "/programs" }}
      />
    );
  }

  const [program, relatedPrograms] = data;
  const courses = [...program.courses].sort((a, b) => a.sortOrder - b.sortOrder);
  const totalHours = courses.reduce((sum, course) => sum + course.durationHours, 0);

  return (
    <>
      <DetailsHeader
        parent={{ label: "Programs", to: "/programs" }}
        title={program.title}
        description={program.shortDescription}
        image={{ src: program.imageUrl }}
        badges={
          <>
            <StatusPill status={STATUS_META[program.status]} />
            <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
              {program.categoryName}
            </span>
          </>
        }
      />

      <div
        className={cn(
          pageContainer,
          "grid gap-10 py-12 lg:grid-cols-[1fr_22rem] lg:items-start",
        )}
      >
        {/* Main column */}
        <div className="flex flex-col gap-12">
          {program.overview && (
            <section>
              <h2 className="text-2xl font-semibold">Overview</h2>
              <p className="mt-4 leading-relaxed whitespace-pre-line text-muted-foreground">
                {program.overview}
              </p>
            </section>
          )}

          {program.requirements && (
            <section>
              <h2 className="text-2xl font-semibold">Requirements</h2>
              <p className="mt-4 leading-relaxed whitespace-pre-line text-muted-foreground">
                {program.requirements}
              </p>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-semibold">Program structure</h2>
            {courses.length === 0 ? (
              <p className="mt-4 text-muted-foreground">
                Courses will be announced soon.
              </p>
            ) : (
              <>
                <p className="mt-2 text-sm text-muted-foreground">
                  {courses.length} {courses.length === 1 ? "course" : "courses"},
                  taken in this order.
                </p>
                <ol className="mt-5 flex flex-col gap-3">
                  {courses.map((course, index) => (
                    <li key={course.courseId}>
                      <Link
                        to={`/courses/${course.courseId}`}
                        className={cn(
                          panelStyle,
                          "group flex items-center gap-4 p-3 pr-4 transition outline-none hover:border-sand/70 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50",
                        )}
                      >
                        <CoverImage
                          src={course.imageUrl}
                          title={course.title}
                          className="size-16 shrink-0 rounded-xl"
                          letterClassName="text-3xl"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold tracking-[0.14em] text-sand-deep uppercase">
                            Step {index + 1}
                          </p>
                          <p className="mt-0.5 truncate font-semibold">
                            {course.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {course.durationHours} hours
                          </p>
                        </div>
                        <span
                          aria-hidden
                          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                        >
                          <ArrowUpRight className="size-4" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </section>
        </div>

        {/* Key facts and the apply button; stays in view while scrolling on desktop */}
        <aside className={cn(panelStyle, "p-6 lg:sticky lg:top-24")}>
          <p className="text-sm text-muted-foreground">Price</p>
          <p className="mt-1 font-heading text-4xl font-semibold">
            {formatPrice(program.price)}
          </p>
          {program.paymentInfo && (
            <p className="mt-2 text-sm text-muted-foreground">
              {program.paymentInfo}
            </p>
          )}
          <dl className="mt-5 divide-y border-y">
            <DetailRow label="Duration" value={`${program.durationWeeks} weeks`} />
            <DetailRow
              label="Courses"
              value={`${courses.length} (${totalHours} hours)`}
            />
            <DetailRow label="Location" value={program.location} />
            <DetailRow label="Schedule" value={program.schedule} />
            <DetailRow
              label="Starts"
              value={program.startDate ? formatDate(program.startDate) : null}
            />
            <DetailRow
              label="Ends"
              value={program.endDate ? formatDate(program.endDate) : null}
            />
            <DetailRow label="Capacity" value={`${program.capacity} students`} />
          </dl>

          <ApplyButton programId={program.id} status={program.status} />
        </aside>
      </div>

      {relatedPrograms.length > 0 && (
        <section className="border-t border-border/70 bg-secondary/40">
          <div className={cn(pageContainer, "py-14")}>
            <h2 className="text-3xl font-semibold">Related programs</h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPrograms.map((related) => (
                <li key={related.id}>
                  <ProgramCard program={related} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}

export default ProgramDetailsPage;
