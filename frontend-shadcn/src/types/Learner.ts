import type { CourseStatus } from "@/types/Course";
import type { EnrollmentStatus } from "@/types/Enrollment";
import type { AttendanceStatus, Material, SubmissionStatus } from "@/types/Lms";

export type LearnerCourse = {
  id: number;
  title: string;
  imageUrl: string | null;
  status: CourseStatus;
  startDate: string | null;
  endDate: string | null;
  schedule: string | null;
  location: string | null;
  instructorName: string | null;
  programTitle: string | null;
  enrollmentStatus: EnrollmentStatus;
  progressPercent: number;
  nextSessionAt: string | null;
  pendingAssignments: number;
};

export type LearnerInstructor = {
  id: number;
  fullName: string;
  email: string;
  specialization: string | null;
  bio: string | null;
  photoUrl: string | null;
};

export type LearnerProgress = {
  attendedSessions: number;
  pastSessions: number;
  submittedAssignments: number;
  totalAssignments: number;
  completedMaterials: number;
  totalMaterials: number;
  averageScore: number | null;
  progressPercent: number;
};

export type LearnerCourseDetail = {
  id: number;
  title: string;
  shortDescription: string | null;
  fullDescription: string | null;
  objectives: string | null;
  imageUrl: string | null;
  categoryName: string;
  status: CourseStatus;
  durationHours: number;
  startDate: string | null;
  endDate: string | null;
  schedule: string | null;
  location: string | null;
  instructor: LearnerInstructor | null;
  programTitle: string | null;
  enrollmentStatus: EnrollmentStatus;
  canSubmit: boolean;
  progress: LearnerProgress;
};

export type LearnerSession = {
  id: number;
  courseId: number;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  location: string | null;
  isPast: boolean;
  myAttendance: AttendanceStatus | null;
};

export type MySubmission = {
  id: number;
  content: string | null;
  fileUrl: string | null;
  submittedAt: string;
  isLate: boolean;
  status: SubmissionStatus;
  score: number | null;
  feedback: string | null;
  gradedAt: string | null;
};

export type LearnerAssignment = {
  id: number;
  courseId: number;
  title: string;
  description: string | null;
  dueDate: string;
  maxScore: number;
  isPastDue: boolean;
  mySubmission: MySubmission | null;
};

export type SubmitAssignmentRequest = {
  content?: string;
  fileUrl?: string; // send undefined, never "" (backend [Url] rejects empty strings)
};

export type UpcomingSession = {
  id: number;
  courseId: number;
  courseTitle: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string | null;
};

export type LearnerDashboard = {
  activeCourseCount: number;
  upcomingSessionCount: number;
  pendingAssignmentCount: number;
  averageProgress: number;
  upcomingSessions: UpcomingSession[];
  courses: LearnerCourse[];
};

// One entry on the learner calendar: a class session or an assignment deadline
export type CalendarEvent =
  | { kind: "session"; key: string; courseId: number; courseTitle: string; session: LearnerSession }
  | { kind: "deadline"; key: string; courseId: number; courseTitle: string; assignment: LearnerAssignment };

export type LearnerCalendar = {
  // Courses the learner can open; 0 means "not enrolled anywhere yet"
  courseCount: number;
  events: CalendarEvent[];
};

// A material + "did I finish it?"
export type LearnerMaterial = Material & {
  isCompleted: boolean;
  completedAt: string | null;
};

export type MaterialCompletionResult = {
  materialId: number;
  isCompleted: boolean;
  progress: LearnerProgress;
};
