// Shared LMS types (sessions, materials, assignments)

export type AttendanceStatus = "Present" | "Absent" | "Late" | "Excused";
export type MaterialType = "Link" | "File" | "Video" | "Document";
export type SubmissionStatus = "Submitted" | "Graded";

export type Material = {
  id: number;
  courseId: number;
  title: string;
  description: string | null;
  type: MaterialType;
  url: string;
  createdAt: string;
};
