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

// ---------- Instructor side ----------

export type Session = {
  id: number;
  courseId: number;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  location: string | null;
  isPast: boolean;
  attendanceMarked: number;
};

export type SessionRequest = {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
};

export type MaterialRequest = {
  title: string;
  description?: string;
  type: MaterialType;
  url: string;
};

export type Assignment = {
  id: number;
  courseId: number;
  title: string;
  description: string | null;
  dueDate: string;
  maxScore: number;
  createdAt: string;
  isPastDue: boolean;
  submissionCount: number;
  gradedCount: number;
};

export type AssignmentRequest = {
  title: string;
  description?: string;
  dueDate: string;
  maxScore: number;
};

export type Submission = {
  id: number;
  assignmentId: number;
  userId: number;
  studentName: string;
  studentEmail: string;
  content: string | null;
  fileUrl: string | null;
  submittedAt: string;
  isLate: boolean;
  status: SubmissionStatus;
  score: number | null;
  maxScore: number;
  feedback: string | null;
  gradedAt: string | null;
};
