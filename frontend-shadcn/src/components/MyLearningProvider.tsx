import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { MyLearningContext, type LearningState } from "@/lib/myLearningContext";
import { getMyApplications } from "@/services/applicationService";
import { getMyEnrollments } from "@/services/enrollmentService";
import { getMyCourses } from "@/services/learnerService";

type Snapshot = {
  // Whose data this is, so a different user never sees the previous one's badges
  userId: number;
  courses: Map<number, LearningState>;
  programs: Map<number, LearningState>;
};

// Loads the learner's courses, programs and unpaid applications once, so every course card and
// Apply button can tell "already enrolled" / "payment pending" without asking the API itself
function MyLearningProvider({ children }: { children: ReactNode }) {
  const { user, hasRole } = useAuth();
  const isLearner = hasRole("Learner");
  const userId = user?.id ?? null;
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!isLearner || userId === null) return;
    let cancelled = false;

    // A failed request just means no badges from that source
    Promise.allSettled([getMyCourses(), getMyEnrollments(), getMyApplications()]).then(
      ([coursesResult, enrollmentsResult, applicationsResult]) => {
        if (cancelled) return;
        const courses = new Map<number, LearningState>();
        const programs = new Map<number, LearningState>();

        // Unpaid applications first, so an enrollment below wins over them
        if (applicationsResult.status === "fulfilled") {
          for (const application of applicationsResult.value) {
            if (application.status !== "Submitted") continue;
            const state = { kind: "pending" as const, applicationId: application.id };
            if (application.courseId !== null) courses.set(application.courseId, state);
            if (application.programId !== null) programs.set(application.programId, state);
          }
        }

        // Every course I can open, directly or through a program
        if (coursesResult.status === "fulfilled") {
          for (const course of coursesResult.value) {
            if (course.enrollmentStatus === "Cancelled") continue;
            courses.set(course.id, {
              kind: "enrolled",
              status: course.enrollmentStatus,
              viaProgram: course.programTitle,
            });
          }
        }

        if (enrollmentsResult.status === "fulfilled") {
          for (const enrollment of enrollmentsResult.value) {
            if (enrollment.programId === null || enrollment.status === "Cancelled") continue;
            programs.set(enrollment.programId, { kind: "enrolled", status: enrollment.status, viaProgram: null });
          }
        }

        setSnapshot({ userId, courses, programs });
      },
    );

    return () => {
      cancelled = true;
    };
  }, [isLearner, userId, version]);

  const refresh = useCallback(() => setVersion((count) => count + 1), []);

  const value = useMemo(() => {
    // Signed out, not a learner, or still showing someone else's data: no badges
    const current = isLearner && snapshot?.userId === userId ? snapshot : null;
    return {
      courseState: (courseId: number) => current?.courses.get(courseId) ?? null,
      programState: (programId: number) => current?.programs.get(programId) ?? null,
      refresh,
    };
  }, [isLearner, snapshot, userId, refresh]);

  return <MyLearningContext.Provider value={value}>{children}</MyLearningContext.Provider>;
}

export default MyLearningProvider;
