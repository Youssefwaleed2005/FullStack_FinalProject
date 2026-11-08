import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Award, Lock, Printer } from "lucide-react";
import DetailsLoadError from "@/components/DetailsLoadError";
import Logo from "@/components/Logo";
import PageSkeleton from "@/components/PageSkeleton";
import StateMessage from "@/components/StateMessage";
import { Button } from "@/components/ui/button";
import { useApiData } from "@/hooks/useApiData";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import { formatDate } from "@/lib/course";
import { pageContainer } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { getLearnerCourse } from "@/services/learnerService";

// Certificate of completion for a course the learner finished (100% progress).
// "Print / save as PDF" uses the browser's print dialog; the print styles hide everything else.
function CertificatePage() {
  const { id } = useParams();
  const courseId = Number(id);
  const { user } = useAuth();
  const load = useCallback(() => getLearnerCourse(courseId), [courseId]);
  const { data: course, loading, failed, error } = useApiData(load);
  usePageTitle(course ? `Certificate · ${course.title}` : undefined);

  if (loading) return <PageSkeleton variant="details" />;
  if (failed || !course)
    return <DetailsLoadError error={error} itemName="course" back={{ label: "Back to my learning", to: "/my-enrollments" }} />;

  const back = (
    <Button asChild variant="link" className="h-auto px-0 text-sand-deep">
      <Link to={`/learning/courses/${course.id}`}>
        <ArrowLeft data-icon="inline-start" /> Back to the course
      </Link>
    </Button>
  );

  if (course.progress.progressPercent < 100) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <StateMessage
          icon={Lock}
          title="Not unlocked yet"
          description={`Your certificate appears when you reach 100% in "${course.title}". You're at ${course.progress.progressPercent}% — keep going!`}
          action={back}
        />
      </div>
    );
  }

  const learnerName = user ? `${user.firstName} ${user.lastName}` : "Learner";
  // The course end date once it has passed, otherwise today (finished early)
  const today = new Date().toISOString();
  const issued = formatDate(course.endDate && course.endDate < today ? course.endDate : today);
  const certificateId = `AA-${String(course.id).padStart(3, "0")}-${String(user?.id ?? 0).padStart(4, "0")}`;

  return (
    <div className={cn(pageContainer, "flex flex-col gap-6 py-10 print:p-0")}>
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        {back}
        <Button size="lg" className="rounded-full px-5" onClick={() => window.print()}>
          <Printer data-icon="inline-start" /> Print / save as PDF
        </Button>
      </div>

      {/* The certificate itself (landscape A4 proportions) */}
      <article
        id="certificate"
        aria-label={`Certificate of completion for ${learnerName}`}
        className="relative mx-auto aspect-[1.414] w-full max-w-5xl overflow-hidden rounded-2xl border-[10px] border-double border-sand-deep/70 bg-[#fffaf2] text-[#3b2a1a] shadow-2xl shadow-primary/15 print:max-w-none print:rounded-none print:shadow-none"
      >
        <div aria-hidden className="bg-andalusia-pattern pointer-events-none absolute inset-0 opacity-25" />
        <div aria-hidden className="pointer-events-none absolute inset-4 rounded-lg border border-sand-deep/40 sm:inset-6" />

        <div className="relative flex h-full flex-col items-center justify-between px-6 py-6 text-center sm:px-16 sm:py-12">
          <div className="flex flex-col items-center gap-2">
            <Logo />
            <p className="mt-1 text-[0.6rem] font-semibold tracking-[0.35em] text-[#9a6a3a] uppercase sm:text-xs">
              Certificate of completion
            </p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-xs text-[#6b5440] sm:text-base">This certifies that</p>
            <p className="mt-1 font-heading text-2xl font-semibold sm:mt-3 sm:text-5xl">{learnerName}</p>
            <div aria-hidden className="mt-2 h-px w-40 bg-[#c8955c] sm:mt-4 sm:w-72" />
            <p className="mt-2 text-xs text-[#6b5440] sm:mt-4 sm:text-base">has successfully completed the course</p>
            <p className="mt-1 font-heading text-lg font-semibold text-[#7a4f2a] sm:mt-2 sm:text-3xl">{course.title}</p>
            <p className="mt-1 text-[0.65rem] text-[#6b5440] sm:mt-2 sm:text-sm">
              {course.durationHours} hours · {course.categoryName}
              {course.progress.averageScore !== null ? ` · Average score ${course.progress.averageScore}%` : ""}
            </p>
          </div>

          <div className="grid w-full grid-cols-3 items-end gap-4 text-[0.6rem] sm:text-sm">
            <div className="flex flex-col items-center">
              <span className="font-medium">{issued}</span>
              <span className="mt-1 w-full border-t border-[#c8955c] pt-1 text-[#6b5440]">Date</span>
            </div>
            <div className="flex justify-center">
              <span className="flex size-12 items-center justify-center rounded-full border-2 border-[#c8955c] bg-[#c8955c]/15 text-[#7a4f2a] sm:size-20">
                <Award aria-hidden className="size-6 sm:size-10" />
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-heading font-medium italic">{course.instructor?.fullName ?? "Andalusia Academy"}</span>
              <span className="mt-1 w-full border-t border-[#c8955c] pt-1 text-[#6b5440]">Instructor</span>
            </div>
          </div>

          <p className="text-[0.55rem] tracking-wider text-[#9a8470] sm:text-xs">Certificate ID {certificateId}</p>
        </div>
      </article>
    </div>
  );
}

export default CertificatePage;
