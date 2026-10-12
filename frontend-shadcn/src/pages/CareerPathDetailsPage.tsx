import { useCallback } from "react";
import { useParams } from "react-router-dom";
import CourseCard from "@/components/CourseCard";
import DetailsHeader from "@/components/DetailsHeader";
import DetailsLoadError from "@/components/DetailsLoadError";
import LoadingState from "@/components/LoadingState";
import ProgramCard from "@/components/ProgramCard";
import SectionHeading from "@/components/SectionHeading";
import { useApiData } from "@/hooks/useApiData";
import { pageContainer, panelStyle } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getCareerPathById } from "@/services/careerPathService";

// Reads the id from the URL and gives each career path its own fresh page
function CareerPathDetailsPage() {
  const { id } = useParams();
  return <CareerPathDetailsContent key={id} careerPathId={Number(id)} />;
}

type CareerPathDetailsContentProps = {
  careerPathId: number;
};

function CareerPathDetailsContent({
  careerPathId,
}: CareerPathDetailsContentProps) {
  const loadCareerPath = useCallback(
    () => getCareerPathById(careerPathId),
    [careerPathId],
  );
  const { data: careerPath, loading, failed, error } = useApiData(loadCareerPath);

  if (loading) return <LoadingState label="Loading career path…" />;

  if (failed || !careerPath) {
    return (
      <DetailsLoadError
        error={error}
        itemName="career path"
        back={{ label: "Back to career paths", to: "/career-paths" }}
      />
    );
  }

  const skills = (careerPath.recommendedSkills ?? "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  return (
    <>
      <DetailsHeader
        parent={{ label: "Career paths", to: "/career-paths" }}
        title={careerPath.title}
        description={careerPath.shortDescription}
        image={careerPath.imageUrl ? { src: careerPath.imageUrl } : undefined}
      />

      {(careerPath.overview || skills.length > 0) && (
        <div
          className={cn(
            pageContainer,
            "grid gap-10 py-12",
            careerPath.overview && skills.length > 0 && "lg:grid-cols-[1fr_22rem] lg:items-start",
          )}
        >
          {careerPath.overview && (
            <section>
              <h2 className="text-2xl font-semibold">Career overview</h2>
              <p className="mt-4 leading-relaxed whitespace-pre-line text-muted-foreground">
                {careerPath.overview}
              </p>
            </section>
          )}

          {skills.length > 0 && (
            <section className={cn(panelStyle, "p-6")}>
              <h2 className="text-xl font-semibold">Recommended skills</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-sand/60 bg-accent/60 px-3 py-1.5 text-sm font-medium text-accent-foreground"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {/* The learning journey */}
      <section className="border-y border-border/70 bg-secondary/40">
        <div className={cn(pageContainer, "py-14")}>
          <SectionHeading
            eyebrow="Step by step"
            title="Recommended programs"
            description="Follow these programs in order to build the skills for this career."
          />
          {careerPath.programs.length === 0 ? (
            <p className="text-muted-foreground">Programs will be announced soon.</p>
          ) : (
            <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {careerPath.programs.map((program) => (
                <li key={program.id}>
                  <ProgramCard program={program} />
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {careerPath.recommendedCourses.length > 0 && (
        <section className={cn(pageContainer, "py-14")}>
          <SectionHeading
            eyebrow="Inside the programs"
            title="Recommended courses"
            description="The courses included in the recommended programs, in learning order."
          />
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {careerPath.recommendedCourses.map((course) => (
              <li key={course.id}>
                <CourseCard course={course} />
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}

export default CareerPathDetailsPage;
