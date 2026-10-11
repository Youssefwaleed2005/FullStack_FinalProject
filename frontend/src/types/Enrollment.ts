export type EnrollmentStatus = "Active" | "Paused" | "Completed" | "Cancelled";

export type Enrollment = {
  id: number;
  status: EnrollmentStatus;
  enrolledAt: string;
  progressPercent: number;
  applicationId: number;
  targetType: "Course" | "Program";
  courseId: number | null;
  programId: number | null;
  targetTitle: string;
  imageUrl: string | null;
};
