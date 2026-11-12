import { createContext } from "react";
import type { EnrollmentStatus } from "@/types/Enrollment";

// Where the signed-in learner stands with one course or program
export type LearningState =
  // Enrolled (directly, or through a program for a course); "Cancelled" never shows up here
  | { kind: "enrolled"; status: Exclude<EnrollmentStatus, "Cancelled">; viaProgram: string | null }
  // Applied but not paid yet
  | { kind: "pending"; applicationId: number }
  | null;

export type MyLearningContextValue = {
  courseState: (courseId: number) => LearningState;
  programState: (programId: number) => LearningState;
  // Load again, e.g. after applying or paying
  refresh: () => void;
};

// Filled in by MyLearningProvider, read with the useMyLearning hook
export const MyLearningContext = createContext<MyLearningContextValue | undefined>(undefined);
