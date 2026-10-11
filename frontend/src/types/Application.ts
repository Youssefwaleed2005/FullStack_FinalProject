export type ApplicationStatus =
  | "Submitted"
  | "Accepted"
  | "Rejected"
  | "Cancelled";

export type Application = {
  id: number;
  status: ApplicationStatus;
  notes: string | null;
  createdAt: string;
  reviewedAt: string | null;
  targetType: "Course" | "Program";
  courseId: number | null;
  programId: number | null;
  targetTitle: string;
  price: number;
};

export type CreateApplicationRequest = {
  courseId?: number;
  programId?: number;
  notes?: string;
};
